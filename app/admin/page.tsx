"use client";
console.log("Admin Page Loaded");
import { useState, useEffect } from "react";
import Link from "next/link";

type Product = {
  row: number;
  Product: string;
  Price: string;
  Image: string;
  Category: string;
};

export default function AdminPage() {
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [editRow, setEditRow] = useState<number | null>(null);
const [isEditing, setIsEditing] = useState(false);

const [imageFile, setImageFile] = useState<File | null>(null);
const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [activePage, setActivePage] = useState("dashboard");

  const loadProducts = async () => {
  const res = await fetch(
    "https://script.google.com/macros/s/AKfycbxzALbvns73sxw9yZe0y9cD1IzCahTD-V8QN4-nzl9vKDkJhcKm7ubUlCX2wmieMzuByA/exec"
  );

  const data = await res.json();

  setProducts(data);
};

useEffect(() => {
  loadProducts();
}, []);
console.log({
  action: isEditing ? "update" : "add",
  row: editRow,
});

  const saveProduct = async () => {

  let imageUrl = image;

  if (imageFile) {
    const reader = new FileReader();

    imageUrl = await new Promise<string>((resolve) => {
      reader.onload = () => {
        resolve((reader.result as string).split(",")[1]);
      };
      reader.readAsDataURL(imageFile);
    });
  }

  const res = await fetch("/api/save-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        
        action: isEditing ? "update" : "add",
row: editRow,
product,
price,
image: imageUrl,
category,
      }),
    });

    const result = await res.json();

    if (result.success) {
      alert("✅ Product Saved");

      setProduct("");
      setPrice("");
      setCategory("");
      setImage("");
      setImageFile(null);
setEditRow(null);
setIsEditing(false);

      loadProducts();
    } else {
      alert("❌ Error Saving Product");
    }
  };
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <aside className="w-64 bg-gray-900 text-white p-6">

  <h2 className="text-3xl font-bold mt-10 mb-6">
    Sangam Admin
  </h2>

<nav className="space-y-4">

  <Link
    href="/admin"
    className="block w-full text-left p-3 rounded hover:bg-gray-800"
  >
    🏠 Dashboard
  </Link>

  <Link
    href="/admin/products"
    className="block w-full text-left p-3 rounded hover:bg-gray-800"
  >
    📦 Products
  </Link>

  <Link
    href="/admin/gallery"
    className="block w-full text-left p-3 rounded hover:bg-gray-800"
  >
    🖼 Gallery
  </Link>

  <Link
    href="/admin/banner"
    className="block w-full text-left p-3 rounded hover:bg-gray-800"
  >
    🎨 Hero Banner
  </Link>

  <Link
    href="/admin/contact"
    className="block w-full text-left p-3 rounded hover:bg-gray-800"
  >
    📞 Contact
  </Link>

  <Link
    href="/admin/settings"
    className="block w-full text-left p-3 rounded hover:bg-gray-800"
  >
    ⚙️ Settings
  </Link>

  <Link
    href="/admin/profile"
    className="block w-full text-left p-3 rounded hover:bg-gray-800"
  >
    👤 Profile
  </Link>

  <Link
    href="/login"
    className="block w-full text-left p-3 rounded text-red-400 hover:bg-gray-800"
  >
    🚪 Logout
  </Link>


  </nav>

</aside>

<div className="flex-1 p-8"></div>
  <div className="bg-white p-6 rounded-xl shadow max-w-md mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          Admin Panel
        </h1>

        <input
          placeholder="Product Name"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="border p-3 rounded w-full mb-3"
        />

        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-3 rounded w-full mb-3"
        />

        <input
          placeholder="Image Link"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="border p-3 rounded w-full mb-3"
        />
        <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  }}
  className="border p-3 rounded w-full mb-3"
/>

        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-3 rounded w-full mb-3"
        />
<button
  onClick={() => {
    document.cookie = "admin=; Max-Age=0; path=/";
    localStorage.removeItem("role");
    window.location.href = "/login";
  }}
  className="bg-red-500 text-white px-4 py-2 rounded mb-4"
>
  🚪 Logout
</button>
        <button
  onClick={saveProduct}
  className="bg-orange-500 text-white w-full py-3 rounded"
>
  {isEditing ? "✏️ Update Product" : "💾 Save Product"}
</button>

      </div>

      <h2 className="text-3xl font-bold mt-10 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

  <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-xl">
    <h3 className="text-lg">📦 Total Products</h3>
    <p className="text-4xl font-bold">{products.length}</p>
  </div>

  <div className="bg-green-600 text-white p-6 rounded-2xl shadow-xl">
    <h3 className="text-lg">🏷 Categories</h3>
    <p className="text-4xl font-bold">4</p>
  </div>

  <div className="bg-orange-500 text-white p-6 rounded-2xl shadow-xl">
    <h3 className="text-lg">🖼 Gallery</h3>
    <p className="text-4xl font-bold">12</p>
  </div>

  <div className="bg-purple-600 text-white p-6 rounded-2xl shadow-xl">
    <h3 className="text-lg">👤 Admin</h3>
    <p className="text-xl font-bold">Sangam</p>
  </div>

</div>
        All Products
      </h2>

      <div className="grid md:grid-cols-3 gap-6">

        {products.map((item) => (

          <div
            key={item.row}
            className="bg-white rounded-xl shadow p-4"
          >

          {item.Image ? (
  <img
  src={item.Image}
  alt={item.Product}
  onClick={() => setSelectedImage(item.Image)}
  className="w-full h-52 object-cover rounded cursor-pointer hover:scale-105 transition"
/>
) : (
  <div className="w-full h-52 bg-gray-200 rounded flex items-center justify-center">
    No Image
  </div>
)}

            <h3 className="font-bold text-xl mt-3">
              {item.Product}
            </h3>

            <p>₹ {item.Price}</p>

            <p>{item.Category}</p>
            <div className="flex gap-2 mt-4">

              <button
  onClick={() => {
    setIsEditing(true);
    setEditRow(item.row);

    setProduct(item.Product);
    setPrice(item.Price);
    setImage(item.Image);
    setCategory(item.Category);
  }}
  className="bg-blue-500 text-white px-4 py-2 rounded w-full"
>
  ✏️ Edit
</button>

<button
  onClick={async () => {
    console.log("DELETE ITEM:", item);

    const res = await fetch("/api/save-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "delete",
        row: item.row,
      }),
    });

    const result = await res.json();

    if (result.success) {
      alert("✅ Product Deleted");
      loadProducts();
    } else {
      alert("❌ Delete Failed");
    }
  }}
  className="bg-red-500 text-white px-4 py-2 rounded w-full"
>
  🗑 Delete
</button>

            </div>

          </div>

        ))}

      </div>{selectedImage && (
  <div
    onClick={() => setSelectedImage(null)}
    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-5"
  >
    <img
      src={selectedImage}
      alt=""
      className="max-w-[95%] max-h-[95%] rounded-xl"
    />
  </div>
)}

    </main>
  );
}