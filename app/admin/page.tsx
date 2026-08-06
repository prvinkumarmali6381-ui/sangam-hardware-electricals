"use client";

import { useEffect, useState } from "react";

type ProductItem = {
  row: number;
  product: string;
  price: string;
  image: string;
  category: string;
};

export default function AdminPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("hardware");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzMcklfjEA2lBgJkHpH9psnRuNMUhOM3KtnpUD6WsbFXCzdAb84ZMu70E-X7pWTz8EwlA/exec";

  // Google Sheet Se Products List Fetch Karein
  const fetchProducts = async () => {
    try {
      const res = await fetch(SCRIPT_URL);
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (err) {
      console.error("Sheet Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Image Selection Handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Submit Handler (Add / Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !price) {
      alert("Product Name aur Price bharein!");
      return;
    }

    setLoading(true);

    const payload = {
      action: editingRow ? "edit" : "add",
      row: editingRow,
      product,
      price,
      category,
      image: imagePreview || "",
    };

    try {
      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
      const resData = await res.json();

      if (resData.success) {
        alert(editingRow ? "✅ Product Update Ho Gaya!" : "✅ Naya Product Save Ho Gaya!");
        resetForm();
        fetchProducts();
      } else {
        alert("❌ Error: " + (resData.error || "Unknown Error"));
      }
    } catch (err) {
      alert("❌ Network Error!");
    } finally {
      setLoading(false);
    }
  };

  // Delete Handler
  const handleDelete = async (row: number) => {
    if (!confirm("Kya aap is product ko delete karna chahte hain?")) return;

    setLoading(true);
    try {
      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "delete", row }),
      });
      const resData = await res.json();

      if (resData.success) {
        alert("🗑️ Product Delete Ho Gaya!");
        fetchProducts();
      }
    } catch (err) {
      alert("❌ Delete Error!");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (item: ProductItem) => {
    setEditingRow(item.row);
    setProduct(item.product);
    setPrice(item.price);
    setCategory(item.category || "hardware");
    setImagePreview(item.image || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingRow(null);
    setProduct("");
    setPrice("");
    setCategory("hardware");
    setImagePreview(null);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-8 max-w-4xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
          Sangam Admin Panel
        </h1>
      </div>

      {/* FORM: ADD & EDIT */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-lg font-bold mb-4 text-gray-800">
          {editingRow ? "✏️ Edit Product Details" : "🚀 Add New Product"}
        </h2>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            />
          </div>

          {imagePreview && (
            <div className="mt-4 border-2 border-dashed border-orange-300 rounded-xl p-2 bg-orange-50/50 flex flex-col items-center">
              <span className="text-xs font-bold text-orange-600 mb-2">
                📸 Photo Selected Preview
              </span>
              <img
                src={imagePreview}
                alt="Product Preview"
                className="h-44 object-cover rounded-lg shadow-sm"
              />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow-md transition disabled:opacity-50"
            >
              {loading
                ? "⏳ Processing..."
                : editingRow
                ? "✏️ Update Product"
                : "🚀 Save Product"}
            </button>

            {editingRow && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-5 py-3 rounded-xl transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* GOOGLE SHEET PRODUCTS DATA LIST */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-lg font-bold mb-4 text-gray-800">
          All Google Sheet Products ({products.length})
        </h2>

        <div className="space-y-3">
          {products.length === 0 ? (
            <p className="text-gray-500 text-center py-4 font-medium">
              Google Sheet se data load ho raha hai...
            </p>
          ) : (
            products.map((item) => (
              <div
                key={item.row}
                className="flex items-center justify-between p-3.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.product}
                      className="w-14 h-14 object-cover rounded-lg border bg-gray-100"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-semibold text-gray-400 border">
                      No Pic
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-gray-800 text-base">
                      {item.product}
                    </h3>
                    <p className="text-sm text-orange-600 font-bold">
                      ₹ {item.price}{" "}
                      <span className="text-xs text-gray-500 font-normal capitalize">
                        ({item.category})
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(item)}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold px-3.5 py-2 rounded-lg text-xs transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.row)}
                    className="bg-red-100 hover:bg-red-200 text-red-700 font-bold px-3.5 py-2 rounded-lg text-xs transition"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}