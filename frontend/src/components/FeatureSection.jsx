"use client";

export default function FeatureSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

      <div className="bg-[#1A1A1A] p-6 rounded-lg">
        <h3 className="text-white font-semibold mb-2">
          Live Interview System
        </h3>
        <p className="text-gray-400 text-sm">
          Practice interviews in real-time with peers.
        </p>
      </div>

      <div className="bg-[#1A1A1A] p-6 rounded-lg">
        <h3 className="text-white font-semibold mb-2">
          Open Participation
        </h3>
        <p className="text-gray-400 text-sm">
          Anyone can host or join sessions.
        </p>
      </div>

      <div className="bg-[#1A1A1A] p-6 rounded-lg">
        <h3 className="text-white font-semibold mb-2">
          Community Learning
        </h3>
        <p className="text-gray-400 text-sm">
          Learn by practicing together.
        </p>
      </div>

    </section>
  );
}