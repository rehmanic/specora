import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Meeting from "../../database/models/meeting.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const rooms = new Map();

const uploadDir = path.join(__dirname, "../../uploads/recordings");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `recording_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /webm|mp4|mkv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed"));
    }
  },
});

router.post("/create-room", async (req, res) => {
  try {
    const { meetingId, hostId, hostName } = req.body;

    if (!meetingId || !hostId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const roomId = `room_${meetingId}_${Date.now()}`;

    rooms.set(roomId, {
      id: roomId,
      meetingId,
      hostId,
      hostName: hostName || "Host",
      participants: [],
      createdAt: new Date(),
      isActive: true,
      isRecording: false,
    });

    // Update meeting with room_id and meeting_link
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const meetingLink = `${frontendUrl}/meetings/room/${roomId}`;
    
    // Update the meeting in the database
    try {
      await Meeting.update(
        { 
          room_id: roomId,
          meeting_link: meetingLink 
        },
        { where: { id: meetingId } }
      );
    } catch (dbError) {
      console.error("Failed to update meeting in database:", dbError);
      // Continue anyway - the room is created
    }

    res.status(201).json({
      success: true,
      roomId,
      joinUrl: `/meetings/room/${roomId}`,
      meetingLink,
    });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ error: "Failed to create room" });
  }
});

router.get("/room/:roomId", (req, res) => {
  try {
    const { roomId } = req.params;
    const room = rooms.get(roomId);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.json({
      success: true,
      room: {
        id: room.id,
        meetingId: room.meetingId,
        hostId: room.hostId,
        hostName: room.hostName,
        participantCount: room.participants.length,
        isActive: room.isActive,
        createdAt: room.createdAt,
      },
    });
  } catch (error) {
    console.error("Error fetching room:", error);
    res.status(500).json({ error: "Failed to fetch room details" });
  }
});

router.post("/upload-recording", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No video file provided" });
    }

    const { roomId, meetingId } = req.body;
    const videoPath = `/recordings/${req.file.filename}`;

    res.json({
      success: true,
      videoPath,
      filename: req.file.filename,
      size: req.file.size,
    });
  } catch (error) {
    console.error("Error uploading recording:", error);
    res.status(500).json({ error: "Failed to upload recording" });
  }
});

router.get("/recordings/:filename", (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(uploadDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Recording not found" });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/webm",
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/webm",
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (error) {
    console.error("Error streaming recording:", error);
    res.status(500).json({ error: "Failed to stream recording" });
  }
});

router.delete("/room/:roomId", (req, res) => {
  try {
    const { roomId } = req.params;
    const room = rooms.get(roomId);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    room.isActive = false;
    rooms.delete(roomId);

    res.json({ success: true, message: "Room ended successfully" });
  } catch (error) {
    console.error("Error ending room:", error);
    res.status(500).json({ error: "Failed to end room" });
  }
});

export function setupVideoWebSocket(io) {
  io.on("connection", (socket) => {
    socket.on("join-room", ({ roomId, userId, userName }) => {
      socket.join(roomId);

      const room = rooms.get(roomId);
      if (room) {
        room.participants.push({ userId, userName, socketId: socket.id });
      }

      socket.to(roomId).emit("user-connected", {
        userId,
        userName,
        socketId: socket.id,
      });
    });

    socket.on("offer", ({ roomId, offer, targetSocketId }) => {
      io.to(targetSocketId).emit("offer", {
        offer,
        fromSocketId: socket.id,
      });
    });

    socket.on("answer", ({ roomId, answer, targetSocketId }) => {
      io.to(targetSocketId).emit("answer", {
        answer,
        fromSocketId: socket.id,
      });
    });

    socket.on("ice-candidate", ({ roomId, candidate, targetSocketId }) => {
      io.to(targetSocketId).emit("ice-candidate", {
        candidate,
        fromSocketId: socket.id,
      });
    });

    socket.on("start-recording", ({ roomId }) => {
      const room = rooms.get(roomId);
      if (room) {
        room.isRecording = true;
        socket.to(roomId).emit("recording-started");
      }
    });

    socket.on("stop-recording", ({ roomId }) => {
      const room = rooms.get(roomId);
      if (room) {
        room.isRecording = false;
        socket.to(roomId).emit("recording-stopped");
      }
    });

    socket.on("disconnect", () => {
      rooms.forEach((room, roomId) => {
        const index = room.participants.findIndex(
          (p) => p.socketId === socket.id
        );
        if (index !== -1) {
          const user = room.participants[index];
          room.participants.splice(index, 1);
          socket.to(roomId).emit("user-disconnected", { userId: user.userId });
        }
      });
    });
  });
}

export default router;
