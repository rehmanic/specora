"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { LiveKitRoom, VideoConference, useRoomContext, ControlBar } from "@livekit/components-react";
import "@livekit/components-styles";
import { joinMeeting, uploadRecording } from "@/api/meetings";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Track } from "livekit-client";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Recording controls component (must be inside the connected LiveKitRoom)
function RecordingControls({ meetingId }) {
  const room = useRoomContext();
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const startRecording = useCallback(async () => {
    if (!room) {
      toast.error("Room not connected");
      return;
    }

    try {
      const localParticipant = room.localParticipant;
      const audioTrack = localParticipant.getTrackPublication(Track.Source.Microphone)?.track;
      const videoTrack = localParticipant.getTrackPublication(Track.Source.Camera)?.track;

      console.log("Audio track:", audioTrack);
      console.log("Video track:", videoTrack);

      if (!audioTrack && !videoTrack) {
        toast.error("No media tracks available. Make sure camera/mic is enabled.");
        return;
      }

      const stream = new MediaStream();
      if (audioTrack?.mediaStreamTrack) stream.addTrack(audioTrack.mediaStreamTrack);
      if (videoTrack?.mediaStreamTrack) stream.addTrack(videoTrack.mediaStreamTrack);

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 2500000,
      });

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setIsRecording(false);
        clearInterval(timerRef.current);

        setIsUploading(true);
        try {
          await uploadRecording(meetingId, blob);
          toast.success("Recording saved successfully!");
        } catch (error) {
          console.error("Upload failed:", error);
          toast.error("Failed to save recording");
        } finally {
          setIsUploading(false);
          setDuration(0);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000);
      setIsRecording(true);
      setDuration(0);
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
      toast.success("Recording started");

    } catch (error) {
      console.error("Failed to start recording:", error);
      toast.error("Failed to start recording: " + error.message);
    }
  }, [room, meetingId]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      toast.info("Stopping recording...");
    }
  }, []);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-3">
      {isRecording && (
        <>
          <div className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-medium flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Recording
          </div>
          <div className="text-sm font-medium">{formatDuration(duration)}</div>
        </>
      )}
      {isUploading && (
        <div className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-medium">
          Uploading...
        </div>
      )}
      {isRecording ? (
        <Button onClick={stopRecording} size="sm" variant="secondary" disabled={isUploading}>
          Stop Recording
        </Button>
      ) : (
        <Button onClick={startRecording} size="sm" variant="destructive" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Record"}
        </Button>
      )}
    </div>
  );
}

// Custom layout that includes header with recording controls
function MeetingLayout({ roomId, projectId, router }) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header with recording controls */}
      <header className="flex items-center justify-between px-4 py-2 bg-black/60 backdrop-blur-sm z-10 shrink-0">
        <div>
          <h1 className="font-medium text-white">Meeting Room</h1>
          <p className="text-xs text-white/50">{roomId}</p>
        </div>
        <RecordingControls meetingId={roomId} />
      </header>

      {/* Video Conference - fits remaining space */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <VideoConference />
      </div>
    </div>
  );
}

export default function MeetingRoomPage() {
  const params = useParams();
  const router = useRouter();
  const { projectId, roomId } = params;
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDisconnected, setIsDisconnected] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        setIsLoading(true);
        const data = await joinMeeting(roomId);
        setToken(data.token);
      } catch (err) {
        console.error("Failed to join meeting:", err);
        setError(err.message || "Failed to join meeting");
      } finally {
        setIsLoading(false);
      }
    };
    if (roomId) fetchToken();
  }, [roomId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Joining meeting...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-neutral-900 text-white gap-4">
        <p className="text-red-400">{error}</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["manager", "client", "requirements_engineer"]}>
      <div className="h-full bg-neutral-900 text-white overflow-hidden pb-2">
        <LiveKitRoom
          video={true}
          audio={true}
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          data-lk-theme="default"
          style={{ height: "100%" }}
          onDisconnected={() => {
            setIsDisconnected(true);
            router.push(`/projects/${projectId}/meetings`);
          }}
        >
          {!isDisconnected && <MeetingLayout roomId={roomId} projectId={projectId} router={router} />}
        </LiveKitRoom>
      </div>
    </ProtectedRoute>
  );
}
