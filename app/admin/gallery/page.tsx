"use client";

import { useEffect, useState } from "react";

// Mobile Safe Google Drive Image Formatter
const getFormattedImageUrl = (rawUrl: string) => {
  if (!rawUrl || rawUrl.trim() === "") return "";
  const cleanUrl = rawUrl.trim().replace(/\r/g, "");

  if (cleanUrl.includes("drive.google.com") || cleanUrl.includes("lh3.googleusercontent.com")) {
    const match =
      cleanUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
      cleanUrl.match(/id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://lh3.googleusercontent.com/d/${match[1]}=w1000`;
    }
  }
  return cleanUrl;
};

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  // Naya Updated Apps Script Deployment URL
  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzR61KAFLt8329jqzRfjuNB8LXOxNsvLQyyUm8Q7ZWpd6348ZA9EDBAnDL8-kY5YeTBEA/exec";

  useEffect(() => {
    fetch(SCRIPT_URL)
      .then((res) => res.json())
      .then((data) => {
        console.log("Gallery Data:", data);
        if (Array.isArray(data)) {
          setImages(data);
        }
      })
      .catch((err) => console.error("Gallery Fetch Error:", err));
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-8">
        Sangam Gallery
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        {images.map((img, index) => {
          const displayUrl = getFormattedImageUrl(img.url);

          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition"
              onClick={() => setSelected(displayUrl)}
            >
              <img
                src={displayUrl}
                alt={img.name || `Gallery Photo ${index + 1}`}
                className="w-full h-48 sm:h-52 object-cover rounded-t-xl"
                loading="lazy"
                decoding="async"
                onError={(e: any) => {
                  e.target.onerror = null;
                  // Mobile CORS Bypass Fallback Proxy
                  if (img.url && img.url.startsWith("http")) {
                    e.target.src = `https://images.weserv.nl/?url=${encodeURIComponent(
                      img.url
                    )}&w=800&output=jpg`;
                  } else {
                    e.target.src =
                      "https://via.placeholder.com/400x300?text=Sangam+Gallery";
                  }
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Fullscreen Preview Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <img
            src={selected}
            alt="Enlarged View"
            className="max-w-[95%] max-h-[90vh] rounded-xl object-contain shadow-2xl"
          />

          <button
            className="absolute top-5 right-5 text-white text-3xl font-bold bg-gray-800/60 hover:bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center transition"
            onClick={() => setSelected(null)}
          >
            ✕
          </button>
        </div>
      )}
    </main>
  );
}