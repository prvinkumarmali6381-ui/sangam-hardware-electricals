"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Product = {
  Product: string;
  Price: string;
  Image: string;
  Category: string;
};

// Universal Image Parser with Google Drive Auto Direct Stream
const getFormattedImageUrl = (rawUrl: string) => {
  if (!rawUrl || rawUrl.trim() === "") {
    return "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80";
  }

  const cleanUrl = rawUrl.trim().replace(/\r/g, "");

  if (cleanUrl.includes("drive.google.com") || cleanUrl.includes("lh3.googleusercontent.com")) {
    const match =
      cleanUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
      cleanUrl.match(/id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://lh3.googleusercontent.com/d/${match[1]}=w800`;
    }
    return cleanUrl;
  }

  return cleanUrl;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const localGallery = [
    "/images/gallery1.jpeg",
    "/images/gallery2.jpeg",
    "/images/gallery3.jpeg",
    "/images/gallery4.jpeg",
    "/images/hero.jpg",
    "/images/shop-front.jpeg",
    "/images/shop-inside.jpeg",
  ];

  // Pure Hardware & Electrical Tools Background Images (NO PEOPLE / HUMAN FACES)
  const banners = [
    "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1200&q=80",
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&q=80",
    "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=1200&q=80",
  ];

  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  // Safe Google TSV Sheet Fetch
  useEffect(() => {
    const parseTSVData = (text: string) => {
      const rows = text.replace(/\r/g, "").trim().split("\n");
      return rows.slice(1).map((row) => {
        const cols = row.split("\t");
        return {
          Product: cols[0]?.trim() || "",
          Price: cols[1]?.trim() || "",
          Image: cols[2]?.trim() || "",
          Category: cols[3]?.trim() || "",
        };
      });
    };

    const sheetUrl =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSCfvoj3QhqSZpO5odJ5ipsBNoU0Uh9PkiBBRvtUlFNzRbrXBnMsoxAdQBCDgx93xZFzXNiIg4jY_bH/pub?gid=0&single=true&output=tsv";

    fetch(sheetUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Direct TSV Fetch Failed");
        return res.text();
      })
      .then((text) => setProducts(parseTSVData(text)))
      .catch((err) => {
        console.warn("Direct TSV fetch blocked, fallback to proxy:", err);
        fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(sheetUrl)}`)
          .then((res) => res.text())
          .then((text) => setProducts(parseTSVData(text)))
          .catch((proxyErr) => console.error("Proxy fetch error:", proxyErr));
      });
  }, []);

  // Fetch Gallery Data
  useEffect(() => {
    fetch(
      "https://script.google.com/macros/s/AKfycbzR61KAFLt8329jqzRfjuNB8LXOxNsvLQyyUm8Q7ZWpd6348ZA9EDBAnDL8-kY5YeTBEA/exec"
    )
      .then((res) => {
        if (!res.ok) throw new Error("Network response error");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setGallery(data);
        }
      })
      .catch((err) => {
        console.warn("Drive Gallery fetch failed:", err);
        setGallery([]);
      });
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-orange-500 selection:text-white">
      {/* TOP ANNOUNCEMENT BAR */}
      <div className="bg-slate-900 text-slate-200 text-xs sm:text-sm py-2.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
          <span className="flex items-center gap-2 font-medium">
            <span className="text-orange-400">📍</span> No. 106, Nehru Bazaar, Opp. Bus Stand, Uthukottai - 602 026
          </span>
          <span className="font-semibold text-slate-100 hidden md:inline">
            📞 +91 63814 37584 | 99441 02488
          </span>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 bg-clip-text text-transparent">
              Sangam Hardware
            </span>{" "}
            <span className="text-slate-600 font-semibold hidden sm:inline">& Electricals</span>
          </h1>

          <div className="hidden md:flex gap-8 font-semibold text-slate-700">
            <a href="#" className="hover:text-orange-600 transition">Home</a>
            <a href="#products" className="hover:text-orange-600 transition">Products</a>
            <a href="#brands" className="hover:text-orange-600 transition">Brands</a>
            <a href="#gallery" className="hover:text-orange-600 transition">Gallery</a>
            <a href="#contact" className="hover:text-orange-600 transition">Contact</a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/916381437584"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-md flex items-center gap-2"
            >
              <span>💬</span> WhatsApp
            </a>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-2xl text-slate-700 focus:outline-none ml-2"
            >
              {isMobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-6 py-4 flex flex-col gap-4 font-semibold text-slate-700 shadow-lg">
            <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-orange-600">Home</a>
            <a href="#products" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-orange-600">Products</a>
            <a href="#brands" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-orange-600">Brands</a>
            <a href="#gallery" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-orange-600">Gallery</a>
            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-orange-600">Contact</a>
          </div>
        )}
      </nav>

      {/* HERO BANNER SECTION (TOOL BACKGROUND - NO HUMAN FACES) */}
      <section className="relative h-[65vh] sm:h-[75vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <Image
          src={banners[currentBanner]}
          alt="Sangam Hardware Banner"
          fill
          priority
          unoptimized={true}
          className="object-cover opacity-35 scale-105 transition-transform duration-1000"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="bg-orange-500/20 border border-orange-400/40 text-orange-300 text-xs sm:text-sm font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full inline-block mb-4 backdrop-blur-md">
            Wholesale & Retail Building Mega Store
          </span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white mb-4 leading-tight">
            Sangam Hardware <br />
            <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300 bg-clip-text text-transparent">
              & Electricals
            </span>
          </h2>
          <p className="text-lg sm:text-2xl text-slate-200 font-light max-w-2xl mx-auto mb-8">
            Hardware • Electrical • Paints • Plumbing
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="tel:+916381437584"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-xl font-bold transition shadow-xl text-center"
            >
              📞 Call Store Now
            </a>

            <a
              href="https://wa.me/916381437584"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-bold transition shadow-xl text-center"
            >
              💬 Instant WhatsApp Order
            </a>
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section id="products" className="py-16 sm:py-24 bg-slate-100 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-3 tracking-tight">
              Featured Products
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Explore authentic hardware, electrical, and paint materials from top brands
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-4 mb-12 bg-white p-3 rounded-2xl border border-slate-200 shadow-md">
            <input
              type="text"
              placeholder="🔍 Search Products by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 flex-1 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold transition cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Hardware">Hardware</option>
              <option value="Electrical">Electrical</option>
              <option value="Paints">Paints</option>
              <option value="Plumbing">Plumbing</option>
            </select>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products
              .filter((item) => {
                const matchSearch = item.Product?.toLowerCase().includes(search.toLowerCase());
                const matchCategory =
                  category === "All" ||
                  item.Category?.trim().toLowerCase() === category.trim().toLowerCase();

                return matchSearch && matchCategory;
              })
              .map((item, index) => {
                const displayImageUrl = getFormattedImageUrl(item.Image);

                return (
                  <div
                    key={index}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-orange-300 transition-all duration-300 group"
                  >
                    <div className="relative h-64 w-full bg-slate-50 overflow-hidden flex items-center justify-center p-4 border-b border-slate-100">
                      <img
                        src={displayImageUrl}
                        alt={item.Product}
                        loading="eager"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain cursor-pointer group-hover:scale-105 transition-transform duration-500"
                        onClick={() => setSelectedImage(displayImageUrl)}
                        onError={(e: any) => {
                          e.target.onerror = null;
                          if (item.Image && item.Image.startsWith("http")) {
                            e.target.src = `https://images.weserv.nl/?url=${encodeURIComponent(
                              item.Image
                            )}&w=600&output=jpg`;
                          } else {
                            e.target.src =
                              "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80";
                          }
                        }}
                      />
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-3">
                          <h3 className="text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-orange-600 transition">
                            {item.Product}
                          </h3>
                          <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                            {item.Category || "Hardware"}
                          </span>
                        </div>
                        <p className="text-orange-600 font-black text-2xl mb-6">₹ {item.Price}</p>
                      </div>

                      <a
                        href={`https://wa.me/916381437584?text=Hello, mujhe ${encodeURIComponent(
                          item.Product
                        )} ke baare me jankari chahiye.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-center py-3 rounded-xl font-bold text-sm transition shadow-md flex items-center justify-center gap-2"
                      >
                        💬 Enquire on WhatsApp
                      </a>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* BRANDS SECTION */}
      <section id="brands" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-10 text-slate-900">
            Top Authorized Brands We Offer
          </h2>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {["Asian Paints", "Havells", "Finolex", "Crompton", "Orbit", "Legrand"].map(
              (brand) => (
                <div
                  key={brand}
                  className="px-8 py-4 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm font-bold text-base sm:text-lg text-slate-800 hover:border-orange-500 hover:text-orange-600 transition cursor-default"
                >
                  {brand}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section id="gallery" className="py-16 sm:py-24 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-3">
              Store & Product Gallery
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Click on any picture to view in high resolution
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {localGallery.map((img, index) => (
              <div
                key={`local-${index}`}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white aspect-square hover:shadow-lg transition duration-300"
              >
                <img
                  src={img}
                  alt={`Gallery Local ${index + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition duration-500"
                  onClick={() => setSelectedImage(img)}
                  onError={(e: any) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80";
                  }}
                />
              </div>
            ))}

            {gallery.map((img: any, index: number) => {
              const galleryUrl = getFormattedImageUrl(img.url);

              return (
                <div
                  key={`drive-${index}`}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white aspect-square hover:shadow-lg transition duration-300"
                >
                  <img
                    src={galleryUrl}
                    alt={img.name || `Gallery Drive ${index + 1}`}
                    loading="eager"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition duration-500"
                    onClick={() => setSelectedImage(galleryUrl)}
                    onError={(e: any) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80";
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-16 sm:py-24 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-5xl font-black mb-6">Contact & Store Location</h2>

          <p className="text-lg sm:text-xl text-slate-300 mb-2">📍 Sangam Hardware & Electricals</p>
          <p className="text-base text-slate-400 mb-2">🕘 Open All Days: 9:00 AM – 9:00 PM</p>
          <p className="text-xl font-bold text-amber-400 mb-8">📞 +91 63814 37584, 99441 02488</p>

          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="tel:+916381437584"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-xl font-bold transition shadow-lg"
            >
              📞 Call Store
            </a>

            <a
              href="https://wa.me/916381437584"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-bold transition shadow-lg"
            >
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* MAP SECTION */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-8">
            Find Us on Google Maps
          </h2>

          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xl mb-6">
            <iframe
              src="https://www.google.com/maps?q=Sangam+Hardware+%26+Electricals&output=embed"
              width="100%"
              height="400"
              loading="lazy"
              className="border-0"
            ></iframe>
          </div>

          <a
            href="https://maps.app.goo.gl/ybjXnehZWDX2ogw67"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 py-3.5 rounded-xl shadow-md transition"
          >
            ⭐ View Store Reviews on Google
          </a>
        </div>
      </section>

      {/* FULLSCREEN IMAGE MODAL PREVIEW */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Product Preview"
            referrerPolicy="no-referrer"
            className="max-w-full max-h-[90vh] rounded-xl object-contain shadow-2xl"
          />

          <button
            className="absolute top-5 right-5 text-white text-3xl font-bold bg-slate-800/80 hover:bg-slate-700 w-12 h-12 rounded-full flex items-center justify-center transition"
            onClick={() => setSelectedImage(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* FLOATING ACTION BUTTONS */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        <a
          href="https://wa.me/916381437584"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-2xl transition flex items-center justify-center text-xl"
        >
          💬
        </a>

        <a
          href="tel:+916381437584"
          className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-2xl transition flex items-center justify-center text-xl"
        >
          📞
        </a>
      </div>
    </main>
  );
}