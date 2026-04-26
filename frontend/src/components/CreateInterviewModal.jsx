"use client";

import { useState } from "react";
import { useCreateInterview } from "../hooks/useInterviews";

export default function CreateInterviewModal({ onClose }) {
  const [title, setTitle] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(4);

  const { mutate, isPending } = useCreateInterview();

  const handleSubmit = () => {
    if (!title) return;

    mutate(
      {
        title,
        maxParticipants,
        scheduledAt: new Date().toISOString(), // ✅ REQUIRED
        duration: 60 // ✅ REQUIRED
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (err) => {
          console.error("Create Interview Error:", err?.response?.data || err.message);
          alert(err?.response?.data?.message || "Failed to create interview");
        }
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#121212] border border-white/10 rounded-xl p-6 w-full max-w-md">

        <h2 className="text-lg font-semibold mb-4">
          Host Interview Session
        </h2>

        <input
          placeholder="Interview Title"
          className="w-full mb-3 px-4 py-2 bg-[#1a1a1a] rounded border border-white/10 text-white"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max Participants"
          className="w-full mb-4 px-4 py-2 bg-[#1a1a1a] rounded border border-white/10 text-white"
          value={maxParticipants}
          onChange={(e) => setMaxParticipants(Number(e.target.value))}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-400">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-blue-400 text-black px-4 py-2 rounded"
          >
            {isPending ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}