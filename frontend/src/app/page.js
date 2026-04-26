"use client";

import Layout from "../components/Layout";
import React from "react";

export default function Home() {
  return (
    <Layout>
      {/* Required for the icons used in your HTML design */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      />

      <div className="space-y-12 pb-20">
        {/* HERO SECTION */}
        <section className="relative h-[480px] rounded-[2.5rem] overflow-hidden flex items-center px-12 border border-white/5">
          {/* Background Image & Gradient */}
          <div className="absolute inset-0 z-0">
            <img
              alt="Tech Background"
              className="w-full h-full object-cover opacity-40 grayscale"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvrouNFjlULhTYC8pAmAS1fGcLn9vcjV5k442BfB12qWftdcugQqYX8SES-Y9ziQQ10lLPvqNBVjk8EK2aMXjaOdV_Lnuto_mIRBN_ULQh967_NclNAomgPqPwTq0NXXpfHs1pSowWX0ldAG_6mIXuM8If6SqXdmXnofnRBXd7faykrHMmc1E1uQlKm6Vgri7M9QmOXvroQiq3mtCP1rMy4HZWKURQx_z1la89YlzflRmY1FoczusWCLtS9cCdfUGOxPolXreTFw" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#131313] via-[#131313]/70 to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#adc6ff]/10 border border-[#adc6ff]/20 text-[#adc6ff] text-[10px] font-bold tracking-[0.2em] mb-8 uppercase">
              Collaborative Prep
            </span>
            <h1 className="text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
              Practice Together. <br />
              <span className="text-[#adc6ff]">Grow Together.</span>
            </h1>
            <p className="text-lg text-zinc-400 mb-10 max-w-lg leading-relaxed">
              DevCircle helps developers practice real interviews together through live, peer-to-peer sessions. Host, join, and learn in a continuous community loop.
            </p>
            <div className="flex gap-4">
              <button className="bg-[#adc6ff] text-[#002e6a] px-8 py-4 rounded-2xl font-bold text-lg hover:brightness-110 shadow-[0_10px_40px_rgba(173,198,255,0.3)] transition-all active:scale-95">
                Join a Session
              </button>
              <button className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all active:scale-95">
                Host an Interview
              </button>
            </div>
          </div>
        </section>

        {/* FEATURE BENTO GRID */}
        <section className="grid grid-cols-12 gap-8">
          
          {/* Main Card: Live Interview System */}
          <div className="col-span-12 lg:col-span-7 bg-[#1e1e1e]/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 flex flex-col justify-between group hover:border-[#adc6ff]/30 transition-all">
            <div>
              <div className="w-14 h-14 bg-[#4edea3]/10 rounded-2xl flex items-center justify-center mb-8 border border-[#4edea3]/20">
                <span className="material-symbols-outlined text-[#4edea3] text-3xl">stadium</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">Live Interview System</h2>
              <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
                Robust collaborative coding environment with integrated video, shared whiteboards, and real-time execution.
              </p>
            </div>

            <div className="flex items-center justify-between mt-10">
              <div className="flex -space-x-4">
                {[1, 2, 3].map((i) => (
                  <img
                    key={i}
                    className="w-12 h-12 rounded-full border-4 border-[#1e1e1e] bg-zinc-800"
                    src={`https://i.pravatar.cc/150?u=${i}`}
                    alt="user"
                  />
                ))}
                <div className="w-12 h-12 rounded-full bg-[#1c1b1b] border-4 border-[#1e1e1e] flex items-center justify-center text-xs font-black text-zinc-400">
                  +241
                </div>
              </div>
              <a className="text-[#adc6ff] flex items-center gap-2 font-bold group-hover:gap-4 transition-all text-lg">
                View Live Lobby <span className="material-symbols-outlined">arrow_forward</span>
              </a>
            </div>
          </div>

          {/* Secondary Card: Resume Intelligence */}
          <div className="col-span-12 lg:col-span-5 bg-[#1e1e1e]/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 flex flex-col group hover:border-[#adc6ff]/30 transition-all">
            <div className="w-14 h-14 bg-[#adc6ff]/10 rounded-2xl flex items-center justify-center mb-8 border border-[#adc6ff]/20">
              <span className="material-symbols-outlined text-[#adc6ff] text-3xl">psychology</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">Resume Intelligence</h2>
            <p className="text-zinc-400 text-lg leading-relaxed mb-10">
              Get instant AI-powered feedback on your resume. Optimize for ATS and highlight impact.
            </p>
            <div className="mt-auto bg-[#1c1b1b] rounded-3xl p-6 border border-white/5 space-y-4">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                <span className="text-zinc-500">AI Optimization Score</span>
                <span className="text-[#adc6ff]">94%</span>
              </div>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#adc6ff] w-[94%]"></div>
              </div>
              <p className="text-[11px] text-zinc-500 italic leading-relaxed">
                "ATS match high for Senior Backend roles. Suggesting more impact-driven metrics."
              </p>
            </div>
          </div>

          {/* Bottom Row Small Cards */}
          {[
            { title: "Smart Access", desc: "Granular control over who can join your practice rooms.", icon: "shield" },
            { title: "The Loop", desc: "A data-driven feedback cycle where you learn by switching roles.", icon: "sync" },
            { title: "Shared Library", desc: "Access a community-vetted database of real interview questions.", icon: "database" }
          ].map((item) => (
            <div key={item.title} className="col-span-12 md:col-span-4 bg-[#1e1e1e]/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8">
              <span className="material-symbols-outlined text-zinc-500 mb-4">{item.icon}</span>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* ABOUT SECTION */}
        <section className="grid md:grid-cols-2 gap-16 items-center pt-10">
          <div className="relative rounded-[2.5rem] border border-white/10 overflow-hidden aspect-square flex items-center justify-center bg-gradient-to-br from-[#003824]/30 to-black">
             <img 
              src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80" 
              className="absolute inset-0 w-full h-full object-cover opacity-20"
              alt="Code background"
             />
             <div className="text-center relative z-10">
                <p className="text-zinc-500 text-xs uppercase tracking-[0.3em] mb-3">About Platform</p>
                <h3 className="text-5xl font-black text-white/90">Safe work</h3>
             </div>
          </div>

          <div className="space-y-10">
            <h2 className="text-5xl font-bold text-white tracking-tight">Why DevCircle?</h2>
            <p className="text-zinc-400 text-xl leading-relaxed">
              Traditional interview platforms focus on solo grinding. DevCircle recognizes that interviewing is a social skill.
            </p>
            <ul className="space-y-8">
              {[
                { t: "Peer-to-Peer Focus", d: "Real-time sessions with peers in the trenches." },
                { t: "Community Learning Loop", d: "Gain unique insights by switching roles." },
                { t: "Reputation Economy", d: "Get recognized for your technical insight." }
              ].map((item) => (
                <li key={item.t} className="flex gap-6 items-start group">
                  <span className="material-symbols-outlined text-[#adc6ff] text-3xl transition-transform group-hover:scale-110">check_circle</span>
                  <div>
                    <h4 className="text-white text-xl font-bold mb-1">{item.t}</h4>
                    <p className="text-zinc-500 text-base leading-relaxed">{item.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </Layout>
  );
}