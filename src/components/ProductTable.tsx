/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  unitsSold?: number;
  images?: string[];
  updatedAt: string;
}

type SortOption =
  | ""
  | "price-asc"
  | "price-desc"
  | "stock-asc"
  | "stock-desc"
  | "sold-desc";

export default function ProductTable({ products }: { products: Product[] }) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortOption>("");

  async function handleDelete(e: React.MouseEvent, productId: string) {
    e.stopPropagation();

    const confirmed = confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    const res = await fetch(`/api/products?id=${productId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Failed to delete product");
      return;
    }

    router.refresh();
  }

  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category)));
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "all") {
      result = result.filter((p) => p.category === category);
    }

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "stock-asc":
        result.sort((a, b) => a.stock - b.stock);
        break;
      case "stock-desc":
        result.sort((a, b) => b.stock - a.stock);
        break;
      case "sold-desc":
        result.sort((a, b) => (b.unitsSold ?? 0) - (a.unitsSold ?? 0));
        break;
    }

    return result;
  }, [products, search, category, sort]);

  return (
    <div className="bg-neutral-100 border border-zinc-400 p-6 rounded-xl shadow-sm">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-300 border border-zinc-500 text-neutral-900 placeholder:text-neutral-900 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-600"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-gray-400 border border-zinc-600 text-neutral-800 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-600"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="bg-gray-400 border border-zinc-600 text-neutral-800 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-600"
        >
          <option value="">Sort By</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
          <option value="stock-desc">Stock ↓</option>
          <option value="sold-desc">Units Sold ↓</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-zinc-500">
        <table className="w-full bg-gray-200">
          <thead className="bg-gray-400">
            <tr>
              <th className="p-3 text-left text-sm font-bold text-neutral-900">
                Product
              </th>
              <th className="p-3 text-sm font-bold text-neutral-900">
                Price
              </th>
              <th className="p-3 text-sm font-bold  text-neutral-900">
                Stock
              </th>
              <th className="p-3 text-sm font-bold text-neutral-900">
                Units Sold
              </th>
              <th className="p-3 text-sm font-bold text-neutral-900">
                Revenue
              </th>
              <th className="p-3 text-sm font-bold text-neutral-900">
                Last Updated
              </th>
              <th className="p-3"></th>
            </tr>
          </thead>
          
          <tbody>
            {filteredProducts.map((product) => {
              const revenue = (product.unitsSold ?? 0) * product.price;
              
              return (
                <tr
                  key={product._id}
                  onClick={() => {
                    console.log("CLICK ID →", product._id, typeof product._id);
                    router.push(`/products/${product._id}`)}}

                  className="border-b border-zinc-700 hover:bg-zinc-400/60 transition cursor-pointer"
                >

                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={product.images?.[0] || "/profile.jpg"}
                      className="w-12 h-12 object-cover rounded-md border border-zinc-500"
                      alt={product.name}
                    />
                    <div>
                      <p className="font-medium text-neutral-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-neutral-600">
                        {product.category}
                      </p>
                    </div>
                  </td>

                  <td className="p-3 text-center text-neutral-800">
                    ₹{product.price}
                  </td>
                  <td className="p-3 text-center text-neutral-800">
                    {product.stock}
                  </td>
                  <td className="p-3 text-center text-neutral-800">
                    {product.unitsSold ?? 0}
                  </td>
                  <td className="p-3 text-center text-neutral-800">
                    ₹{revenue.toLocaleString("en-IN")}
                  </td>
                  <td className="p-3 text-center text-sm text-neutral-700">
                    {new Date(product.updatedAt).toLocaleDateString("en-IN")}
                  </td>

                  {/* Actions */}
                  <td
                    className="p-3 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() =>
                          router.push(`/products/edit/${product._id}`)
                        }
                        className="px-3 py-1 text-sm bg-slate-400 text-neutral-900 rounded-md hover:bg-slate-200 transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={(e) => handleDelete(e, product._id)}
                        className="px-3 py-1 text-sm bg-red-700 text-neutral-200 rounded-md hover:bg-zinc-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>

  );

}
