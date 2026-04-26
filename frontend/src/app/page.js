"use client";

import Layout from "../components/Layout";
import HeroSection from "../components/HeroSection";
import FeatureSection from "../components/FeatureSection";
import Link from "next/link";

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <FeatureSection />

      {/* Stats Section */}
      <section className="px-lg py-xl border-t border-white/5 mt-xl">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-xl text-center">
          <div>
            <div className="font-h2 text-4xl font-bold text-primary">50k+</div>
            <div className="text-label-caps text-zinc-500 mt-xs tracking-widest text-xs uppercase">Sessions Completed</div>
          </div>
          <div>
            <div className="font-h2 text-4xl font-bold text-secondary">92%</div>
            <div className="text-label-caps text-zinc-500 mt-xs tracking-widest text-xs uppercase">Offer Success Rate</div>
          </div>
          <div>
            <div className="font-h2 text-4xl font-bold text-tertiary">15k+</div>
            <div className="text-label-caps text-zinc-500 mt-xs tracking-widest text-xs uppercase">Active Mentors</div>
          </div>
          <div>
            <div className="font-h2 text-4xl font-bold text-white">200+</div>
            <div className="text-label-caps text-zinc-500 mt-xs tracking-widest text-xs uppercase">Elite Companies</div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-lg py-[100px] text-center">
        <div className="max-w-3xl mx-auto glass-panel p-xl rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -z-10"></div>
          <h2 className="font-h2 text-[30px] font-bold text-white mb-md">Ready to break into big tech?</h2>
          <p className="font-body-lg text-lg text-on-surface-variant mb-xl">
            Join the most active developer interview community in the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-md justify-center">
            <Link
              href="/auth"
              className="bg-primary text-on-primary px-xl py-md rounded-lg font-bold hover:brightness-110 active:scale-95 transition-all text-center"
            >
              Get Started Free
            </Link>
            <Link
              href="/interview"
              className="bg-transparent text-white border border-white/20 px-xl py-md rounded-lg font-bold hover:bg-white/5 active:scale-95 transition-all text-center"
            >
              Browse Sessions
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}