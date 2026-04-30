"use client";

import Layout from "../components/Layout";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  FiVideo, FiUsers, FiArrowRight, FiCheckCircle, 
  FiShield, FiRefreshCw, FiDatabase, FiTrendingUp,
  FiZap, FiStar, FiActivity, FiCalendar, FiAward,
  FiCode, FiMessageCircle, FiBell, FiPlay, FiClock,
  FiBarChart2, FiUserPlus, FiGithub, FiLinkedin
} from "react-icons/fi";

export default function Home() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  const testimonials = [
    { name: "Sarah Chen", role: "Senior Frontend Engineer", text: "DevCircle helped me land my dream job at Google. The real-time practice sessions were invaluable!", rating: 5, image: "SC" },
    { name: "Alex Kumar", role: "Full Stack Developer", text: "The peer feedback system is incredible. I've improved my system design skills dramatically.", rating: 5, image: "AK" },
    { name: "Maria Garcia", role: "Tech Lead", text: "Best platform for interview prep. The community is supportive and the sessions are high quality.", rating: 5, image: "MG" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-[#adc6ff]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="space-y-20 md:space-y-28 pb-20 relative">
        
        {/* HERO SECTION - Modern Split Layout */}
        <section className="relative min-h-[90vh] flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-[#adc6ff]/10 to-purple-500/10 border border-[#adc6ff]/20 backdrop-blur-sm animate-fadeIn">
                <div className="w-2 h-2 bg-[#adc6ff] rounded-full animate-pulse"></div>
                <span className="text-xs font-bold tracking-wider text-[#adc6ff] uppercase">🚀 Live Platform Now Active</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                <span className="text-white">Master Technical</span>
                <br />
                <span className="bg-gradient-to-r from-[#adc6ff] via-purple-400 to-[#adc6ff] bg-clip-text text-transparent animate-gradient">
                  Interviews Together
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-lg">
                Join a community of developers practicing real interviews through live, peer-to-peer sessions. Learn, grow, and succeed together.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/interview"
                  className="group relative overflow-hidden inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#adc6ff] to-[#8eaeff] text-[#002e6a] px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-[#adc6ff]/40 transition-all duration-300"
                >
                  <span className="relative z-10">Start Practicing</span>
                  <FiPlay className="relative z-10 group-hover:translate-x-1 transition-transform" size={18} />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                </Link>
                
                <Link
                  href="/interview"
                  className="inline-flex items-center justify-center gap-2 bg-white/5 backdrop-blur border border-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <FiUsers size={18} />
                  Host Session
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 pt-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#4edea3]/10 flex items-center justify-center">
                    <FiUsers className="text-[#4edea3]" size={20} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">500+</div>
                    <div className="text-xs text-zinc-500">Active Members</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#adc6ff]/10 flex items-center justify-center">
                    <FiActivity className="text-[#adc6ff]" size={20} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">1,200+</div>
                    <div className="text-xs text-zinc-500">Sessions Completed</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <FiStar className="text-purple-400" size={20} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">98%</div>
                    <div className="text-xs text-zinc-500">Satisfaction Rate</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Animated Card */}
            <div className="relative hidden lg:block">
              <div className="relative bg-gradient-to-br from-zinc-900/80 to-black border border-white/10 rounded-2xl p-6 backdrop-blur-xl transform rotate-3 hover:rotate-0 transition-all duration-500">
                <div className="absolute -top-3 -right-3 w-20 h-20 bg-gradient-to-r from-[#adc6ff] to-purple-500 rounded-full blur-2xl opacity-30"></div>
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-[10px] font-mono text-zinc-500">live-session.tsx</span>
                  </div>
                </div>
                <div className="space-y-2 font-mono text-sm">
                  <div className="text-[#adc6ff]">// Live Interview Session</div>
                  <div className="text-white">
                    <span className="text-pink-400">const</span> session = <span className="text-blue-400">new</span> <span className="text-yellow-400">LiveSession</span>();
                  </div>
                  <div className="text-white">
                    session.<span className="text-green-400">join</span>({`{`}
                    <span className="text-orange-400">role</span>: <span className="text-green-400">'candidate'</span>
                    {`}`});
                  </div>
                  <div className="text-zinc-500">// Real-time collaboration started</div>
                  <div className="text-white">
                    <span className="text-blue-400">await</span> session.<span className="text-green-400">startInterview</span>();
                  </div>
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-xs">4 participants online</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-[#adc6ff]/10 rounded-full blur-2xl"></div>
            </div>
          </div>
        </section>

        {/* FEATURE SECTION - Modern Grid */}
        <section>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
              <FiZap className="text-[#adc6ff]" size={14} />
              <span className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Why Choose DevCircle</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Built for{" "}
              <span className="bg-gradient-to-r from-[#adc6ff] to-purple-400 bg-clip-text text-transparent">
                Modern Developers
              </span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Everything you need to ace your technical interviews
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: FiVideo,
                title: "Live Interview System",
                desc: "Real-time video, code editor, and whiteboard collaboration",
                color: "from-blue-500/20 to-blue-500/5",
                iconColor: "text-blue-400",
                stats: "500+ active sessions"
              },
              {
                icon: FiTrendingUp,
                title: "AI Resume Analysis",
                desc: "Get instant feedback and ATS optimization tips",
                color: "from-purple-500/20 to-purple-500/5",
                iconColor: "text-purple-400",
                stats: "94% match rate"
              },
              {
                icon: FiShield,
                title: "Smart Access Control",
                desc: "Granular permissions for secure practice sessions",
                color: "from-emerald-500/20 to-emerald-500/5",
                iconColor: "text-emerald-400",
                stats: "End-to-end encrypted"
              },
             
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group relative bg-gradient-to-br from-zinc-900/50 to-black border border-white/10 rounded-2xl p-6 hover:border-[#adc6ff]/30 transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`${feature.iconColor} text-2xl`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-3">{feature.desc}</p>
                <div className="inline-flex items-center gap-1.5 text-xs text-[#adc6ff]">
                  <FiBarChart2 size={12} />
                  <span>{feature.stats}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-gradient-to-br from-zinc-900/30 to-black border border-white/10 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How <span className="text-[#adc6ff]">DevCircle</span> Works
            </h2>
            <p className="text-zinc-400 text-lg">Three simple steps to master your interviews</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Join Community", desc: "Sign up and connect with developers at similar skill levels", icon: FiUserPlus, color: "from-blue-500/20 to-blue-500/5" },
              { step: "02", title: "Practice Live", desc: "Join or host sessions with real-time collaboration tools", icon: FiVideo, color: "from-purple-500/20 to-purple-500/5" },
              { step: "03", title: "Get Feedback", desc: "Receive instant feedback and track your progress", icon: FiMessageCircle, color: "from-emerald-500/20 to-emerald-500/5" }
            ].map((item, idx) => (
              <div key={idx} className="relative text-center group">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className="text-[#adc6ff] text-3xl" />
                </div>
                <div className="text-6xl font-bold text-white/5 absolute top-0 right-0 group-hover:scale-110 transition-transform"> {item.step}</div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-zinc-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

      

        {/* CTA SECTION - Bold */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#adc6ff]/10 via-purple-500/10 to-[#adc6ff]/10 border border-white/10 p-12 text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#adc6ff]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Ready to <span className="text-[#adc6ff]">Level Up</span> Your Interview Skills?
            </h2>
            <p className="text-zinc-400 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of developers who are already improving their interview skills with DevCircle
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/interview"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#adc6ff] to-[#8eaeff] text-[#002e6a] px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-[#adc6ff]/40 transition-all transform hover:scale-105"
              >
                Get Started Free
                <FiArrowRight size={18} />
              </Link>
              <Link
                href="/interview"
                className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
              >
                View Live Sessions
                <FiUsers size={18} />
              </Link>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s linear infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </Layout>
  );
}