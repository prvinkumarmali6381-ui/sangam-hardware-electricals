"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 🔑 LOGIN HANDLER
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Kripya Email aur Password dono fill karein!");
      return;
    }

    try {
      setLoading(true);

      // Session persistent lock on browser tab close
      await setPersistence(auth, browserSessionPersistence);

      // Firebase Authentication Login
      await signInWithEmailAndPassword(auth, email, password);

      // Set admin session cookie
      document.cookie = "admin=true; path=/;";

      alert("✅ Login Successful!");
      router.push("/admin");
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        alert("User nahi mila! Check karein email registered hai ya nahi.");
      } else if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        alert("Email ya Password galat hai!");
      } else if (error.code === "auth/invalid-email") {
        alert("Email format sahi nahi hai!");
      } else {
        alert("❌ Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔄 FORGOT / RESET PASSWORD HANDLER
  const handleForgotPassword = async () => {
    if (!email) {
      alert("Pehle apna Email box me likhein, fir 'Forgot Password?' par click karein!");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("📧 Password Reset Link aapke email par bhej diya gaya hai!");
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        alert("Is Email se koi account registered nahi hai.");
      } else {
        alert("❌ Error: " + error.message);
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-6 text-gray-800">
          Sangam Admin Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Admin Email
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              className="border border-gray-300 w-full p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="border border-gray-300 w-full p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white pr-16"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-xs font-bold text-gray-500 hover:text-orange-600 uppercase"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white w-full py-3.5 rounded-xl font-bold transition shadow-md disabled:bg-gray-400 mt-2"
          >
            {loading ? "Logging In..." : "🔐 Login"}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm font-semibold text-orange-600 hover:underline"
          >
            🔑 Forgot Password? Reset Link Bhejo
          </button>
        </div>
      </div>
    </main>
  );
}