"use client";
import { use, useEffect, useState } from "react";
import VideoRoom from "@/components/video/VideoRoom";
import { Skeleton } from "@/components/ui/skeleton";

export default function MeetingRoomPage({ params }) {
  const { roomId } = use(params);
  const [loading, setLoading] = useState(true);
  const [roomData, setRoomData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/video/room/${roomId}`
        );

        if (!response.ok) {
          throw new Error("Room not found");
        }

        const data = await response.json();
        setRoomData(data.room);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  if (loading) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-64 mx-auto" />
          <Skeleton className="h-6 w-48 mx-auto" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-2">Room Not Found</h1>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  const userId = `user_${Math.random().toString(36).substr(2, 9)}`;
  const userName = "Participant";

  return (
    <VideoRoom roomId={roomId} userId={userId} userName={userName} />
  );
}
