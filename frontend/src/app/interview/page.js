"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "../../components/Layout";
import InterviewCard from "../../components/InterviewCard";
import CreateInterviewModal from "../../components/CreateInterviewModal";
import { useInterviews } from "../../hooks/useInterviews";
import useAuthStore from "../../store/useAuthStore";

export default function InterviewPage() {
  const router = useRouter();
  const { user, hasHydrated } = useAuthStore();
  const { data, isLoading, isError, error } = useInterviews();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (hasHydrated && !user) {
      router.push("/auth");
    }
  }, [user, hasHydrated, router]);

  if (!hasHydrated) return null;
  if (!user) return null;

  if (isLoading) {
    return <Layout>Loading interviews...</Layout>;
  }

  if (isError) {
    return (
      <Layout>
        <p className="text-red-400">
          Failed to load interviews: {error?.message}
        </p>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-white">Live Interview Sessions</h1>

        <button
          onClick={() => setOpen(true)}
          className="bg-blue-400 text-black px-5 py-2 rounded-lg"
        >
          Host Session
        </button>
      </div>

      {/* EMPTY STATE */}
      {data?.length === 0 ? (
        <p className="text-gray-400">
          No sessions yet — be the first to host
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {data?.map((item) => (
            <InterviewCard key={item._id} interview={item} />
          ))}
        </div>
      )}

      {/* MODAL */}
      {open && <CreateInterviewModal onClose={() => setOpen(false)} />}
    </Layout>
  );
}