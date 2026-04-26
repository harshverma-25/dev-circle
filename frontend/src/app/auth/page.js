"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "../../store/useAuthStore";
import api from "../../lib/api";

export default function AuthPage() {
  const router = useRouter();
  const loginInStore = useAuthStore((state) => state.login);

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const { data } = await api.post(endpoint, formData);

      if (data.success) {
        loginInStore(data.user, data.accessToken);
        router.push("/interview");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] flex items-center justify-center px-6 relative overflow-hidden font-['Inter']">
      
      {/* Background Decor - Matching your Stitch Design aesthetic */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#adc6ff]/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#adc6ff]/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        
        {/* LOGO AREA */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 bg-[#adc6ff] rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(173,198,255,0.2)]">
            <span className="material-symbols-outlined text-[#002e6a] text-3xl">group_work</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">DevCircle</h1>
        </div>

        {/* GLASS CARD */}
        <div className="bg-[#1e1e1e]/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white leading-tight">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-zinc-500 text-sm mt-2">
              {isLogin
                ? "Sign in to access your interview dashboard."
                : "Join the community and start practicing."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-widest font-bold text-zinc-500 ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full bg-[#111111] border border-white/5 rounded-2xl px-5 py-4 text-white outline-none focus:border-[#adc6ff]/50 focus:ring-4 focus:ring-[#adc6ff]/5 transition-all placeholder:text-zinc-700"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-widest font-bold text-zinc-500 ml-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="name@company.com"
                className="w-full bg-[#111111] border border-white/5 rounded-2xl px-5 py-4 text-white outline-none focus:border-[#adc6ff]/50 focus:ring-4 focus:ring-[#adc6ff]/5 transition-all placeholder:text-zinc-700"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-widest font-bold text-zinc-500 ml-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-[#111111] border border-white/5 rounded-2xl px-5 py-4 text-white outline-none focus:border-[#adc6ff]/50 focus:ring-4 focus:ring-[#adc6ff]/5 transition-all placeholder:text-zinc-700"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#adc6ff] text-[#002e6a] font-black py-4 rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(173,198,255,0.2)] disabled:opacity-50 mt-4"
            >
              {loading ? "AUTHENTICATING..." : isLogin ? "SIGN IN" : "CREATE ACCOUNT"}
            </button>
          </form>

          {/* TOGGLE SWITCH */}
          <div className="mt-8 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-zinc-500 text-sm font-medium hover:text-[#adc6ff] transition-colors"
            >
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <span className="text-[#adc6ff] font-bold">
                {isLogin ? "Sign up" : "Log in"}
              </span>
            </button>
          </div>
        </div>

        {/* FOOTER NOTE */}
        <p className="text-center text-zinc-600 text-[10px] uppercase tracking-[0.2em] mt-10">
          Secure Encrypted Authentication
        </p>
      </div>

      {/* Global CSS for Icons */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      />
    </div>
  );
}