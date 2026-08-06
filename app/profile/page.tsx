"use client";

export default function ProfilePage() {
  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        👤 Admin Profile
      </h1>

      <div className="bg-white p-6 rounded-xl shadow max-w-xl">

        <input
          type="text"
          placeholder="Admin Name"
          className="border p-3 rounded w-full mb-4"
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded w-full mb-4"
        />

        <input
          type="password"
          placeholder="New Password"
          className="border p-3 rounded w-full mb-4"
        />

        <button className="bg-orange-500 text-white px-6 py-3 rounded">
          💾 Save Profile
        </button>

      </div>

    </div>
  );
}