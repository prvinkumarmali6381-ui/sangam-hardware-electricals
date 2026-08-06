"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail 
} from "firebase/auth";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isResetMode, setIsResetMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Successful Auth Session Initializer
  const initializeSession = () => {
    localStorage.setItem("isAdminLoggedIn", "true");
    localStorage.setItem("loginTimestamp", Date.now().toString());
    router.push("/admin");
  };

  // 1. LOGIN HANDLER
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      // Fallback Master Credentials Check
      if (
        (email === "sangamhardware@gmail.com" || email === "admin@sangam.com") &&
        password === "Sangam@12345"
      ) {
        initializeSession();
        return;
      }

      // Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        initializeSession();
      }
    } catch (err: any) {
      setError("Galat Email ya Password! Sahi details enter karein.");
    } finally {
      setLoading(false);
    }
  };

  // 2. FORGOT PASSWORD HANDLER
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Kripya apna registered Email ID enter karein.");
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password Reset Link aapke Email par bhej diya gaya hai! Inbox & Spam check karein.");
    } catch (err: any) {
      setMessage("Master Credentials Info: Login ke liye 'sangamhardware@gmail.com' aur Password 'Sangam@12345' use karein.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-slate-900">
            {isResetMode ? "Reset Password" : "Sangam Admin Login"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isResetMode
              ? "Apna registered email enter karein password reset link paane ke liye"
              : "Admin Panel Open Karne Ke Liye Details Bharein"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-semibold mb-6 text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-semibold mb-6 text-center leading-relaxed">
            {message}
          </div>
        )}

        {!isResetMode ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="sangamhardware@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-bold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsResetMode(true);
                    setError("");
                    setMessage("");
                  }}
                  className="text-xs font-semibold text-orange-600 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg mt-2 text-base cursor-pointer disabled:opacity-50"
            >
              {loading ? "Verifying..." : "🔓 Login to Dashboard"}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordReset} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Registered Email Address
              </label>
              <input
                type="email"
                required
                placeholder="sangamhardware@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition shadow-lg text-base cursor-pointer disabled:opacity-50"
            >
              {loading ? "Sending..." : "📧 Send Password Reset Link"}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsResetMode(false);
                setError("");
                setMessage("");
              }}
              className="w-full text-center text-sm font-bold text-slate-600 hover:text-slate-900 py-2 cursor-pointer"
            >
              ← Back to Login
            </button>
          </form>
        )}
      </div>
    </main>
  );
}