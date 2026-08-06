"use client";
import { useState, useEffect } from "react";

// Google Apps Script Deploy Web App URL yahan replace karein
const SCRIPT_URL = "AAPKA_NEW_GOOGLE_APPS_SCRIPT_WEB_APP_URL";

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Hardware");
  const [imageBase64, setImageBase64] = useState("");
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // 1. Google Sheet se Products Fetch Karein
  const fetchProducts = async () => {
    try {
      const res = await fetch(SCRIPT_URL);
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Computer se photo select karke Base64 string banana
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 3. Product Add / Edit Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = editingRow
      ? {
          action: "edit",
          row: editingRow,
          product: productName,
          price: price,
          category: category,
          image: imageBase64,
        }
      : {
          action: "add",
          product: productName,
          price: price,
          category: category,
          image: imageBase64,
        };

    try {
      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        alert(editingRow ? "✅ Product Updated Successfully!" : "✅ Product Saved to Google Sheet!");
        resetForm();
        fetchProducts();
      } else {
        alert("❌ Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Operation Failed");
    } finally {
      setLoading(false);
    }
  };

  // 4. Product Edit Trigger
  const handleEdit = (item: any) => {
    setEditingRow(item.row);
    setProductName(item.product);
    setPrice(item.price);
    setCategory(item.category || "Hardware");
    setImageBase64(item.image || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 5. Product Delete Handler
  const handleDelete = async (row: number) => {
    if (!confirm("Kya aap is product ko delete karna chahte hain?")) return;
    setLoading(true);

    try {
      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({ action: "delete", row: row }),
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Product Deleted!");
        fetchProducts();
      }
    } catch (err) {
      alert("❌ Delete Failed");
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

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Sangam Hardware - Product Admin Panel</h2>

      {/* Product Form */}
      <div style={{ background: "#f8f9fa", padding: "20px", borderRadius: "10px", marginBottom: "30px" }}>
        <h3>{editingRow ? "✏️ Edit Product Details" : "➕ Add New Product"}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <label>Product Name: </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>

          <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
            <div style={{ flex: 1 }}>
              <label>Price (₹): </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Category: </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              >
                <option value="Hardware">Hardware</option>
                <option value="Electrical">Electrical</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Computer se Photo Select Karein: </label>
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginTop: "5px" }} />
          </div>

          {imageBase64 && (
            <div style={{ marginBottom: "15px" }}>
              <p>Selected Photo Preview:</p>
              <img src={imageBase64} alt="Preview" style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "8px" }} />
            </div>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px 20px",
                background: editingRow ? "#28a745" : "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {loading ? "⏳ Processing..." : editingRow ? "Update Product" : "Save Product"}
            </button>
            {editingRow && (
              <button
                type="button"
                onClick={resetForm}
                style={{ padding: "10px 20px", background: "#6c757d", color: "#fff", border: "none", borderRadius: "5px" }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Google Sheet Products Display Table/Grid */}
      <h3>All Google Sheet Products ({products.length})</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
        {products.map((item) => (
          <div key={item.row} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "15px", textAlign: "center", background: "#fff" }}>
            <img
              src={item.image || "https://via.placeholder.com/150"}
              alt={item.product}
              style={{ width: "100%", height: "140px", objectFit: "contain", marginBottom: "10px" }}
            />
            <h4 style={{ margin: "5px 0" }}>{item.product}</h4>
            <p style={{ margin: "5px 0", color: "#28a745", fontWeight: "bold" }}>₹{item.price}</p>
            <p style={{ margin: "5px 0", fontSize: "12px", color: "#6c757d" }}>Category: {item.category}</p>

            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "10px" }}>
              <button onClick={() => handleEdit(item)} style={{ padding: "5px 10px", background: "#ffc107", border: "none", borderRadius: "4px" }}>
                ✏️ Edit
              </button>
              <button onClick={() => handleDelete(item.row)} style={{ padding: "5px 10px", background: "#dc3545", color: "#fff", border: "none", borderRadius: "4px" }}>
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}