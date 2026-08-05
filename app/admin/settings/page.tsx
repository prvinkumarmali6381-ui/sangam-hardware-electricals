"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [websiteName, setWebsiteName] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const saveSettings = () => {
    localStorage.setItem(
      "settings",
      JSON.stringify({
        websiteName,
        shopAddress,
        phone,
        whatsapp,
      })
    );

    alert("✅ Settings Saved Successfully");
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">⚙️ Website Settings</h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">

        <input
          type="text"
          placeholder="Website Name"
          value={websiteName}
          onChange={(e) => setWebsiteName(e.target.value)}
          className="border p-3 rounded w-full"
        />

        <input
          type="text"
          placeholder="Shop Address"
          value={shopAddress}
          onChange={(e) => setShopAddress(e.target.value)}
          className="border p-3 rounded w-full"
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-3 rounded w-full"
        />

        <input
          type="text"
          placeholder="WhatsApp Number"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          className="border p-3 rounded w-full"
        />

        <button
          onClick={saveSettings}
          className="bg-orange-500 text-white px-6 py-3 rounded"
        >
          💾 Save Settings
        </button>

      </div>
    </div>
  );
}