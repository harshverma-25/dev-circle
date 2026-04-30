"use client";

import { useState, useEffect } from "react";
import { 
  FiVideo, FiMic, FiUsers, FiTrendingUp, FiCheckCircle, 
  FiBarChart2, FiAward, FiZap, FiShield, FiClock
} from "react-icons/fi";

export default function FeatureSection() {
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.feature-card');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="px-4 sm:px-6 py-12 md:py-16 lg:py-20 bg-gradient-to-b from-black via-zinc-950 to-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-full mb-4">
            <FiZap className="text-blue-400" size={14} />
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Platform Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent mb-4">
            Engineered for Excellence.
          </h2>
          <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto">
            Professional tools designed to help you succeed in technical interviews
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Feature 1: Live Interview System */}
          <div 
            id="feature1"
            className="feature-card lg:col-span-7 bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden group hover:border-[#adc6ff]/40 hover:shadow-2xl hover:shadow-[#adc6ff]/5 transition-all duration-500"
          >
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#adc6ff]/20 to-[#adc6ff]/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FiVideo className="text-[#adc6ff]" size={28} />
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-xs font-medium">Live</span>
                </div>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-[#adc6ff] transition-colors duration-300">
                Live Interview System
              </h3>
              <p className="text-zinc-400 text-base leading-relaxed mb-8">
                Experience high-fidelity coding sessions with low-latency syncing. Practice data structures, algorithms, and system design in a real-time environment built for collaboration.
              </p>
            </div>
            
            {/* Live Demo Preview */}
            <div className="relative bg-gradient-to-t from-black/80 to-transparent p-6 md:p-8 pt-0">
              <div className="relative bg-black/60 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#adc6ff]/50 to-transparent"></div>
                
                {/* Video Grid Preview */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {/* Host */}
                    <div className="relative bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 rounded-lg overflow-hidden aspect-square">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-2">
                            <FiMic className="text-[#adc6ff]" size={20} />
                          </div>
                          <span className="text-xs font-medium text-white">Host</span>
                          <div className="flex items-center justify-center gap-1 mt-1">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span className="text-[10px] text-green-400">Live</span>
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-xs text-white">
                        Sarah Chen
                      </div>
                    </div>

                    {/* Participant */}
                    <div className="relative bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 rounded-lg overflow-hidden aspect-square">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mb-2">
                            <FiUsers className="text-green-400" size={20} />
                          </div>
                          <span className="text-xs font-medium text-white">Participant</span>
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-xs text-white">
                        Alex Kumar
                      </div>
                    </div>
                  </div>

                  {/* Controls Preview */}
                  <div className="flex justify-center gap-4 mt-4">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <FiMic size={14} className="text-white" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <FiVideo size={14} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <FiClock className="text-blue-400" size={14} />
                  <span className="text-xs text-zinc-500">&lt;50ms latency</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiUsers className="text-blue-400" size={14} />
                  <span className="text-xs text-zinc-500">Up to 20 participants</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Feature 2: Resume Intelligence */}
          <div 
            id="feature2"
            className="feature-card lg:col-span-5 bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col group hover:border-[#adc6ff]/40 hover:shadow-2xl hover:shadow-[#adc6ff]/5 transition-all duration-500"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <FiBarChart2 className="text-purple-400" size={28} />
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors duration-300">
              Resume Intelligence
            </h3>
            <p className="text-zinc-400 text-base leading-relaxed mb-8">
              AI-powered feedback and ATS score optimization tailored for FAANG and elite tech startups.
            </p>
            
            <div className="mt-auto space-y-3">
              {/* Score Card */}
              <div className="relative overflow-hidden bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-white/10 p-4">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">ATS Score</span>
                    <span className="text-2xl font-bold text-[#adc6ff]">94%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full w-[94%] animate-pulse"></div>
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">Top 6% of applicants</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-all">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <FiCheckCircle className="text-green-400" size={16} />
                  </div>
                  <span className="text-sm font-medium text-white">Keywords Optimized</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiTrendingUp className="text-green-400" size={14} />
                  <span className="text-green-400 text-xs font-bold">+12</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-all">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <FiAward className="text-purple-400" size={16} />
                  </div>
                  <span className="text-sm font-medium text-white">FAANG Match</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiZap className="text-purple-400" size={14} />
                  <span className="text-purple-400 text-xs font-bold uppercase">High</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-all">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <FiShield className="text-blue-400" size={16} />
                  </div>
                  <span className="text-sm font-medium text-white">Success Rate</span>
                </div>
                <span className="text-blue-400 text-xs font-bold">78%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Feature Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="feature-card bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl border border-white/10 rounded-xl p-5 group hover:border-[#adc6ff]/30 hover:shadow-lg transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FiZap className="text-orange-400" size={20} />
            </div>
            <h4 className="text-white font-semibold mb-2">Real-time Feedback</h4>
            <p className="text-zinc-500 text-sm">Instant code analysis and optimization suggestions</p>
          </div>

          <div className="feature-card bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl border border-white/10 rounded-xl p-5 group hover:border-[#adc6ff]/30 hover:shadow-lg transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FiShield className="text-cyan-400" size={20} />
            </div>
            <h4 className="text-white font-semibold mb-2">Secure Sessions</h4>
            <p className="text-zinc-500 text-sm">End-to-end encrypted video and code collaboration</p>
          </div>

          <div className="feature-card bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl border border-white/10 rounded-xl p-5 group hover:border-[#adc6ff]/30 hover:shadow-lg transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FiTrendingUp className="text-pink-400" size={20} />
            </div>
            <h4 className="text-white font-semibold mb-2">Progress Tracking</h4>
            <p className="text-zinc-500 text-sm">Detailed analytics and performance metrics</p>
          </div>
        </div>
      </div>
    </section>
  );
}