"use client";

import { useState, useEffect } from "react";
import useAuthStore from "@/store/useAuthStore";
import { FiUploadCloud, FiFileText, FiCheckCircle, FiXCircle, FiAlertTriangle, FiTrendingUp, FiCpu } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";

// --- Loading Status Messages ---
const LOADING_STEPS = [
  { icon: "📄", text: "Parsing your PDF resume..." },
  { icon: "🔍", text: "Scanning resume structure & sections..." },
  { icon: "🤖", text: "AI is analyzing your content..." },
  { icon: "📊", text: "Calculating your ATS score..." },
  { icon: "💡", text: "Generating personalized feedback..." },
  { icon: "✅", text: "Almost done, wrapping up results..." },
];

// --- Skeleton Shimmer Component ---
function SkeletonBlock({ className = "" }) {
  return (
    <div
      className={`bg-white/5 rounded-xl overflow-hidden relative ${className}`}
      style={{ animation: "shimmer 1.8s infinite linear" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
          animation: "shimmerSlide 1.8s infinite linear",
        }}
      />
    </div>
  );
}

// --- Full Loading Skeleton UI ---
function AnalysisLoadingSkeleton({ step }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Status bar */}
      <div className="max-w-xl mx-auto bg-[#121212] border border-[#adc6ff]/20 rounded-2xl p-6 text-center shadow-2xl">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-[#adc6ff]/10 border border-[#adc6ff]/30 flex items-center justify-center text-2xl"
            style={{ animation: "pulse 1.5s ease-in-out infinite" }}>
            {LOADING_STEPS[step]?.icon ?? "⚙️"}
          </div>
        </div>
        <p className="text-white font-semibold text-lg mb-1">
          {LOADING_STEPS[step]?.text ?? "Processing..."}
        </p>
        <p className="text-zinc-500 text-sm">This usually takes 20–30 seconds</p>

        {/* Progress bar */}
        <div className="mt-5 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#adc6ff] to-purple-500 rounded-full transition-all duration-700"
            style={{ width: `${((step + 1) / LOADING_STEPS.length) * 100}%` }}
          />
        </div>
        <p className="text-zinc-600 text-xs mt-2">
          Step {step + 1} of {LOADING_STEPS.length}
        </p>
      </div>

      {/* Skeleton results preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score skeleton */}
        <div className="bg-[#121212] rounded-2xl border border-white/10 p-6 flex flex-col items-center justify-center shadow-xl space-y-4">
          <SkeletonBlock className="w-40 h-5 rounded-lg" />
          <SkeletonBlock className="w-32 h-32 rounded-full" />
          <SkeletonBlock className="w-24 h-6 rounded-full" />
        </div>

        {/* Summary skeleton */}
        <div className="md:col-span-2 bg-[#121212] rounded-2xl border border-white/10 p-6 shadow-xl space-y-3 flex flex-col justify-center">
          <SkeletonBlock className="w-40 h-5 rounded-lg" />
          <SkeletonBlock className="w-full h-4 rounded-lg" />
          <SkeletonBlock className="w-full h-4 rounded-lg" />
          <SkeletonBlock className="w-3/4 h-4 rounded-lg" />
          <SkeletonBlock className="w-full h-4 rounded-lg" />
          <SkeletonBlock className="w-5/6 h-4 rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#121212] rounded-2xl border border-white/10 p-6 shadow-xl space-y-3">
            <SkeletonBlock className="w-36 h-5 rounded-lg" />
            <SkeletonBlock className="w-full h-4 rounded-lg" />
            <SkeletonBlock className="w-full h-4 rounded-lg" />
            <SkeletonBlock className="w-4/5 h-4 rounded-lg" />
            <SkeletonBlock className="w-full h-4 rounded-lg" />
          </div>
        ))}
      </div>

      <div className="bg-[#121212] rounded-2xl border border-white/10 p-6 shadow-xl space-y-4">
        <SkeletonBlock className="w-48 h-5 rounded-lg" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-white/5 bg-white/[0.02] rounded-xl p-5 space-y-2">
            <div className="flex justify-between">
              <SkeletonBlock className="w-40 h-4 rounded-lg" />
              <SkeletonBlock className="w-20 h-6 rounded-full" />
            </div>
            <SkeletonBlock className="w-full h-3 rounded-lg" />
            <SkeletonBlock className="w-5/6 h-3 rounded-lg" />
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes shimmerSlide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

