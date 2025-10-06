# 🎓 Specora FYP Enhancement Guide - Building Custom Features

> **Making Your FYP Stand Out**: Transform the Meetings module into a unique, self-built system

---

## 🎯 **Why Custom Implementation?**

### Current Problem
- ❌ Just linking to Google Meet/Zoom (not impressive for FYP)
- ❌ No custom video conferencing
- ❌ No meeting recording preview
- ❌ Relying too much on third-party services

### FYP-Worthy Solution ✨
- ✅ **Custom Video Conferencing** using WebRTC
- ✅ **In-App Meeting Rooms** (no external links)
- ✅ **Meeting Recording & Playback** in your website
- ✅ **Real-time Collaboration** features
- ✅ **AI-Powered Features** (transcript, requirements extraction)

---

## 📋 **Implementation Roadmap**

### Phase 1: Custom Video Conferencing (2-3 weeks)
Build your own video meeting system using WebRTC

### Phase 2: Recording & Playback (1-2 weeks)
Record meetings and show them in your app

### Phase 3: AI Integration (2-3 weeks)
Analyze transcripts and extract requirements

### Phase 4: Real-time Features (1 week)
Chat, screen sharing, whiteboard

---

## 🚀 **Phase 1: Custom Video Conferencing with WebRTC**

### What You'll Build
- Video/audio calls directly in your website
- No external links needed
- Multi-participant support
- Screen sharing capability

### Technologies Needed

```json
{
  "backend": [
    "socket.io": "^4.7.2",
    "peer": "^1.0.2",
    "mediasoup": "^3.13.0"
  ],
  "frontend": [
    "socket.io-client": "^4.7.2",
    "simple-peer": "^9.11.1"
  ]
}
```

### Step-by-Step Implementation

#### 1. Install Dependencies

**Backend:**
```powershell
cd backend
npm install socket.io peer
```

**Frontend:**
```powershell
cd frontend
npm install socket.io-client simple-peer
```

#### 2. Create Video Server Route

Create `backend/modules/video/routes.js`:

```javascript
import express from "express";

const router = express.Router();
const rooms = new Map();

// Create meeting room
router.post("/create-room", async (req, res) => {
  const { meetingId, hostId } = req.body;
  const roomId = `room_${meetingId}_${Date.now()}`;
  
  rooms.set(roomId, {
    id: roomId,
    meetingId,
    hostId,
    participants: [],
    createdAt: new Date(),
    isActive: true,
    isRecording: false,
  });
  
  res.status(201).json({
    success: true,
    roomId,
    joinUrl: `/meetings/room/${roomId}`,
  });
});

// Get room info
router.get("/room/:roomId", (req, res) => {
  const room = rooms.get(req.params.roomId);
  if (!room) return res.status(404).json({ error: "Room not found" });
  res.json(room);
});

export default router;
```

#### 3. Setup WebSocket for Signaling

Update `backend/server.js`:

```javascript
import { Server } from "socket.io";
import http from "http";
import app from "./app.js";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// WebRTC Signaling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  
  socket.on("join-room", ({ roomId, userId, userName }) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", { userId, userName, socketId: socket.id });
    console.log(`${userName} joined ${roomId}`);
  });
  
  // WebRTC signaling
  socket.on("offer", ({ roomId, offer, targetSocketId }) => {
    io.to(targetSocketId).emit("offer", { offer, fromSocketId: socket.id });
  });
  
  socket.on("answer", ({ roomId, answer, targetSocketId }) => {
    io.to(targetSocketId).emit("answer", { answer, fromSocketId: socket.id });
  });
  
  socket.on("ice-candidate", ({ roomId, candidate, targetSocketId }) => {
    io.to(targetSocketId).emit("ice-candidate", { candidate, fromSocketId: socket.id });
  });
  
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server with WebRTC running on port ${PORT}`);
});
```

#### 4. Create Video Room Component (Frontend)

Create `frontend/src/components/meetings/VideoRoom.jsx`:

```javascript
"use client";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import SimplePeer from "simple-peer";
import { Button } from "@/components/ui/button";
import { Video, VideoOff, Mic, MicOff, PhoneOff, Monitor } from "lucide-react";

