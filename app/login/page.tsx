"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  // FIX: Capital 'Router()' ki jagah 'useRouter()' hoga
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const envEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "sangamhardware@gmail.com";
    const envPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "Sangam@12345";

    if (email === envEmail && password === envPassword) {
      // Save auth session in LocalStorage
      localStorage.setItem("isAdminLoggedIn", "true");
      router.push("/admin");
    } else {
      setError("Galat Email ya Password! Kripya sahi details dalein.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-slate-900">
            Sangam Hardware Admin Login
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Product & Inventory Manage Karne Ke Liye Login Karein
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-semibold mb-6 text-center">
            {error}
          </div>
        )}

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
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Password
            </label>
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
      </div>
    </main>
  );
}