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
    <div className="min-h-screen bg-[#131313] flex flex-col justify-center items-center px-6">
      <div className="w-full max-w-md bg-[#201f1f] p-8 rounded-2xl border border-white/10 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-2">
          {isLogin ? "Welcome Back" : "Join DevCircle"}
        </h1>
        <p className="text-zinc-500 mb-8">
          {isLogin
            ? "Sign in to continue practicing"
            : "Create an account to start hosting sessions"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                className="w-full bg-[#0e0e0e] border border-white/5 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-all"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full bg-[#0e0e0e] border border-white/5 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-all"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full bg-[#0e0e0e] border border-white/5 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-all"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all mt-4 disabled:opacity-50"
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary text-sm hover:underline"
          >
            {isLogin
              ? "New here? Create an account"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