export default function VideoRoom({ roomId, userId, userName }) {
  const [peers, setPeers] = useState([]);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  
  const userVideo = useRef();
  const socketRef = useRef();
  const peersRef = useRef([]);
  
  useEffect(() => {
    // Get user media
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        userVideo.current.srcObject = stream;
        
        // Connect to socket
        socketRef.current = io("http://localhost:5000");
        
        // Join room
        socketRef.current.emit("join-room", { roomId, userId, userName });
        
        // Handle new user
        socketRef.current.on("user-connected", ({ socketId }) => {
          const peer = createPeer(socketId, socketRef.current.id, stream);
          peersRef.current.push({
            peerId: socketId,
            peer,
          });
          setPeers(users => [...users, { peerId: socketId, peer }]);
        });
        
        // Handle receiving offer
        socketRef.current.on("offer", ({ offer, fromSocketId }) => {
          const peer = addPeer(offer, fromSocketId, stream);
          peersRef.current.push({
            peerId: fromSocketId,
            peer,
          });
          setPeers(users => [...users, { peerId: fromSocketId, peer }]);
        });
        
        // Handle receiving answer
        socketRef.current.on("answer", ({ answer, fromSocketId }) => {
          const item = peersRef.current.find(p => p.peerId === fromSocketId);
          item?.peer.signal(answer);
        });
        
        // Handle ICE candidate
        socketRef.current.on("ice-candidate", ({ candidate, fromSocketId }) => {
          const item = peersRef.current.find(p => p.peerId === fromSocketId);
          item?.peer.signal(candidate);
        });
      });
    
    return () => {
      socketRef.current?.disconnect();
    };
  }, [roomId, userId, userName]);
  
  function createPeer(targetSocketId, mySocketId, stream) {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream,
    });
    
    peer.on("signal", signal => {
      socketRef.current.emit("offer", {
        roomId,
        offer: signal,
        targetSocketId,
      });
    });
    
    return peer;
  }
  
  function addPeer(incomingSignal, callerId, stream) {
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream,
    });
    
    peer.on("signal", signal => {
      socketRef.current.emit("answer", {
        roomId,
        answer: signal,
        targetSocketId: callerId,
      });
    });
    
    peer.signal(incomingSignal);
    return peer;
  }
  
  const toggleVideo = () => {
    const videoTrack = userVideo.current.srcObject.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
    setIsVideoOn(videoTrack.enabled);
  };
  
  const toggleAudio = () => {
    const audioTrack = userVideo.current.srcObject.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
    setIsAudioOn(audioTrack.enabled);
  };
  
  const leaveCall = () => {
    window.location.href = "/meetings";
  };
  
  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Video Grid */}
      <div className="flex-1 grid grid-cols-2 gap-4 p-4">
        {/* Your Video */}
        <div className="relative bg-gray-800 rounded-lg overflow-hidden">
          <video
            ref={userVideo}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded">
            <span className="text-white text-sm">{userName} (You)</span>
          </div>
        </div>
        
        {/* Other Participants */}
        {peers.map((peer, index) => (
          <VideoParticipant key={peer.peerId} peer={peer.peer} />
        ))}
      </div>
      
      {/* Controls */}
      <div className="bg-gray-800 p-4 flex justify-center gap-4">
        <Button
          onClick={toggleVideo}
          variant={isVideoOn ? "default" : "destructive"}
          size="lg"
          className="rounded-full w-14 h-14"
        >
          {isVideoOn ? <Video /> : <VideoOff />}
        </Button>
        
        <Button
          onClick={toggleAudio}
          variant={isAudioOn ? "default" : "destructive"}
          size="lg"
          className="rounded-full w-14 h-14"
        >
          {isAudioOn ? <Mic /> : <MicOff />}
        </Button>
        
        <Button
          onClick={leaveCall}
          variant="destructive"
          size="lg"
          className="rounded-full w-14 h-14"
        >
          <PhoneOff />
        </Button>
      </div>
    </div>
  );
}

function VideoParticipant({ peer }) {
  const ref = useRef();
  
  useEffect(() => {
    peer.on("stream", stream => {
      ref.current.srcObject = stream;
    });
  }, [peer]);
  
  return (
    <div className="relative bg-gray-800 rounded-lg overflow-hidden">
      <video
        ref={ref}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
    </div>
  );
}
```

#### 5. Create Room Page

Create `frontend/src/app/(sidebar)/meetings/room/[roomId]/page.jsx`:

```javascript
"use client";
import { use } from "react";
import VideoRoom from "@/components/meetings/VideoRoom";

export default function MeetingRoomPage({ params }) {
  const { roomId } = use(params);
  
  // Get user info (from auth context or session)
  const userId = "user_123"; // Replace with actual user ID
  const userName = "John Doe"; // Replace with actual user name
  
  return <VideoRoom roomId={roomId} userId={userId} userName={userName} />;
}
```

---

## 🎥 **Phase 2: Meeting Recording & Playback**

### Technologies
- **MediaRecorder API** - Browser-based recording
- **AWS S3 / Cloudinary** - Video storage
- **Video.js** - Video player

### Implementation

#### 1. Install Dependencies

```powershell
cd frontend
npm install video.js @videojs/http-streaming
```

#### 2. Add Recording to VideoRoom

Update `VideoRoom.jsx`:

```javascript
const [isRecording, setIsRecording] = useState(false);
const mediaRecorderRef = useRef();
const recordedChunks = useRef([]);

