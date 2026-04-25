"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";

export default function InterviewPage({ params }) {
  const { id } = params;

  const [token, setToken] = useState(null);
  const [url, setUrl] = useState("");

  useEffect(() => {
    const joinInterview = async () => {
      const res = await fetch(
        `http://localhost:5000/api/interview/join/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer YOUR_ACCESS_TOKEN`
          },
          credentials: "include"
        }
      );

      const data = await res.json();

      if (data.success) {
        setToken(data.token);
        setUrl(data.url);
      }
    };

    joinInterview();
  }, [id]);

  if (!token) return <p>Joining interview...</p>;

  return (
    <LiveKitRoom
      token={token}
      serverUrl={url}
      connect={true}
      video={true}
      audio={true}
    >
      <VideoConference />
    </LiveKitRoom>
  );
}