"use client";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import SimplePeer from "simple-peer";
import { Button } from "@/components/ui/button";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Monitor,
  Circle,
  StopCircle,
} from "lucide-react";

export default function VideoRoom({ roomId, userId, userName, onLeave }) {
  const [peers, setPeers] = useState([]);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const userVideo = useRef();
  const socketRef = useRef();
  const peersRef = useRef([]);
  const mediaRecorderRef = useRef();
  const recordedChunks = useRef([]);
  const recordingInterval = useRef();
  const streamRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        streamRef.current = stream;
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }

        socketRef.current = io(
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        );

        socketRef.current.emit("join-room", { roomId, userId, userName });

        socketRef.current.on("user-connected", ({ userId, userName, socketId }) => {
          const peer = createPeer(socketId, socketRef.current.id, stream);
          peersRef.current.push({
            peerId: socketId,
            peer,
            userName,
          });
          setPeers((users) => [...users, { peerId: socketId, peer, userName }]);
        });

        socketRef.current.on("offer", ({ offer, fromSocketId }) => {
          const peer = addPeer(offer, fromSocketId, stream);
          peersRef.current.push({
            peerId: fromSocketId,
            peer,
          });
          setPeers((users) => [...users, { peerId: fromSocketId, peer }]);
        });

        socketRef.current.on("answer", ({ answer, fromSocketId }) => {
          const item = peersRef.current.find((p) => p.peerId === fromSocketId);
          if (item) {
            item.peer.signal(answer);
          }
        });

        socketRef.current.on("ice-candidate", ({ candidate, fromSocketId }) => {
          const item = peersRef.current.find((p) => p.peerId === fromSocketId);
          if (item) {
            item.peer.signal(candidate);
          }
        });

        socketRef.current.on("user-disconnected", ({ userId }) => {
          const peerObj = peersRef.current.find((p) => p.peerId === userId);
          if (peerObj) {
            peerObj.peer.destroy();
          }
          const peers = peersRef.current.filter((p) => p.peerId !== userId);
          peersRef.current = peers;
          setPeers(peers);
        });
      })
      .catch((err) => {
        console.error("Error accessing media devices:", err);
        alert("Please allow camera and microphone access to join the meeting");
      });

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      socketRef.current?.disconnect();
      peersRef.current.forEach(({ peer }) => peer.destroy());
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    };
  }, [roomId, userId, userName]);

  function createPeer(targetSocketId, mySocketId, stream) {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
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

    peer.on("signal", (signal) => {
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
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;

    try {
      mediaRecorderRef.current = new MediaRecorder(streamRef.current, {
        mimeType: "video/webm;codecs=vp9",
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(recordedChunks.current, { type: "video/webm" });
        await uploadRecording(blob);
        recordedChunks.current = [];
        setRecordingTime(0);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      socketRef.current.emit("start-recording", { roomId });

      recordingInterval.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error starting recording:", err);
      alert("Failed to start recording");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      socketRef.current.emit("stop-recording", { roomId });

      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    }
  };

  const uploadRecording = async (blob) => {
    const formData = new FormData();
    formData.append("video", blob, `meeting_${roomId}.webm`);
    formData.append("roomId", roomId);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/video/upload-recording`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Recording uploaded:", data);
      }
    } catch (err) {
      console.error("Error uploading recording:", err);
    }
  };

  const leaveCall = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    socketRef.current?.disconnect();
    if (onLeave) {
      onLeave();
    } else {
      window.location.href = "/meetings";
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-white text-xl font-semibold">Meeting Room</h1>
          <p className="text-gray-400 text-sm">
            {peers.length + 1} participant{peers.length !== 0 ? "s" : ""}
          </p>
        </div>
        {isRecording && (
          <div className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg">
            <Circle className="w-3 h-3 fill-white animate-pulse" />
            <span className="text-white font-medium">{formatTime(recordingTime)}</span>
          </div>
        )}
      </div>

      <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-auto">
        <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
          <video
            ref={userVideo}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-md">
            <span className="text-white text-sm font-medium">
              {userName} (You)
            </span>
          </div>
          {!isVideoOn && (
            <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
              <VideoOff className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        {peers.map((peer) => (
          <VideoParticipant
            key={peer.peerId}
            peer={peer.peer}
            userName={peer.userName}
          />
        ))}
      </div>

      <div className="bg-gray-800 p-6 flex justify-center items-center gap-4">
        <Button
          onClick={toggleVideo}
          variant={isVideoOn ? "default" : "destructive"}
          size="lg"
          className="rounded-full w-14 h-14 p-0"
        >
          {isVideoOn ? (
            <Video className="w-6 h-6" />
          ) : (
            <VideoOff className="w-6 h-6" />
          )}
        </Button>

        <Button
          onClick={toggleAudio}
          variant={isAudioOn ? "default" : "destructive"}
          size="lg"
          className="rounded-full w-14 h-14 p-0"
        >
          {isAudioOn ? (
            <Mic className="w-6 h-6" />
          ) : (
            <MicOff className="w-6 h-6" />
          )}
        </Button>

        <Button
          onClick={isRecording ? stopRecording : startRecording}
          variant={isRecording ? "destructive" : "secondary"}
          size="lg"
          className="rounded-full w-14 h-14 p-0"
        >
          {isRecording ? (
            <StopCircle className="w-6 h-6" />
          ) : (
            <Circle className="w-6 h-6" />
          )}
        </Button>

        <Button
          onClick={leaveCall}
          variant="destructive"
          size="lg"
          className="rounded-full w-14 h-14 p-0"
        >
          <PhoneOff className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}

function VideoParticipant({ peer, userName }) {
  const ref = useRef();
  const [isVideoActive, setIsVideoActive] = useState(true);

  useEffect(() => {
    peer.on("stream", (stream) => {
      if (ref.current) {
        ref.current.srcObject = stream;
      }

      stream.getVideoTracks().forEach((track) => {
        track.onended = () => setIsVideoActive(false);
        track.onmute = () => setIsVideoActive(false);
        track.onunmute = () => setIsVideoActive(true);
      });
    });
  }, [peer]);

  return (
    <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
      <video
        ref={ref}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-md">
        <span className="text-white text-sm font-medium">
          {userName || "Participant"}
        </span>
      </div>
      {!isVideoActive && (
        <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
          <VideoOff className="w-12 h-12 text-gray-400" />
        </div>
      )}
    </div>
  );
}
