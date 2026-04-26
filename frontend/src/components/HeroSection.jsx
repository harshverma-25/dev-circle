"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative px-lg py-xl md:px-xl md:py-[80px] overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-4xl mx-auto text-center md:text-left">
        <div className="inline-flex items-center px-sm py-xs rounded-full bg-secondary/10 text-secondary border border-secondary/20 mb-lg">
          <span className="material-symbols-outlined text-[18px] mr-xs">bolt</span>
          <span className="text-label-caps uppercase">Live sessions now available</span>
        </div>
        
        <h1 className="font-h1 text-[48px] leading-[1.1] tracking-[-0.02em] font-bold text-white mb-lg">
          Master the Technical Interview Together.
        </h1>
        
        <p className="font-body-lg text-lg text-on-surface-variant mb-xl max-w-2xl leading-relaxed">
          DevCircle helps developers practice real interviews together through live, peer-to-peer sessions.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-md">
          <Link
            href="/interview"
            className="bg-primary text-on-primary px-lg py-md rounded-lg font-semibold text-body-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center pulse-glow"
          >
            Join a Session
          </Link>
          <Link
            href="/interview"
            className="bg-white/5 text-white border border-white/10 px-lg py-md rounded-lg font-semibold text-body-md hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center"
          >
            Host an Interview
          </Link>
        </div>
      </div>

      {/* Visual Dashboard Preview */}
      <div className="mt-xl relative mx-auto max-w-5xl group">
        <div className="glass-panel rounded-xl p-md shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/5 pb-md mb-md">
            <div className="flex gap-xs">
              <div className="w-3 h-3 rounded-full bg-error/40"></div>
              <div className="w-3 h-3 rounded-full bg-tertiary-container/40"></div>
              <div className="w-3 h-3 rounded-full bg-secondary/40"></div>
            </div>
            <div className="text-label-caps text-zinc-500 tracking-widest">LIVE SESSION: SYSTEM DESIGN</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-lg h-auto md:h-[400px]">
            <div className="md:col-span-8 code-canvas rounded-lg p-lg font-code text-body-sm relative min-h-[300px]">
              <div className="text-secondary opacity-80 mb-sm">/* Peer Interview Collaboration */</div>
              <div className="text-white leading-[1.6]">
                <span className="text-tertiary">async function</span> <span className="text-primary">solveProblem</span>(candidate) {"{"}
                <br />
                &nbsp;&nbsp;<span className="text-tertiary">const</span> session = <span className="text-tertiary">await</span> LiveSession.start();
                <br />
                &nbsp;&nbsp;<span className="text-zinc-500">// Real-time feedback loop initiated</span>
                <br />
                &nbsp;&nbsp;<span className="text-tertiary">return</span> session.optimizePerformance();
                <br />
                {"}"}
              </div>
              <div className="absolute bottom-md right-md flex gap-sm">
                <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 overflow-hidden">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPhuZhXJ6jKCvfNmp8Ns5eoyO1fzLBIvvdK3PdUGhi2mR4sK9pRj4TidTF_EW50F5IM8DLanlV50ij1R7PDgkVL8z7tRnXoUq9QVCr4XgSv1AFgH2qBaDGKi9l5E-rvmV7N3aY1nAJjjS1D1umsWDIcSKuIXY1ntUB0Guivq6qeMZpQ9kk2CToz-Vd98WtuNN-WFmNdsfQWki0nd1wGFnSkTGFbRIgvbjtYFKWlC6Skzs5mOpe-hsK8c0d58CkLGkx9-1eU8LPMw" alt="Interviewer" className="w-full h-full object-cover" />
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold">
                  JD
                </div>
              </div>
            </div>
            
            <div className="md:col-span-4 space-y-md">
              <div className="glass-panel rounded-lg p-md h-full flex flex-col">
                <div className="text-label-caps text-zinc-400 mb-sm tracking-widest">INTERVIEWER NOTES</div>
                <div className="space-y-sm flex-1">
                  <div className="h-2 w-full bg-white/5 rounded"></div>
                  <div className="h-2 w-3/4 bg-white/5 rounded"></div>
                  <div className="h-2 w-5/6 bg-white/5 rounded"></div>
                  <div className="h-2 w-1/2 bg-white/5 rounded mt-4"></div>
                </div>
                
                <div className="mt-xl pt-md border-t border-white/5">
                  <div className="flex justify-between text-body-sm mb-xs">
                    <span className="text-zinc-400">ATS Score</span>
                    <span className="text-secondary font-bold">84%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-secondary h-full w-[84%]"></div>
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