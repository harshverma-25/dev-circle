"use client";

export default function FeatureSection() {
  return (
    <section className="px-lg py-xl md:px-xl">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-h2 text-[30px] font-bold text-white mb-xl text-center tracking-[-0.01em]">
          Engineered for Excellence.
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
          {/* Feature 1: Live Interview System */}
          <div className="md:col-span-7 glass-panel rounded-xl p-xl flex flex-col justify-between group hover:border-primary/30 transition-all duration-300">
            <div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-lg">
                <span className="material-symbols-outlined text-[32px]">sensors</span>
              </div>
              <h3 className="font-h3 text-2xl font-bold text-white mb-md">Live Interview System</h3>
              <p className="font-body-md text-on-surface-variant mb-lg leading-relaxed">
                Experience high-fidelity coding sessions with low-latency syncing. Practice data structures, algorithms, and system design in a real-time environment built for collaboration.
              </p>
            </div>
            
            <div className="relative h-40 mt-md bg-black/40 rounded-lg overflow-hidden border border-white/5">
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10"></div>
              <div className="p-md flex gap-md relative z-0">
                <div className="w-1/2 h-full bg-white/5 rounded-md flex flex-col justify-center items-center py-4">
                  <div className="w-12 h-12 rounded-full border-2 border-secondary pulse-glow mb-sm overflow-hidden bg-zinc-800">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMK2UOltgTx1qYKZJd_ge5ImBO-dux_-KKnFaxT0D-47Ks8zrSblIK1L1IT9YgyYrbWRRbPC4yebzav2WouOO_VoRM1VmAm848TACJgaXbdgQcF25MaT1oV6BEzOXZQYGxi5lAnOTIbHRKvb07vdSaS3PzB01eVxXZhIs7ZuQUy5KMHw9obIUCfiTeTYNRPyJJckiGY9-OjE_XGKEmngEXosAmCscEydPER_mSEkZAiMJrsTOWUj38YDXVTOE9taarL7Hzu7o8Yg" alt="Live User" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs font-medium text-secondary">Live</span>
                </div>
                <div className="w-1/2 h-full bg-white/5 rounded-md flex flex-col justify-center items-center py-4">
                  <div className="w-12 h-12 rounded-full border-2 border-zinc-700 mb-sm overflow-hidden bg-zinc-800">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPhuZhXJ6jKCvfNmp8Ns5eoyO1fzLBIvvdK3PdUGhi2mR4sK9pRj4TidTF_EW50F5IM8DLanlV50ij1R7PDgkVL8z7tRnXoUq9QVCr4XgSv1AFgH2qBaDGKi9l5E-rvmV7N3aY1nAJjjS1D1umsWDIcSKuIXY1ntUB0Guivq6qeMZpQ9kk2CToz-Vd98WtuNN-WFmNdsfQWki0nd1wGFnSkTGFbRIgvbjtYFKWlC6Skzs5mOpe-hsK8c0d58CkLGkx9-1eU8LPMw" alt="Peer User" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs font-medium text-zinc-500">Peer</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Feature 2: Resume Intelligence */}
          <div className="md:col-span-5 glass-panel rounded-xl p-xl flex flex-col group hover:border-tertiary/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary mb-lg">
              <span className="material-symbols-outlined text-[32px]">psychology</span>
            </div>
            <h3 className="font-h3 text-2xl font-bold text-white mb-md">Resume Intelligence</h3>
            <p className="font-body-md text-on-surface-variant mb-xl leading-relaxed">
              AI-powered feedback and ATS score optimization tailored for FAANG and elite tech startups.
            </p>
            
            <div className="mt-auto space-y-md relative z-10 w-full flex-grow flex flex-col justify-end">
              <div className="p-md bg-white/5 rounded-lg border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-tertiary">check_circle</span>
                  <span className="text-body-sm font-medium text-white">Keywords Optimized</span>
                </div>
                <span className="text-zinc-500 text-xs font-mono">+12</span>
              </div>
              <div className="p-md bg-white/5 rounded-lg border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-secondary">analytics</span>
                  <span className="text-body-sm font-medium text-white">FAANG Match</span>
                </div>
                <span className="text-secondary text-xs font-bold uppercase tracking-wider">High</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}