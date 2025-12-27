"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UpdateUnitsSold({
  productId,
  currentUnits,
}: {
  productId: string;
  currentUnits: number;
}) {
  const [newUnits, setNewUnits] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (newUnits <= 0) {
      alert("Enter units greater than 0");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/products/sales", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    productId,
    quantity: newUnits, // ✅ FIXED
  }),
});


    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Failed to update sales");
      return;
    }
    router.refresh();
    setNewUnits(0);
    router.refresh(); // ✅ re-fetch product & analytics
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 border-t pt-6">
      <h3 className="text-neutral-800 font-semibold mb-3">Add Units Sold</h3>

      <div className="flex items-center gap-4 ">
        <input
          type="number"
          min={1}
          value={newUnits}
          onChange={(e) => setNewUnits(Number(e.target.value))}
          className="border px-3 py-2 rounded w-32 bg-gray-200 text-neutral-900"
          placeholder="Units"
        />

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-gray-500 text-black rounded disabled:opacity-50"
        >
          {loading ? "Saving..." : "Add"}
        </button>
      </div>

      <p className="text-sm text-neutral-700 mt-2">
        Current units sold: <strong>{currentUnits}</strong>
      </p>
    </form>
  );
}