// =============================================

export default function AtsScorePage() {
  const { user } = useAuthStore();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  // Cycle through loading messages while waiting for AI
  useEffect(() => {
    if (!loading) return;
    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        const next = prev + 1;
        if (next >= LOADING_STEPS.length - 1) {
          clearInterval(interval);
          return LOADING_STEPS.length - 1;
        }
        return next;
      });
    }, 4000); // advance step every 4 seconds
    return () => clearInterval(interval);
  }, [loading]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
    } else {
      setFile(null);
      setError("Please select a valid PDF file.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a resume PDF to analyze");
      return;
    }
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await api.post('/api/ats/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data && response.data.success) {
        setResult(response.data.data);
      } else {
        setError(response.data.message || "Failed to analyze resume");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred while analyzing the resume.");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderScoreCircle = (score) => {
    let colorClass = "text-green-500";
    if (score < 50) colorClass = "text-red-500";
    else if (score < 80) colorClass = "text-yellow-500";

    return (
      <div className="relative w-32 h-32 flex justify-center items-center rounded-full border-8 border-[#adc6ff]/20 bg-[#121212] shadow-[0_0_20px_rgba(173,198,255,0.1)]">
        <div className={`text-4xl font-bold ${colorClass}`}>{score}</div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-8"
          style={{
            borderColor: score >= 80 ? '#22c55e' : score >= 50 ? '#eab308' : '#ef4444',
            clipPath: `polygon(0 0, 100% 0, 100% ${Math.max(0, 100 - score)}%, 0 ${Math.max(0, 100 - score)}%)`,
            transform: 'rotate(-90deg)'
          }}>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#adc6ff] to-purple-500 bg-clip-text text-transparent">
            AI Resume ATS Analyzer
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Upload your resume and get an instant AI-powered evaluation, including ATS score, personalized feedback, and project reviews.
          </p>
        </div>

        {/* Loading skeleton state */}
        {loading && <AnalysisLoadingSkeleton step={loadingStep} />}

        {/* Upload form — shown when not loading and no result */}
        {!loading && !result && (
          <div className="max-w-xl mx-auto bg-[#121212] rounded-2xl border border-white/10 p-8 shadow-2xl">
            <div className="border-2 border-dashed border-zinc-700 hover:border-[#adc6ff]/50 rounded-xl p-10 text-center transition-colors duration-300 relative">
              <input
                type="file"
                accept="application/pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
              <div className="flex justify-center mb-4 text-[#adc6ff]">
                {file ? <FiFileText size={48} /> : <FiUploadCloud size={48} />}
              </div>
              <h3 className="text-xl font-bold mb-2">
                {file ? file.name : "Drag & drop or click to upload"}
              </h3>
              <p className="text-zinc-500 text-sm">Only PDF files up to 5MB are supported</p>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm flex items-center gap-2">
                <FiAlertTriangle /> {error}
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className={`w-full mt-6 py-3 px-4 rounded-xl font-medium flex justify-center items-center gap-2 transition-all duration-300
                ${(loading || !file)
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#adc6ff] to-purple-500 text-white hover:shadow-[0_0_15px_rgba(173,198,255,0.4)] hover:scale-[1.02]'
                }`}
            >
              <FiCpu size={18} />
              Analyze Resume
            </button>

            <p className="text-center text-xs text-zinc-600 mt-4">
              Limit: 2 analysis per day
            </p>
          </div>
        )}

        {/* Results state */}
        {!loading && result && (
          <div className="space-y-6 animate-fadeIn">
            <button
              onClick={() => { setResult(null); setFile(null); }}
              className="text-sm text-zinc-400 hover:text-white mb-4 inline-block transition-colors"
            >
              ← Analyze another resume
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Score Card */}
              <div className="bg-[#121212] rounded-2xl border border-white/10 p-6 flex flex-col items-center justify-center shadow-xl">
                <h3 className="font-bold text-xl text-white mb-6">ATS Match Score</h3>
                {renderScoreCircle(result.score)}
                <div className="mt-6 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium
                    ${result.score >= 80 ? 'bg-green-500/20 text-green-400' : result.score >= 50 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                    {result.score >= 80 ? 'Excellent Match' : result.score >= 50 ? 'Needs Improvement' : 'Poor Match'}
                  </span>
                </div>
              </div>

              {/* Summary Card */}
              <div className="md:col-span-2 bg-[#121212] rounded-2xl border border-white/10 p-6 shadow-xl flex flex-col justify-center">
                <h3 className="font-bold text-xl text-white mb-4">AI Summary</h3>
                <p className="text-zinc-300 leading-relaxed text-lg italic">
                  &ldquo;{result.summary}&rdquo;
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="bg-gradient-to-br from-green-500/5 to-[#121212] rounded-2xl border border-green-500/20 p-6 shadow-xl">
                <h3 className="font-bold text-xl text-white mb-4 flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" /> Strengths
                </h3>
                <ul className="space-y-3">
                  {result.strengths.map((str, idx) => (
                    <li key={idx} className="flex gap-3 text-zinc-300">
                      <span className="text-green-500 mt-1">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="bg-gradient-to-br from-red-500/5 to-[#121212] rounded-2xl border border-red-500/20 p-6 shadow-xl">
                <h3 className="font-bold text-xl text-white mb-4 flex items-center gap-2">
                  <FiXCircle className="text-red-500" /> Weaknesses
                </h3>
                <ul className="space-y-3">
                  {result.weaknesses.map((weak, idx) => (
                    <li key={idx} className="flex gap-3 text-zinc-300">
                      <span className="text-red-500 mt-1">•</span>
                      <span>{weak}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="bg-gradient-to-br from-[#adc6ff]/5 to-[#121212] rounded-2xl border border-[#adc6ff]/30 p-6 shadow-xl">
                <h3 className="font-bold text-xl text-white mb-4 flex items-center gap-2">
                  <FiTrendingUp className="text-[#adc6ff]" /> Actionable Improvements
                </h3>
                <ul className="space-y-3">
                  {result.improvements.map((imp, idx) => (
                    <li key={idx} className="flex gap-3 text-zinc-300">
                      <span className="text-[#adc6ff] mt-1">→</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Missing Keywords */}
              <div className="bg-[#121212] rounded-2xl border border-white/10 p-6 shadow-xl">
                <h3 className="font-bold text-xl text-white mb-4 flex items-center gap-2">
                  <FiAlertTriangle className="text-yellow-500" /> Missing ATS Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((kw, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-zinc-300">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Project Reviews */}
            {result.projectReview && result.projectReview.length > 0 && (
              <div className="bg-[#121212] rounded-2xl border border-white/10 p-6 shadow-xl mt-6">
                <h3 className="font-bold text-xl text-white mb-6">Detailed Project Review</h3>
                <div className="space-y-6">
                  {result.projectReview.map((project, idx) => {
                    let ratingColor = "bg-white/10 text-white";
                    if (project.rating.includes("Strong") || project.rating.includes("Impressive")) ratingColor = "bg-green-500/20 text-green-400";
                    else if (project.rating.includes("Average")) ratingColor = "bg-yellow-500/20 text-yellow-400";
                    else if (project.rating.includes("Basic")) ratingColor = "bg-red-500/20 text-red-400";

                    return (
                      <div key={idx} className="border border-white/5 bg-white/[0.02] rounded-xl p-5">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-bold text-lg text-white">{project.projectName}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${ratingColor}`}>
                            {project.rating}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-sm">{project.feedback}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Interview Questions */}
            {result.interviewQuestions && result.interviewQuestions.length > 0 && (
              <div className="bg-[#121212] rounded-2xl border border-white/10 p-6 shadow-xl mt-6">
                <h3 className="font-bold text-xl text-white mb-6">AI Generated Interview Questions</h3>
                <div className="space-y-4">
                  {result.interviewQuestions.map((item, idx) => (
                    <div key={idx} className="border border-white/5 bg-white/[0.02] rounded-xl p-5">
                      <h4 className="font-bold text-[#adc6ff] mb-2 font-mono">Q: {item.question}</h4>
                      <p className="text-zinc-500 text-sm italic">
                        <span className="text-zinc-400 font-semibold">Context:</span> {item.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <style jsx global>{`
        @keyframes shimmerSlide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
