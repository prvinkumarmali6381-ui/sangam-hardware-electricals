"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Product = {
  Product: string;
  Price: string;
  Image: string;
  Category: string;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
const [category, setCategory] = useState("All");

const banners = [
  "/images/hero.jpg",
  "/images/hardware.jpg",
  "/images/electrical.jpg",
  "/images/paints.jpg",
];

const [currentBanner, setCurrentBanner] = useState(0);
useEffect(() => {
  const timer = setInterval(() => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  }, 5000);

  return () => clearInterval(timer);
}, []);

useEffect(() => {
  fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vSCfvoj3QhqSZpO5odJ5ipsBNoU0Uh9PkiBBRvtUlFNzRbrXBnMsoxAdQBCDgx93xZFzXNiIg4jY_bH/pub?gid=0&single=true&output=tsv")
    .then((res) => res.text())
    .then((text) => {
      const rows = text.trim().split("\n");

      const data = rows.slice(1).map((row) => {
  const [Product, Price, Image, Category] = row.split("\t");

  return {
    Product: Product.trim(),
    Price: Price.trim(),
    Image: Image.trim(),
    Category: Category.trim(),
  };
});

console.log(data[0]);

setProducts(data);
    });
}, []);

  return (
    <main className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white shadow-md">
  <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
    <h1 className="text-2xl font-bold text-orange-600">
      Sangam Hardware electricals
    </h1>

    <div className="hidden md:flex gap-8 font-semibold">
      <a href="#" className="hover:text-orange-500">Home</a>
      <a href="#products" className="hover:text-orange-500">Products</a>
      <a href="#brands" className="hover:text-orange-500">Brands</a>
      <a href="#contact" className="hover:text-orange-500">Contact</a>
    </div>

    <a
      href="https://wa.me/916381437584"
      target="_blank"
      className="bg-green-500 text-white px-5 py-2 rounded-lg font-bold"
    >
      WhatsApp
    </a>
  </div>
</nav>

      <section className="relative h-screen">
        <Image
  src="/images/hero.jpg"
  alt="Sangam Hardware"
  fill
  priority
  className="object-cover"
/><h1 className="text-3xl md:text-6xl font-bold text-center">
  Sangam Hardware & Electricals
</h1>

        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white px-4">
            

            <p className="mt-5 text-xl">
              Hardware • Electrical • Paints • Plumbing
            </p>

            <div className="mt-8 flex flex-col md:flex-row justify-center gap-4">
              <a
                href="tel:+916381437584"
                className="bg-orange-500 px-8 py-4 rounded-xl font-bold"
              >
                📞 Call Now
              </a>

              <a
                href="https://wa.me/916381437584"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 px-8 py-4 rounded-xl font-bold"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        <section id="products" className="py-16 bg-gray-100"></section>
        <h2 className="text-4xl font-bold text-center mb-10">
          Our Products
        </h2>
        <div className="flex flex-col md:flex-row gap-4 mb-8 px-6">

  <input
    type="text"
    placeholder="🔍 Search Products..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="border rounded-lg px-4 py-3 flex-1"
  />

  <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    className="border rounded-lg px-4 py-3"
  >
    <option>All</option>
    <option>Hardware</option>
    <option>Electrical</option>
    <option>Paints</option>
    <option>Plumbing</option>
  </select>

</div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-6">
    {products
  .filter((item) => {
    const matchSearch =
      item.Product
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchCategory =
      category === "All" ||
      item.Category?.trim().toLowerCase() ===
        category.trim().toLowerCase();

    return matchSearch && matchCategory;
  })

  .map((item, index) => (
      <div
        key={index}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <img
  src={item.Image}
  alt={item.Product}
  className="w-full h-56 md:h-64 object-cover cursor-pointer hover:scale-105 transition duration-300"
  onClick={() => setSelectedImage(item.Image)}
/>

        <div className="p-5">
          <h3 className="text-xl font-bold">{item.Product}</h3>
          <p className="text-orange-600 font-bold">₹ {item.Price}</p>
          <p className="text-gray-500">{item.Category}</p>
          <a
  href={`https://wa.me/916381437584?text=Hello, mujhe ${item.Product} ke baare me jankari chahiye.`}
  target="_blank"
  rel="noopener noreferrer"
  className="mt-4 block bg-green-600 hover:bg-green-700 text-white text-center py-2 rounded-lg font-semibold transition"
>
  💬 Enquire on WhatsApp
</a>
        </div>
      </div>
    ))}
  </div>
</section>

    <section className="py-16 bg-white">
      <section id="brands" className="py-16 bg-white"></section>
  <h2 className="text-4xl font-bold text-center mb-10">
    Our Brands
  </h2>

  <div className="flex flex-wrap justify-center gap-6">
    {[
      "Asian Paints",
      "Havells",
      "Finolex",
      "Crompton",
      "Orbit",
      "Legrent"
    ].map((brand) => (
      <div
        key={brand}
        className="px-8 py-5 bg-orange-100 rounded-xl shadow font-bold text-lg"
      >
        {brand}
      </div>
    ))}
  </div>
</section>
  <section className="py-16 bg-gray-100">
  <h2 className="text-4xl font-bold text-center mb-10">
    Our Gallery
  </h2>

  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 md:px-6">
    {[
      
  "/images/gallery1.jpeg",
   "/images/gallery2.jpeg",
  "/images/gallery3.jpeg",
  "/images/gallery4.jpeg",

  "/images/hero.jpg",
  "/images/shop-front.jpeg",
  "/images/shop-inside.jpeg",

    ].map((img, index) => (
      <div
        key={index}
        className="overflow-hidden rounded-2xl shadow-lg hover:scale-105 transition duration-300"
      >
      <img
  src={img}
  alt={`Gallery ${index + 1}`}
  className="w-full h-64 object-cover cursor-pointer"
  onClick={() => setSelectedImage(img)}
/>
      </div>
    ))}
  </div>
</section>
  <section className="py-16 bg-blue-700 text-white">
    <section id="contact" className="py-16 bg-blue-700 text-white"></section>
  <div className="max-w-5xl mx-auto px-6 text-center">
    <h2 className="text-4xl font-bold mb-8">Contact Us</h2>

    <p className="text-xl mb-3">
      📍 Sangam Hardware & Electricals
    </p>

    <p className="text-lg mb-3">
      🕘 9:00 AM – 9:00 PM
    </p>

    <p className="text-lg mb-8">
      📞 +91 6381437584,9944102488
    </p>

    <div className="flex justify-center gap-4 flex-wrap">
      <a
        href="tel:+916381437584"
        className="bg-orange-500 px-6 py-3 rounded-xl font-bold"
      >
        📞 Call Now
      </a>

      <a
        href="https://wa.me/916381437584"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-600 px-6 py-3 rounded-xl font-bold"
      >
        💬 WhatsApp
      </a>
    </div>
  </div>
</section>
   <section className="py-16 bg-gray-100">
  <div className="max-w-6xl mx-auto px-6">
    <h2 className="text-4xl font-bold text-center mb-8">
      Find Us
    </h2>

    <div className="rounded-2xl overflow-hidden shadow-lg">
      <iframe
        src="https://www.google.com/maps?q=Sangam+Hardware+%26+Electricals&output=embed"
        width="100%"
        height="450"
        loading="lazy"
        className="border-0"
      ></iframe>
    </div>
  </div>
</section>
  <a
  href="https://wa.me/916381437584"
  target="_blank"
  rel="noopener noreferrer"
  className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl shadow-2xl z-50"
>
  💬
</a>
  <a
  href="https://maps.app.goo.gl/ybjXnehZWDX2ogw67"
  target="_blank"
  rel="noopener noreferrer"
  className="mt-6 inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-xl"
>
  ⭐ Read Google Reviews
</a>{selectedImage && (
  <div
    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
    onClick={() => setSelectedImage(null)}
  >
    <img
      src={selectedImage}
      alt="Product"
      className="max-w-[95%] max-h-[95%] rounded-lg"
    />

    <button
      className="absolute top-5 right-5 text-white text-4xl font-bold"
      onClick={() => setSelectedImage(null)}
    >
      ✕
    </button>
  </div>
)}
<div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">

  <a
    href="https://wa.me/916381437584"
    target="_blank"
    className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-xl transition"
  >
    💬
  </a>

  <a
    href="tel:+916381437584"
    className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-xl transition"
  >
    📞
  </a>

</div>
</main>
  );
}