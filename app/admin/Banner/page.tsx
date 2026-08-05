"use client";

export default function BannerPage() {
  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        🎨 Hero Banner
      </h1>

      <div className="bg-white p-6 rounded-xl shadow">

        <input
          type="file"
          accept="image/*"
          className="border p-3 rounded w-full mb-4"
        />

        <button className="bg-orange-500 text-white px-6 py-3 rounded">
          Upload Banner
        </button>

      </div>

    </div>
  );
}