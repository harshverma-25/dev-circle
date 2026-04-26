"use client";

import Layout from "../../components/Layout";

export default function ResumePage() {
  return (
    <Layout>
      <div className="flex h-full w-full items-center justify-center">
        <div className="glass-panel p-10 rounded-2xl max-w-md text-center flex flex-col items-center gap-6 mt-20">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
            <span className="material-symbols-outlined text-[40px]">architecture</span>
          </div>
          <h1 className="text-2xl font-bold font-h2 text-white">Resume Intelligence</h1>
          <p className="text-on-surface-variant">
            AI-powered resume feedback and ATS optimization tailored for FAANG roles is coming soon.
          </p>
          <div className="mt-4 inline-flex items-center px-sm py-xs rounded-full bg-secondary/10 text-secondary border border-secondary/20">
            <span className="text-label-caps uppercase">In Development</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}