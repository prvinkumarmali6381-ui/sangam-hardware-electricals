"use client";
import { useState, useEffect } from "react";

// Google Apps Script Deploy URL yahan paste karein
const SCRIPT_URL = "AAPKA_NEW_GOOGLE_APPS_SCRIPT_WEB_APP_URL";

export default function PremiumAdminDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Hardware");
  const [imageBase64, setImageBase64] = useState("");
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Categories Array
  const categoriesList = ["Hardware", "Electrical", "Paints", "Plumbing"];

  // Sheet Data Fetch
  const fetchProducts = async () => {
    setFetching(true);
    try {
      const res = await fetch(SCRIPT_URL);
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (err) {
      console.error("Data Fetch Error:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Image Processing & Compression
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 600;
          const scaleFactor = MAX_WIDTH / img.width;
          canvas.width = img.width > MAX_WIDTH ? MAX_WIDTH : img.width;
          canvas.height = img.width > MAX_WIDTH ? img.height * scaleFactor : img.height;

          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.75);
          setImageBase64(compressedBase64);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = editingRow
      ? { action: "edit", row: editingRow, product: productName, price, category, image: imageBase64 }
      : { action: "add", product: productName, price, category, image: imageBase64 };

    try {
      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        alert(editingRow ? "✨ Product Updated!" : "🎉 Product Saved & Photo URL Created!");
        resetForm();
        fetchProducts();
      } else {
        alert("❌ Error: " + data.error);
      }
    } catch (err) {
      alert("❌ Upload Failed! Check SCRIPT_URL or Internet Connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditingRow(item.row);
    setProductName(item.product);
    setPrice(item.price);
    setCategory(item.category || "Hardware");
    setImageBase64(item.image || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (row: number) => {
    if (!confirm("Is product ko delete karna chahte hain?")) return;
    setLoading(true);
    try {
      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "delete", row }),
      });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
      }
    } catch (err) {
      alert("Delete Error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingRow(null);
    setProductName("");
    setPrice("");
    setCategory("Hardware");
    setImageBase64("");
  };
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzMcklfjEA2lBgJkHpH9psnRuNMUhOM3KtnpUD6WsbFXCzdAb84ZMu70E-X7pWTz8EwlA/exec";

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#f8fafc", padding: "30px 20px", fontFamily: "system-ui" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "700", background: "linear-gradient(to right, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Sangam Hardware Pro Admin
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "14px", marginTop: "4px" }}>Manage Cloud Products & Google Sheet Sync</p>
          </div>
          <button onClick={fetchProducts} style={{ background: "#1e293b", border: "1px solid #334155", color: "#e2e8f0", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}>
            🔄 Sync Data
          </button>
        </div>

        {/* Form Card */}
        <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "16px", padding: "24px", marginBottom: "40px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#38bdf8", marginBottom: "20px" }}>
            {editingRow ? "✏️ Edit Product Entry" : "➕ Add New Cloud Product"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "6px" }}>Product Name</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Table Fan Crompton"
                  required
                  style={{ width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "10px", color: "#fff" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "6px" }}>Price (₹)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="3450"
                  required
                  style={{ width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "10px", color: "#fff" }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "6px" }}>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "10px", color: "#fff" }}
                >
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "6px" }}>Upload Computer Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "7px", color: "#cbd5e1", fontSize: "13px" }}
                />
              </div>
            </div>

            {/* Photo Preview */}
            {imageBase64 && (
              <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "15px", background: "#0f172a", padding: "12px", borderRadius: "10px", border: "1px dashed #38bdf8" }}>
                <img src={imageBase64} alt="Preview" style={{ width: "60px", height: "60px", objectFit: "contain", borderRadius: "6px" }} />
                <span style={{ fontSize: "13px", color: "#38bdf8" }}>✓ Image Ready for Upload</span>
              </div>
            )}

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: "linear-gradient(to right, #0284c7, #2563eb)",
                  color: "#fff",
                  border: "none",
                  padding: "10px 24px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                {loading ? "⏳ Uploading & Saving URL..." : editingRow ? "Update Product" : "Save Product"}
              </button>

              {editingRow && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{ background: "#334155", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Product Grid */}
        <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px", color: "#e2e8f0" }}>
          Live Google Sheet Products ({products.length})
        </h3>

        {fetching ? (
          <p style={{ color: "#94a3b8" }}>Loading live products...</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
            {products.map((item) => (
              <div key={item.row} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
                <div style={{ height: "140px", background: "#0f172a", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px", padding: "8px" }}>
                  <img
                    src={item.image || "https://via.placeholder.com/150"}
                    alt={item.product}
                    style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                  />
                </div>
                <h4 style={{ fontSize: "15px", fontWeight: "600", margin: "0 0 6px 0", color: "#f8fafc" }}>{item.product}</h4>
                <p style={{ fontSize: "16px", fontWeight: "700", color: "#38bdf8", margin: "0 0 4px 0" }}>₹{item.price}</p>
                <span style={{ fontSize: "11px", background: "#0f172a", color: "#94a3b8", padding: "3px 8px", borderRadius: "12px" }}>{item.category}</span>

                <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
                  <button onClick={() => handleEdit(item)} style={{ flex: 1, background: "#0284c7", color: "#fff", border: "none", padding: "6px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.row)} style={{ flex: 1, background: "#ef4444", color: "#fff", border: "none", padding: "6px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}