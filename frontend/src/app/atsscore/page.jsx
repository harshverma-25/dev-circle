"use client";

import { useState } from "react";
import useAuthStore from "@/store/useAuthStore";
import { FiUploadCloud, FiFileText, FiCheckCircle, FiXCircle, FiAlertTriangle, FiTrendingUp } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";

export default function AtsScorePage() {
  const { user } = useAuthStore();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

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
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data && response.data.success) {
        setResult(response.data.data);
      } else {
        setError(response.data.message || "Failed to analyze resume");
      }
    } catch (err) {
      console.error(err);
      
      // Specifically handle the 429 rate limit or 401 unauth
      if (err.response && err.response.data && err.response.data.message) {
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
               clipPath: `polygon(0 0, 100% 0, 100% ${Math.max(0, 100 - score)}%, 0 ${Math.max(0, 100 - score)}%)`, // simplistic representation
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

        {!result ? (
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
              <p className="text-zinc-500 text-sm">
                Only PDF files up to 5MB are supported
              </p>
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
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing with AI...
                </>
              ) : (
                "Analyze Resume"
              )}
            </button>
            
            <p className="text-center text-xs text-zinc-600 mt-4">
              Limit: 2 analysis per day
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <button 
              onClick={() => {setResult(null); setFile(null);}}
              className="text-sm text-zinc-400 hover:text-white mb-4 inline-block"
            >
              &larr; Analyze another resume
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
                  "{result.summary}"
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
                     if(project.rating.includes("Strong") || project.rating.includes("Impressive")) ratingColor = "bg-green-500/20 text-green-400";
                     else if(project.rating.includes("Average")) ratingColor = "bg-yellow-500/20 text-yellow-400";
                     else if(project.rating.includes("Basic")) ratingColor = "bg-red-500/20 text-red-400";

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
                    )
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
    </div>
  );
}
