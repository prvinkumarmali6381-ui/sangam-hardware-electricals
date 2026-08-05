"use client";

import { useEffect, useState } from "react";

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://script.google.com/macros/s/AKfycbzR61KAFLt8329jqzRfjuNB8LXOxNsvLQyyUm8Q7ZWpd6348ZA9EDBAnDL8-kY5YeTBEA/exec")
      .then((res) => res.json())
      .then((data) => {
  console.log(data);
  setImages(data);
})
      .catch(console.error);
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center mb-8">
        Sangam Gallery
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {images.map((img, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
            onClick={() => setSelected(img.url)}
          >
            <img
  src={img.url}
  alt={img.name}
  className="w-full h-52 object-cover rounded-lg border"
  loading="lazy"
  referrerPolicy="no-referrer"
  onError={() => console.log("Image Error:", img.url)}
/>
          </div>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setSelected(null)}
        >
          <img
            src={selected}
            className="max-w-[95%] max-h-[95%] rounded-xl"
          />
        </div>
      )}
    </main>
  );
}