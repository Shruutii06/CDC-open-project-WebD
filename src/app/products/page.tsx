import ProductTable from "@/components/ProductTable";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getProducts(); // plain objects

  const categories = Array.from(
    new Set(
      products
        .map((p) => p.category?.trim())
        .filter(Boolean)
    )
  ).sort();

  return (
    <div className="p-6 bg-gray-300 min-h-screen">
      {/* ===== Header ===== */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-neutral-900">Products</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/products/new"
            className="px-4 py-2 text-md bg-gray-400 text-neutral-900 rounded-md hover:bg-gray-200 transition"
          >
            Add Product
          </Link>
          <LogoutButton />
        </div>
      </div>

      {/* ===== Products Table ===== */}
      <ProductTable products={products} categories={categories} />

      {/* ===== Back Link ===== */}
      <div className="mt-6">
        <Link
          href="/"
          className="text-sm font-semibold text-neutral-600 hover:text-neutral-500"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
