"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative px-6 py-10 md:px-8 md:py-[80px] overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#adc6ff]/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-4xl mx-auto text-center md:text-left">
        <div className="inline-flex items-center px-2 py-1 rounded-full bg-[#adc6ff]/10 text-[#adc6ff] border border-[#adc6ff]/20 mb-6">
          <span className="material-symbols-outlined text-[18px] mr-1">bolt</span>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Live sessions now available</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl leading-[1.1] tracking-[-0.02em] font-bold text-white mb-6">
          Master the Technical Interview Together.
        </h1>
        
        <p className="text-lg text-gray-400 mb-8 max-w-2xl leading-relaxed">
          DevCircle helps developers practice real interviews together through live, peer-to-peer sessions.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/interview"
            className="bg-[#adc6ff] text-[#002e6a] px-6 py-3 rounded-lg font-semibold text-base hover:brightness-110 active:scale-95 transition-all flex items-center justify-center shadow-[0_0_20px_rgba(173,198,255,0.1)]"
          >
            Join a Session
          </Link>
          <Link
            href="/interview"
            className="bg-white/5 text-white border border-white/10 px-6 py-3 rounded-lg font-semibold text-base hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center"
          >
            Host an Interview
          </Link>
        </div>
      </div>

      {/* Visual Dashboard Preview */}
      <div className="mt-8 relative mx-auto max-w-5xl group">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500/40"></div>
              <div className="w-3 h-3 rounded-full bg-[#adc6ff]/40"></div>
              <div className="w-3 h-3 rounded-full bg-[#adc6ff]/40"></div>
            </div>
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500">LIVE SESSION: SYSTEM DESIGN</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-auto md:h-[400px]">
            <div className="md:col-span-8 bg-[#131313] border border-white/5 rounded-lg p-6 font-mono text-sm relative min-h-[300px]">
              <div className="text-[#adc6ff] opacity-80 mb-2">/* Peer Interview Collaboration */</div>
              <div className="text-white leading-[1.6]">
                <span className="text-[#adc6ff]">async function</span> <span className="text-[#adc6ff]">solveProblem</span>(candidate) {"{"}
                <br />
                &nbsp;&nbsp;<span className="text-[#adc6ff]">const</span> session = <span className="text-[#adc6ff]">await</span> LiveSession.start();
                <br />
                &nbsp;&nbsp;<span className="text-zinc-500">// Real-time feedback loop initiated</span>
                <br />
                &nbsp;&nbsp;<span className="text-[#adc6ff]">return</span> session.optimizePerformance();
                <br />
                {"}"}
              </div>
              <div className="absolute bottom-4 right-4 flex gap-2">
                <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 overflow-hidden">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPhuZhXJ6jKCvfNmp8Ns5eoyO1fzLBIvvdK3PdUGhi2mR4sK9pRj4TidTF_EW50F5IM8DLanlV50ij1R7PDgkVL8z7tRnXoUq9QVCr4XgSv1AFgH2qBaDGKi9l5E-rvmV7N3aY1nAJjjS1D1umsWDIcSKuIXY1ntUB0Guivq6qeMZpQ9kk2CToz-Vd98WtuNN-WFmNdsfQWki0nd1wGFnSkTGFbRIgvbjtYFKWlC6Skzs5mOpe-hsK8c0d58CkLGkx9-1eU8LPMw" alt="Interviewer" className="w-full h-full object-cover" />
                </div>
                <div className="w-10 h-10 rounded-full bg-[#adc6ff]/20 border border-[#adc6ff]/40 flex items-center justify-center text-[#adc6ff] font-bold">
                  JD
                </div>
              </div>
            </div>
            
            <div className="md:col-span-4 space-y-4">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4 h-full flex flex-col">
                <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 mb-2">INTERVIEWER NOTES</div>
                <div className="space-y-2 flex-1">
                  <div className="h-2 w-full bg-white/5 rounded"></div>
                  <div className="h-2 w-3/4 bg-white/5 rounded"></div>
                  <div className="h-2 w-5/6 bg-white/5 rounded"></div>
                  <div className="h-2 w-1/2 bg-white/5 rounded mt-4"></div>
                </div>
                
                <div className="mt-8 pt-4 border-t border-white/5">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-zinc-400">ATS Score</span>
                    <span className="text-[#adc6ff] font-bold">84%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#adc6ff] h-full w-[84%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}