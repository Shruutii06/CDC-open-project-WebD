/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useMemo, useState, useEffect } from "react";
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

const PAGE_SIZE = 5;

export default function ProductTable({ products }: { products: Product[] }) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortOption>("");
  const [page, setPage] = useState(1);

  /* ===== DELETE ===== */
  async function handleDelete(e: React.MouseEvent, productId: string) {
    e.stopPropagation();

    const confirmed = confirm("Are you sure?");
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

  /* ===== CATEGORIES ===== */
  const categories = useMemo(() => {
    return Array.from(
      new Set(products.map((p) => p.category?.trim()).filter(Boolean))
    );
  }, [products]);

  /* ===== FILTER + SORT (FULL DATASET) ===== */
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      result = result.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "all") {
      result = result.filter((p) => p.category?.trim() === category);
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

  /* ===== RESET PAGE ON FILTER CHANGE ===== */
  useEffect(() => {
    setPage(1);
  }, [search, category, sort]);

  /* ===== PAGINATION ===== */
  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="bg-neutral-100 border border-zinc-400 p-6 rounded-xl shadow-sm">
      {/* ===== Controls ===== */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-300 border border-zinc-500 text-neutral-900 rounded-md px-3 py-2"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-gray-400 border border-zinc-600 text-neutral-800 rounded-md px-3 py-2"
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
          className="bg-gray-400 border border-zinc-600 text-neutral-800 rounded-md px-3 py-2"
        >
          <option value="">Sort By</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
          <option value="stock-desc">Stock ↓</option>
          <option value="sold-desc">Units Sold ↓</option>
        </select>
      </div>

      {/* ===== Table ===== */}
      <div className="overflow-x-auto rounded-lg border border-zinc-500">
        <table className="w-full bg-gray-200">
          <thead className="bg-gray-400">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-center">Price</th>
              <th className="p-3 text-center">Stock</th>
              <th className="p-3 text-center">Units Sold</th>
              <th className="p-3 text-center">Revenue</th>
              <th className="p-3 text-center">Last Updated</th>
              <th className="p-3"></th>
            </tr>
          </thead>

          <tbody>
            {paginatedProducts.map((product) => {
              const revenue = (product.unitsSold ?? 0) * product.price;

              return (
                <tr
                  key={product._id}
                  onClick={() => router.push(`/products/${product._id}`)}
                  className="border-b border-zinc-600 hover:bg-zinc-400/40 cursor-pointer"
                >
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={product.images?.[0] || "/profile.jpg"}
                      className="w-12 h-12 rounded-md border"
                      alt={product.name}
                    />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-neutral-600">
                        {product.category}
                      </p>
                    </div>
                  </td>

                  <td className="p-3 text-center">₹{product.price}</td>
                  <td className="p-3 text-center">{product.stock}</td>
                  <td className="p-3 text-center">{product.unitsSold ?? 0}</td>
                  <td className="p-3 text-center">
                    ₹{revenue.toLocaleString("en-IN")}
                  </td>
                  <td className="p-3 text-center text-sm">
                    {new Date(product.updatedAt).toLocaleDateString("en-IN")}
                  </td>

                  <td
                    className="p-3 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() =>
                          router.push(`/products/edit/${product._id}`)
                        }
                        className="px-3 py-1 bg-slate-400 rounded-md"
                      >
                        Edit
                      </button>

                      <button
                        onClick={(e) => handleDelete(e, product._id)}
                        className="px-3 py-1 bg-red-700 text-white rounded-md"
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

      {/* ===== Pagination ===== */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 rounded-md border transition-transform duration-200 
  ${
    p === page
      ? "bg-gray-300 text-neutral-900 border-zinc-400 scale-105 shadow-sm"
      : "bg-gray-600 text-white border-zinc-700 hover:bg-gray-500 hover:scale-105"
  }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
