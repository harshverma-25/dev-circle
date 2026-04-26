"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "../../components/Layout";
import InterviewCard from "../../components/InterviewCard";
import { useInterviews } from "../../hooks/useInterviews";
import useAuthStore from "../../store/useAuthStore";

export default function InterviewPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data, isLoading, isError, error } = useInterviews();

  useEffect(() => {
    if (!user) {
      router.push("/auth");
    }
  }, [user, router]);

  if (!user) {
    return null; // Return null while redirecting
  }

  if (isLoading) {
    return <Layout>Loading interviews...</Layout>;
  }

  if (isError) {
    return (
      <Layout>
        <p className="text-red-400">Failed to load interviews: {error?.message}</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-2xl text-white mb-6">Interviews</h1>

      <div className="grid gap-4">
        {data?.map((item) => (
          <InterviewCard key={item._id} interview={item} />
        ))}
      </div>
    </Layout>
  );
}