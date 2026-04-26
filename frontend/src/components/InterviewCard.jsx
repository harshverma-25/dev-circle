"use client";

import { useApplyInterview } from "../hooks/useInterviews";

export default function InterviewCard({ interview }) {
  const { mutate: apply, isPending } = useApplyInterview();

  const handleApply = () => {
    apply(interview._id, {
      onSuccess: () => alert("Applied successfully!"),
      onError: (err) =>
        alert(err?.response?.data?.message ?? "Failed to apply"),
    });
  };

  return (
    <div className="bg-[#1A1A1A] p-5 rounded-xl border border-white/10">
      <h2 className="text-white font-semibold text-lg">
        {interview.title}
      </h2>

      <p className="text-gray-400 text-sm">
        By {interview.createdBy?.name}
      </p>

      <button
        onClick={handleApply}
        disabled={isPending}
        className="mt-4 bg-primary px-4 py-2 rounded text-black disabled:opacity-50"
      >
        {isPending ? "Applying..." : "Apply"}
      </button>
    </div>
  );
}