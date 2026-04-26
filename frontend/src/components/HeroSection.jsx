"use client";

export default function HeroSection() {
  return (
    <section className="h-[480px] flex items-center">
      <div className="max-w-2xl">
        <span className="text-primary text-sm mb-4 block">
          COLLABORATIVE PREP
        </span>

        <h1 className="text-5xl text-white font-bold mb-4">
          Practice Together. <br />
          <span className="text-primary">Grow Together.</span>
        </h1>

        <p className="text-gray-400 mb-6">
          DevCircle helps developers practice real interviews together
          through live, peer-to-peer sessions.
        </p>

        <div className="flex gap-4">
          <a
            href="/interview"
            className="bg-primary px-6 py-3 rounded text-black"
          >
            Join a Session
          </a>

          <a
            href="/interview"
            className="border border-white/10 px-6 py-3 rounded text-white"
          >
            Host Interview
          </a>
        </div>
      </div>
    </section>
  );
}