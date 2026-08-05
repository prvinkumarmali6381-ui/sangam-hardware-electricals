"use client";

import { useEffect, useState } from "react";

type Product = {
  row: number;
  Product: string;
  Price: string;
  Image: string;
  Category: string;
};

export default function ProductsPage() {
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [editRow, setEditRow] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const loadProducts = async () => {
    const res = await fetch(
      "https://script.google.com/macros/s/AKfycbzF3tajI_vzm8lLPjNCoO4VmPyOvJ-JGGGw_AAro2w5CAjDWb4KRvPfCj8nEb6IHORyLA/exec"
    );

    const data = await res.json();
    console.log(products);
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);
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
    setImage("");
    setCategory("");

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

  <h1 className="text-4xl font-bold mb-8">
    📦 Products Management
  </h1>

  <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg">

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
  onClick={saveProduct}
  className="bg-orange-500 text-white w-full py-3 rounded-lg"
>
  {isEditing ? "✏️ Update Product" : "💾 Save Product"}
</button>

<div className="mt-10"></div>

  <h2 className="text-3xl font-bold mb-6">
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
    className="w-full h-52 object-cover rounded cursor-pointer"
    onClick={() => setSelectedImage(item.Image)}
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

  </div>

</div>

{selectedImage && (
  <div
    onClick={() => setSelectedImage(null)}
    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
  >
    <img
      src={selectedImage}
      className="max-w-[95%] max-h-[95%] rounded-xl"
      alt=""
    />
  </div>
)}

    </main>
  );
}