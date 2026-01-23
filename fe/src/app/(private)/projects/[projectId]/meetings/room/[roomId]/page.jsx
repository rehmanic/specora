"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users, MessageSquare, Share2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Logo from "@/components/common/Logo";

export default function MeetingRoomPage() {
  const params = useParams();
  const router = useRouter();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [participants, setParticipants] = useState([
    { id: 1, name: "You", isHost: false, isMe: true },
    { id: 2, name: "Host", isHost: true, isMe: false },
  ]);

  const videoRef = useRef(null);

  // Simulate connecting to camera
  useEffect(() => {
    if (isVideoOn) {
      // In a real app, this would use navigator.mediaDevices.getUserMedia
      // For now, we just simulate the state
    }
  }, [isVideoOn]);

  const handleLeave = () => {
    router.back();
  };

  return (
    <ProtectedRoute allowedRoles={["manager", "client", "requirements_engineer"]}>
      <div className="flex flex-col h-screen bg-neutral-900 text-white overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-black/20 backdrop-blur-sm absolute top-0 left-0 right-0 z-10">
          <div className="flex items-center gap-3">
            <Logo size="sm" showText={false} />
            <div>
              <h1 className="font-semibold text-lg">Requirements Review Meeting</h1>
              <p className="text-xs text-white/60">ID: {params.roomId}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-medium flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Recording
            </div>
            <div className="text-sm font-medium">04:23</div>
          </div>
        </header>

        {/* Main Video Grid */}
        <main className="flex-1 p-4 flex items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-6xl aspect-video max-h-[calc(100vh-160px)]">
            {/* Host Video */}
            <div className="relative bg-neutral-800 rounded-2xl overflow-hidden flex items-center justify-center">
              <Avatar className="h-32 w-32">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Host" />
                <AvatarFallback>HO</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-lg text-sm font-medium backdrop-blur-md">
                Host
              </div>
            </div>

            {/* My Video */}
            <div className="relative bg-neutral-800 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-primary/50">
              {isVideoOn ? (
                <div className="w-full h-full bg-neutral-700 flex items-center justify-center">
                  <p className="text-white/50">Camera Preview</p>
                </div>
              ) : (
                <Avatar className="h-32 w-32">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" />
                  <AvatarFallback>ME</AvatarFallback>
                </Avatar>
              )}
              <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-lg text-sm font-medium backdrop-blur-md">
                You {isMicOn ? "" : "(Muted)"}
              </div>
            </div>
          </div>
        </main>

        {/* Control Bar */}
        <div className="h-20 bg-neutral-800 border-t border-neutral-700 flex items-center justify-center gap-4 px-6 fixed bottom-0 left-0 right-0 z-20">
          <div className="flex items-center gap-2 absolute left-6">
            <Button variant="ghost" className="text-white hover:bg-white/10 flex-col h-auto py-2 gap-1 min-w-[60px]">
              <Users className="h-5 w-5" />
              <span className="text-[10px]">Participants</span>
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/10 flex-col h-auto py-2 gap-1 min-w-[60px]">
              <MessageSquare className="h-5 w-5" />
              <span className="text-[10px]">Chat</span>
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant={isMicOn ? "secondary" : "destructive"}
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={() => setIsMicOn(!isMicOn)}
            >
              {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>

            <Button
              variant={isVideoOn ? "secondary" : "destructive"}
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={() => setIsVideoOn(!isVideoOn)}
            >
              {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>

            <Button
              variant="secondary"
              size="icon"
              className="h-12 w-12 rounded-full"
            >
              <Share2 className="h-5 w-5" />
            </Button>

            <Button
              variant="destructive"
              className="h-12 px-6 rounded-full gap-2 font-semibold ml-2"
              onClick={handleLeave}
            >
              <PhoneOff className="h-5 w-5" />
              Leave
            </Button>
          </div>

          <div className="flex items-center gap-2 absolute right-6">
            {/* Additional controls like settings could go here */}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
