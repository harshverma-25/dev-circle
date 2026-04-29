"use client";

import Layout from "../../components/Layout";

export default function ResumePage() {
  return (
    <Layout>
      <div className="flex h-full w-full items-center justify-center">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-2xl max-w-md text-center flex flex-col items-center gap-6 mt-20">
          <div className="w-16 h-16 rounded-full bg-[#adc6ff]/10 flex items-center justify-center text-[#adc6ff] mb-2">
            <span className="material-symbols-outlined text-[40px]">architecture</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Resume Intelligence</h1>
          <p className="text-gray-400">
            AI-powered resume feedback and ATS optimization tailored for FAANG roles is coming soon.
          </p>
          <div className="mt-4 inline-flex items-center px-2 py-1 rounded-full bg-[#adc6ff]/10 text-[#adc6ff] border border-[#adc6ff]/20">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">In Development</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}