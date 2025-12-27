/* eslint-disable @next/next/no-img-element */
"use client";
const DEFAULT_IMAGE = "/profile.jpg";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import Link from "next/link";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: 0,
    stock: 0,
  });

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products?id=${id}`);
        if (!res.ok) return;

        const data = await res.json();

        setForm({
          name: data.name ?? "",
          category: data.category ?? "",
          price: data.price ?? 0,
          stock: data.stock ?? 0,
        });

        setImages(Array.isArray(data.images) ? data.images : []);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    }

    fetchProduct();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          ...form,
          images,
        }),
      });

      if (!res.ok) return;

      router.push("/products");
    } catch (err) {
      console.error(err);
    }
  }

  if (loading)
    return <p className="p-6 text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen  px-6 py-12">
      <div
  className="absolute inset-0 -z-10 h-full w-full"
  style={{
    backgroundColor: "#D1D5DB", // bg-gray-300
    backgroundImage: `
      linear-gradient(to right, rgba(0,0,0,0.08) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0,0,0,0.08) 1px, transparent 1px)
    `,
    backgroundSize: "10rem 8rem",
  }}
></div>

      <div className="mx-auto max-w-2xl bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Edit Product
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter product name"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Category
            </label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter category"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Price (₹)
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
              className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Stock Quantity
            </label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) =>
                setForm({ ...form, stock: Number(e.target.value) })
              }
              className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Product Images
            </label>
            <div className="rounded-md border border-gray-300 bg-gray-50 p-3">
              <ImageUpload value={images} onChange={setImages} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <Link
              href="/products"
              className="text-sm text-gray-500 hover:text-gray-700 transition"
            >
              ← Back to Products
            </Link>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
