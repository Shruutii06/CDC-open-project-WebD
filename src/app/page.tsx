import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const products = await getProducts();

  const stats = {
    totalProducts: products.length,
    totalCategories: new Set(products.map((p) => p.category)).size,
    lowStock: products.filter((p) => p.stock <= 5).length,
  };

  return (
    <div className="relative min-h-screen p-10 text-gray-900">
      {/* Background Grid */}
      <div
  className="absolute inset-0 -z-10 h-full w-full "
  style={{
    backgroundColor: "#F3F4F6 ",
    backgroundImage:
      "linear-gradient(to right,  #D1D5DB , 1px, transparent 1px), linear-gradient(to bottom, rgba(209,213,219,0.8) 1px, transparent 1px)",
    backgroundSize: "10rem 8rem", // grid square size
  }}
></div>



      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1 ">Product & inventory management</p>
        </div>
        <LogoutButton />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Products" value={stats.totalProducts} />
        <StatCard title="Categories" value={stats.totalCategories} />
        <StatCard title="Low Stock Alerts" value={stats.lowStock} />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Link
          href="/products"
          className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-400 transition"
        >
          Manage Products
        </Link>
        <Link
          href="/analytics"
          className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-400 transition"
        >
          View Analytics
        </Link>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
    </div>
  );
}
