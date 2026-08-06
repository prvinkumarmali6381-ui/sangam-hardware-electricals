"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase"; // Aapka Firebase setup
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isResetMode, setIsResetMode] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      // Firebase Sign In
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("isAdminLoggedIn", "true");
      router.push("/admin");
    } catch (err: any) {
      setError("Galat Email ya Password! Sahi details enter karein.");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Kripya pehle apna Registered Email bharein.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password Reset Link aapke Email par bhej diya gaya hai! Inbox check karein.");
    } catch (err: any) {
      setError("Reset link bhejne me error aaya: " + err.message);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-slate-900">
            {isResetMode ? "Reset Admin Password" : "Sangam Hardware Admin Login"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isResetMode
              ? "Registered Email par Password Reset link bheja jayega"
              : "Product & Inventory Manage Karne Ke Liye Login Karein"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-semibold mb-6 text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-semibold mb-6 text-center">
            {message}
          </div>
        )}

        {!isResetMode ? (
          /* LOGIN FORM */
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="admin@example.com"
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
                  onClick={() => setIsResetMode(true)}
                  className="text-xs font-bold text-orange-600 hover:underline"
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
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg mt-2 text-base cursor-pointer"
            >
              🔓 Login to Dashboard
            </button>
          </form>
        ) : (
          /* FORGOT PASSWORD FORM */
          <form onSubmit={handleForgotPassword} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Registered Email Address
              </label>
              <input
                type="email"
                required
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition shadow-lg text-base cursor-pointer"
            >
              📧 Send Reset Link
            </button>

            <button
              type="button"
              onClick={() => setIsResetMode(false)}
              className="w-full text-center text-sm font-bold text-slate-600 hover:text-slate-900 py-2"
            >
              ← Back to Login
            </button>
          </form>
        )}
      </div>
    </main>
  );
}