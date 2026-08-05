"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const login = async () => {
    if (!email || !password) {
      alert("Email aur Password dalo");
      return;
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(auth, email, password);

      document.cookie = "admin=true; path=/; max-age=86400";

      alert("✅ Login Successful");

      router.push("/admin");
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        alert("User nahi mila");
      } else if (error.code === "auth/wrong-password") {
        alert("Password galat hai");
      } else if (error.code === "auth/invalid-credential") {
        alert("Email ya Password galat hai");
      } else if (error.code === "auth/invalid-email") {
        alert("Email galat hai");
      } else {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async () => {
    if (!email) {
      alert("Pehle Email enter karo");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("📧 Password Reset Link Email par bhej diya gaya hai.");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-[400px]">

        <h1 className="text-3xl font-bold text-center mb-6">
          Sangam Admin Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="border w-full p-3 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="border w-full p-3 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-sm text-gray-600"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          onClick={login}
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 text-white w-full py-3 rounded-xl font-bold"
        >
          {loading ? "Logging In..." : "Login"}
        </button>

        <button
          onClick={forgotPassword}
          className="w-full mt-4 text-blue-600 hover:underline"
        >
          Forgot Password?
        </button>

      </div>
    </main>
  );
}