const startRecording = () => {
  const stream = userVideo.current.srcObject;
  mediaRecorderRef.current = new MediaRecorder(stream);
  
  mediaRecorderRef.current.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordedChunks.current.push(event.data);
    }
  };
  
  mediaRecorderRef.current.onstop = async () => {
    const blob = new Blob(recordedChunks.current, { type: "video/webm" });
    await uploadRecording(blob);
    recordedChunks.current = [];
  };
  
  mediaRecorderRef.current.start();
  setIsRecording(true);
};

const stopRecording = () => {
  mediaRecorderRef.current?.stop();
  setIsRecording(false);
};

const uploadRecording = async (blob) => {
  const formData = new FormData();
  formData.append("video", blob, `meeting_${roomId}.webm`);
  formData.append("roomId", roomId);
  
  await fetch("http://localhost:5000/api/video/upload-recording", {
    method: "POST",
    body: formData,
  });
};
```

#### 3. Backend: Handle Video Upload

```javascript
// backend/modules/video/routes.js
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "./uploads/recordings/",
  filename: (req, file, cb) => {
    cb(null, `recording_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

router.post("/upload-recording", upload.single("video"), async (req, res) => {
  const { roomId } = req.body;
  const videoPath = req.file.path;
  
  // Save to database
  await Meeting.update(
    { recording_link: `/recordings/${req.file.filename}` },
    { where: { id: meetingId } }
  );
  
  res.json({ success: true, videoPath });
});
```

#### 4. Video Player Component

Create `VideoPlayer.jsx`:

```javascript
"use client";
import { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export default function VideoPlayer({ src }) {
  const videoRef = useRef();
  const playerRef = useRef();
  
  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      playerRef.current = videojs(videoElement, {
        controls: true,
        autoplay: false,
        preload: "auto",
        sources: [{
          src,
          type: "video/webm"
        }]
      });
    }
    
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src]);
  
  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
    </div>
  );
}
```

---

## 🤖 **Phase 3: AI-Powered Features**

### What You'll Build
1. **Speech-to-Text Transcription**
2. **Requirement Extraction from Transcript**
3. **Meeting Summary Generation**
4. **Action Items Detection**

### Technologies
- **Web Speech API** (free, browser-based)
- **OpenAI Whisper API** (more accurate)
- **Hugging Face Transformers** (open-source)
- **LangChain** (for requirement extraction)

### Implementation

#### 1. Real-time Transcription

```javascript
// In VideoRoom.jsx
const [transcript, setTranscript] = useState("");

useEffect(() => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  recognition.continuous = true;
  recognition.interimResults = true;
  
  recognition.onresult = (event) => {
    const current = event.resultIndex;
    const transcriptText = event.results[current][0].transcript;
    setTranscript(prev => prev + " " + transcriptText);
  };
  
  recognition.start();
  
  return () => recognition.stop();
}, []);
```

#### 2. Backend: Requirement Extraction

Create `backend/modules/ai/requirementExtractor.js`:

```javascript
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function extractRequirements(transcript) {
  const prompt = `
    Analyze this meeting transcript and extract software requirements.
    Format as: Functional Requirements, Non-Functional Requirements, Constraints.
    
    Transcript:
    ${transcript}
  `;
  
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });
  
  return response.choices[0].message.content;
}
```

---

## 📊 **Summary: What Makes This FYP-Worthy**

### Custom Features You Built

| Feature | Technology | Your Contribution |
|---------|-----------|-------------------|
| **Video Conferencing** | WebRTC + Socket.io | 100% custom implementation |
| **Meeting Recording** | MediaRecorder API | Self-built recording system |
| **Video Playback** | Video.js | In-app player |
| **Transcription** | Web Speech API / Whisper | Real-time transcription |
| **AI Analysis** | OpenAI / Hugging Face | Requirement extraction |
| **Real-time Chat** | Socket.io | Custom chat during meetings |

### FYP Defense Points ✨

1. **"We built a custom video conferencing system using WebRTC"**
   - Not just embedding Zoom/Google Meet
   - Shows understanding of real-time communication

2. **"We implemented in-app meeting recording and playback"**
   - Users can watch recordings directly
   - No need for external platforms

3. **"We used AI to automatically extract requirements from meetings"**
   - Practical AI implementation
   - Solves real requirements engineering problems

4. **"We minimized dependency on third-party services"**
   - Core features are self-built
   - Shows technical competency

---

## 🎯 **Next Steps**

1. **Week 1-2**: Implement WebRTC video conferencing
2. **Week 3**: Add recording functionality
3. **Week 4**: Implement video player and playback
4. **Week 5**: Add transcription
5. **Week 6**: Integrate AI for requirement extraction
6. **Week 7-8**: Testing and refinement

---

Would you like me to create the actual code files for any of these features?
