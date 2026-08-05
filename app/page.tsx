"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Product = {
  Product: string;
  Price: string;
  Image: string;
  Category: string;
};

// Mobile Browser Safe Universal Image Parser
const getFormattedImageUrl = (rawUrl: string) => {
  if (!rawUrl || rawUrl.trim() === "") {
    return "https://via.placeholder.com/400x300?text=Sangam+Hardware";
  }

  const cleanUrl = rawUrl.trim().replace(/\r/g, "");

  // 1. Convert Google Drive file URLs to Direct Mobile Displayable Stream
  if (cleanUrl.includes("drive.google.com") || cleanUrl.includes("lh3.googleusercontent.com")) {
    const match =
      cleanUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
      cleanUrl.match(/id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://lh3.googleusercontent.com/d/${match[1]}=w800`;
    }
    return cleanUrl;
  }

  // 2. Direct Web & Cloud CDN Images
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

  const banners = [
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80",
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80",
    "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1200&q=80",
  ];

  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  // Safe Google TSV Sheet Fetch (Direct + Proxy Dual Fallback for Mobile Web)
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

  // Fetch Gallery Data from NEW Google Apps Script
  useEffect(() => {
    fetch(
      "https://script.google.com/macros/s/AKfycbzOH-l4pi_G9CoqiZ7Ah9LkyGP_LP9ob_PyTArLcNIv1DmC9UVC2v2gxUw8IJkETNXFUA/exec"
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
    <main className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* TOP ANNOUNCEMENT BAR */}
      <div className="bg-gray-900 text-gray-200 text-xs sm:text-sm py-2 px-4 text-center sm:text-right flex justify-between sm:justify-end items-center gap-4">
        <span>📍 No. 106, Nehru Bazaar, Opp. Bus Stand, Uthukottai - 602 026</span>
        <span className="hidden md:inline">📞 +91 63814 37584 | 99441 02488</span>
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-orange-500 via-red-600 to-amber-500 bg-clip-text text-transparent tracking-tight">
            Sangam Hardware & Electricals
          </h1>

          <div className="hidden md:flex gap-8 font-semibold text-gray-700">
            <a href="#" className="hover:text-orange-500 transition">Home</a>
            <a href="#products" className="hover:text-orange-500 transition">Products</a>
            <a href="#brands" className="hover:text-orange-500 transition">Brands</a>
            <a href="#gallery" className="hover:text-orange-500 transition">Gallery</a>
            <a href="#contact" className="hover:text-orange-500 transition">Contact</a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/916381437584"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-green-700 transition shadow-sm"
            >
              WhatsApp
            </a>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-2xl text-gray-700 focus:outline-none ml-2"
            >
              {isMobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-3 font-semibold shadow-inner">
            <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-orange-500">Home</a>
            <a href="#products" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-orange-500">Products</a>
            <a href="#brands" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-orange-500">Brands</a>
            <a href="#gallery" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-orange-500">Gallery</a>
            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-orange-500">Contact</a>
          </div>
        )}
      </nav>

      {/* HERO BANNER SECTION */}
      <section className="relative h-[65vh] sm:h-[75vh] md:h-[85vh]">
        <Image
          src={banners[currentBanner]}
          alt="Sangam Hardware Banner"
          fill
          priority
          unoptimized={true}
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <span className="bg-orange-500/20 border border-orange-400 text-orange-200 text-xs sm:text-sm font-semibold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-3">
              Trusted Quality & Professional Service
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              Sangam Hardware & Electricals
            </h2>
            <p className="mt-4 text-base sm:text-xl text-gray-200">
              Hardware • Electrical • Paints • Plumbing
            </p>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="tel:+916381437584"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-xl font-bold transition shadow-lg text-center"
              >
                📞 Call Now
              </a>

              <a
                href="https://wa.me/916381437584"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3.5 rounded-xl font-bold transition shadow-lg text-center"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section id="products" className="py-12 sm:py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-2 text-gray-900">
            Our Products
          </h2>
          <p className="text-center text-gray-500 mb-6 text-sm sm:text-base">
            Explore our wide selection of store items
          </p>

          <div className="flex justify-center gap-4 mb-8">
            <a
              href="tel:+916381437584"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold shadow transition text-sm sm:text-base"
            >
              📞 Call Now
            </a>
            <a
              href="https://wa.me/916381437584"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-bold shadow transition text-sm sm:text-base"
            >
              💬 WhatsApp
            </a>
          </div>

          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-3 mb-10">
            <input
              type="text"
              placeholder="🔍 Search Products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3 flex-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white font-medium"
            >
              <option>All</option>
              <option>Hardware</option>
              <option>Electrical</option>
              <option>Paints</option>
              <option>Plumbing</option>
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
                    className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col justify-between hover:shadow-xl transition duration-300"
                  >
                    <div className="relative h-60 w-full bg-gray-100 overflow-hidden">
                      <img
                        src={displayImageUrl}
                        alt={item.Product}
                        loading="eager"
                        decoding="async"
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition duration-300"
                        onClick={() => setSelectedImage(displayImageUrl)}
                        onError={(e: any) => {
                          e.target.onerror = null;
                          // Safe Mobile Bypass Proxy Fallback
                          if (item.Image && item.Image.startsWith("http")) {
                            e.target.src = `https://images.weserv.nl/?url=${encodeURIComponent(
                              item.Image
                            )}&w=600&output=jpg`;
                          } else {
                            e.target.src =
                              "https://via.placeholder.com/400x300?text=Sangam+Hardware";
                          }
                        }}
                      />
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold text-gray-800 line-clamp-2">
                            {item.Product}
                          </h3>
                          <span className="bg-orange-50 text-orange-700 border border-orange-200 text-xs font-semibold px-2.5 py-1 rounded-full capitalize">
                            {item.Category}
                          </span>
                        </div>
                        <p className="text-orange-600 font-extrabold text-xl mb-4">₹ {item.Price}</p>
                      </div>

                      <a
                        href={`https://wa.me/916381437584?text=Hello, mujhe ${encodeURIComponent(
                          item.Product
                        )} ke baare me jankari chahiye.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-green-600 hover:bg-green-700 text-white text-center py-2.5 rounded-xl font-bold text-sm transition shadow-sm flex items-center justify-center gap-2"
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
      <section id="brands" className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-10 text-gray-900">
            Top Brands We Stock
          </h2>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {["Asian Paints", "Havells", "Finolex", "Crompton", "Orbit", "Legrand"].map(
              (brand) => (
                <div
                  key={brand}
                  className="px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm font-bold text-base sm:text-lg text-gray-800 hover:border-orange-500 hover:text-orange-600 transition cursor-default"
                >
                  {brand}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section id="gallery" className="py-12 sm:py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-2 text-gray-900">
            Our Shop Gallery
          </h2>
          <p className="text-center text-gray-500 mb-10 text-sm sm:text-base">
            Tap on any image for full-screen view
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {localGallery.map((img, index) => (
              <div
                key={`local-${index}`}
                className="overflow-hidden rounded-2xl shadow-sm bg-gray-200 aspect-square hover:shadow-lg transition duration-300"
              >
                <img
                  src={img}
                  alt={`Gallery Local ${index + 1}`}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition duration-300"
                  onClick={() => setSelectedImage(img)}
                  onError={(e: any) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/400x300?text=Gallery+Image";
                  }}
                />
              </div>
            ))}

            {gallery.map((img: any, index: number) => {
              const galleryUrl = getFormattedImageUrl(img.url);

              return (
                <div
                  key={`drive-${index}`}
                  className="overflow-hidden rounded-2xl shadow-sm bg-gray-200 aspect-square hover:shadow-lg transition duration-300"
                >
                  <img
                    src={galleryUrl}
                    alt={img.name || `Gallery Drive ${index + 1}`}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition duration-300"
                    onClick={() => setSelectedImage(galleryUrl)}
                    onError={(e: any) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/400x300?text=Gallery+Image";
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-12 sm:py-16 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">Contact Us</h2>

          <p className="text-lg sm:text-xl text-gray-300 mb-2">📍 Sangam Hardware & Electricals</p>
          <p className="text-base text-gray-400 mb-2">🕘 9:00 AM – 9:00 PM (Mon - Sun)</p>
          <p className="text-lg font-bold text-orange-400 mb-8">📞 +91 6381437584, 9944102488</p>

          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="tel:+916381437584"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition shadow-md"
            >
              📞 Call Now
            </a>

            <a
              href="https://wa.me/916381437584"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold transition shadow-md"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* GOOGLE MAPS & REVIEWS SECTION */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8">
            Store Location
          </h2>

          <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200 mb-6">
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
            className="inline-block bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold px-6 py-3 rounded-xl shadow transition"
          >
            ⭐ Read Google Reviews
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
            className="max-w-full max-h-[90vh] rounded-lg object-contain shadow-2xl"
          />

          <button
            className="absolute top-5 right-5 text-white text-3xl sm:text-4xl font-bold bg-gray-800/60 hover:bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center transition"
            onClick={() => setSelectedImage(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* FLOATING ACTION BUTTONS FOR MOBILE */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        <a
          href="https://wa.me/916381437584"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white p-3.5 rounded-full shadow-2xl transition flex items-center justify-center text-xl"
        >
          💬
        </a>

        <a
          href="tel:+916381437584"
          className="bg-orange-500 hover:bg-orange-600 text-white p-3.5 rounded-full shadow-2xl transition flex items-center justify-center text-xl"
        >
          📞
        </a>
      </div>
    </main>
  );
}