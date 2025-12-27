export const dynamic = "force-dynamic";

import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import { getAllProductsForAnalytics } from "@/lib/products";

export default async function AnalyticsPage() {
  const rawProducts = await getAllProductsForAnalytics();

  const products = rawProducts.map((p) => ({
    ...p,
    revenue: p.unitsSold * p.price,
  }));

  const lastUpdated = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* ===== Header ===== */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xl tracking-wide text-gray-500">Acme Commerce Pvt. Ltd.</span>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">Analytics & Insights</h1>
            <p className="text-gray-600 text-sm mt-1">
              Sales, revenue, and inventory performance overview
            </p>
            <p className="text-gray-500 text-xs mt-1">Last updated: {lastUpdated}</p>
          </div>
          <div className="ml-auto">
            <LogoutButton />
          </div>
        </div>

        {/* ===== Back to Dashboard ===== */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-neutral-700 hover:text-neutral-400"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* ===== Analytics Cards ===== */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            <AnalyticsCharts products={products} />
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-500 shadow-sm">
            No data available to display analytics.
          </div>
        )}
      </div>
    </div>
  );
}
