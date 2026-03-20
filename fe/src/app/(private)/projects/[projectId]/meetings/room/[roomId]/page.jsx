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

      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm";

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
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
      toast.success("Recording started");
    } catch (error) {
      console.error("Failed to start recording:", error);
      toast.error("Failed to start recording: " + error.message);
    }
  }, [room, meetingId]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      toast.info("Stopping recording...");
    }
  }, []);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-3">
      {isRecording && (
        <>
          <div className="flex items-center gap-2 rounded bg-red-500/20 px-2 py-1 text-xs font-medium text-red-400">
            <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            Recording
          </div>
          <div className="text-sm font-medium">{formatDuration(duration)}</div>
        </>
      )}
      {isUploading && (
        <div className="rounded bg-blue-500/20 px-2 py-1 text-xs font-medium text-blue-400">Uploading...</div>
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
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header with recording controls */}
      <header className="z-10 flex shrink-0 items-center justify-between bg-black/60 px-4 py-2 backdrop-blur-sm">
        <div>
          <h1 className="font-medium text-white">Meeting Room</h1>
          <p className="text-xs text-white/50">{roomId}</p>
        </div>
        <RecordingControls meetingId={roomId} />
      </header>

      {/* Video Conference - fits remaining space */}
      <div className="min-h-0 flex-1 overflow-hidden">
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
      <div className="flex h-screen items-center justify-center bg-neutral-900 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
          <p>Joining meeting...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-neutral-900 text-white">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredPermissions={["join_meeting"]}>
      <div className="h-full overflow-hidden bg-neutral-900 pb-2 text-white">
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
