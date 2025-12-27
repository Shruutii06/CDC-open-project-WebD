import ProductTable from "@/components/ProductTable";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const products = await getProducts(); // already plain objects

  const PAGE_SIZE = 5;
  const page = Math.max(1, Number(params.page) || 1);
  const totalPages = Math.ceil(products.length / PAGE_SIZE);

  const startIndex = (page - 1) * PAGE_SIZE;
  const paginatedProducts = products.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="p-6 bg-gray-300 min-h-screen">
      {/* ===== Header ===== */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-neutral-900">Products</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/products/new"
            className="px-4 py-2 text-md  bg-gray-400 text-neutral-900 rounded-md hover:bg-gray-200 transition"
          >
            Add Product
          </Link>
          <LogoutButton />
        </div>
      </div>

      {/* ===== Products Table ===== */}
      <ProductTable products={paginatedProducts} />

      {/* ===== Pagination ===== */}
      <div className="relative mt-6 flex items-center">
        <Link
          href="/"
          className="absolute left-0 text-sm font-semibold text-neutral-600 hover:text-neutral-500"
        >
          ← Back to Dashboard
        </Link>

        <div className="mx-auto flex gap-2">
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <Link
                key={pageNum}
                href={`/products?page=${pageNum}`}
                className={`px-4 py-2 rounded-md border transition-all duration-200 ${
                  page === pageNum
                    ? "bg-gray-200 text-neutral-800 border-zinc-400 shadow-sm"
                    : "bg-gray-600 text-neutral-100 border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600 hover:-translate-y-0.5 hover:shadow-md"
                }`}
              >
                {pageNum}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
