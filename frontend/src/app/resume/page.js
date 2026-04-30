"use client";

import Layout from "../../components/Layout";
import { FiFileText, FiBell } from "react-icons/fi";

export default function ResumePage() {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <div className="max-w-md w-full bg-gradient-to-br from-zinc-900/50 to-black border border-white/10 rounded-2xl p-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto rounded-full bg-[#adc6ff]/10 flex items-center justify-center mb-6">
            <FiFileText className="text-[#adc6ff] text-3xl" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#adc6ff]/10 border border-[#adc6ff]/20 mb-4">
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#adc6ff]">Coming Soon</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-3">
            Resume Intelligence
          </h1>

          {/* Description */}
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            AI-powered resume feedback and ATS optimization tailored for FAANG roles is coming soon.
          </p>

        
        </div>
      </div>
    </Layout>
  );
}