"use client";

export default function ContactPage() {
  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        📞 Contact Details
      </h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">

        <input
          placeholder="Phone Number"
          className="border p-3 rounded w-full"
        />

        <input
          placeholder="WhatsApp Number"
          className="border p-3 rounded w-full"
        />

        <input
          placeholder="Address"
          className="border p-3 rounded w-full"
        />

        <button className="bg-orange-500 text-white px-6 py-3 rounded">
          Save Contact
        </button>

      </div>

    </div>
  );
}