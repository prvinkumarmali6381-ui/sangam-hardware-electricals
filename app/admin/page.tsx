"use client";

import { useState } from "react";

export default function AdminPage() {
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("hardware");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Aapka Updated Google Apps Script Deployment URL
  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzOH-l4pi_G9CoqiZ7Ah9LkyGP_LP9ob_PyTArLcNIv1DmC9UVC2v2gxUw8IJkETNXFUA/exec";

  // Mobile Image Selection & Instant Local Preview Logic
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Handler Function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product || !price || !imagePreview) {
      alert("Kripya Product Name, Price aur Photo sabhi details fill karein!");
      return;
    }

    setLoading(true);

    try {
      // Direct Base64 POST Request to Google Apps Script
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          product: product,
          price: price,
          category: category,
          image: imagePreview,
        }),
      });

      const resData = await response.json();

      if (resData.success) {
        alert("✅ Product Successfully Google Drive & Sheet me Save ho gaya!");
        setProduct("");
        setPrice("");
        setImageFile(null);
        setImagePreview(null);
      } else {
        alert("❌ Upload Failed: " + (resData.error || "Unknown Error"));
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("❌ Network Error! Please check internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-8 flex items-center justify-center">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-200">
        <h1 className="text-2xl font-extrabold text-center text-gray-800 mb-6">
          Sangam Admin Panel
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              placeholder="e.g. Tek wood door 80x36"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-orange-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Price (₹)
            </label>
            <input
              type="number"
              placeholder="e.g. 16000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-orange-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-orange-500 outline-none bg-white font-medium"
            >
              <option value="hardware">Hardware</option>
              <option value="electrical">Electrical</option>
              <option value="plumbing">Plumbing</option>
              <option value="paints">Paints</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
              required
            />
          </div>

          {/* INSTANT PRODUCT PREVIEW BEFORE SAVE */}
          {imagePreview && (
            <div className="mt-4 border-2 border-dashed border-orange-300 rounded-xl p-2 bg-orange-50/50 flex flex-col items-center">
              <span className="text-xs font-bold text-orange-600 mb-2">
                📸 Photo Selected Preview
              </span>
              <img
                src={imagePreview}
                alt="Product Preview"
                className="h-44 w-full object-cover rounded-lg shadow-sm"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow-md transition disabled:opacity-50 mt-4"
          >
            {loading ? "⏳ Uploading to Google Drive..." : "🚀 Save Product"}
          </button>
        </form>
      </div>
    </main>
  );
}