"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const COLORS = ["#3b82f6", "#fbbf24", "#10b981"]; // Blue, Amber, Green

export default function AnalyticsCharts({ products }: { products: any[] }) {
  /* ---------------- KPI METRICS ---------------- */
  const totalRevenue = products.reduce(
    (sum, p) => sum + p.price * (p.unitsSold || 0),
    0
  );
  const totalUnitsSold = products.reduce(
    (sum, p) => sum + (p.unitsSold || 0),
    0
  );
  const inventoryValue = products.reduce(
    (sum, p) => sum + p.price * p.stock,
    0
  );

  /* ---------------- CATEGORY STOCK ---------------- */
  const categoryStock = Object.values(
    products.reduce((acc: any, p) => {
      acc[p.category] ??= { category: p.category, stock: 0 };
      acc[p.category].stock += p.stock;
      return acc;
    }, {})
  );

  /* ---------------- STOCK STATUS ---------------- */
  const stockStatus = [
    {
      name: "Healthy Stock",
      value: products.filter((p) => p.stock > 10).length,
    },
    {
      name: "Low Stock",
      value: products.filter((p) => p.stock > 0 && p.stock <= 10).length,
    },
    {
      name: "Out of Stock",
      value: products.filter((p) => p.stock === 0).length,
    },
  ];

  /* ---------------- SALES TREND ---------------- */
  const salesTrend = Object.values(
    products.reduce((acc: any, p) => {
      if (!p.createdAt) return acc;
      const date = new Date(p.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      acc[key] ??= {
        month: date.toLocaleString("default", {
          month: "short",
          year: "numeric",
        }),
        revenue: 0,
        sortKey: date.getTime(),
      };
      acc[key].revenue += p.price * (p.unitsSold || 0);
      return acc;
    }, {})
  ).sort((a: any, b: any) => a.sortKey - b.sortKey);

  /* ---------------- TOP SELLING PRODUCTS ---------------- */
  const topProducts = [...products]
    .sort((a, b) => (b.unitsSold || 0) - (a.unitsSold || 0))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Kpi title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} />
        <Kpi title="Units Sold" value={totalUnitsSold} />
        <Kpi
          title="Inventory Value"
          value={`₹${inventoryValue.toLocaleString()}`}
        />
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory by Category */}
        <ChartCard title="Inventory by Category">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryStock}>
              <XAxis dataKey="category" stroke="#374151" />
              <YAxis stroke="#374151" />
              <Tooltip
                contentStyle={{ backgroundColor: "#f9fafb", border: "1px solid #d1d5db", color: "#111827" }}
              />
              <Bar dataKey="stock" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Stock Status */}
        <ChartCard title="Stock Health">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stockStatus}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
              >
                {stockStatus.map((item, index) => (
                  <Cell key={item.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#f9fafb", border: "1px solid #d1d5db", color: "#111827" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Revenue Trend */}
        <ChartCard title="Revenue Trend" full>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesTrend}>
              <XAxis dataKey="month" stroke="#374151" />
              <YAxis stroke="#374151" />
              <Tooltip
                contentStyle={{ backgroundColor: "#f9fafb", border: "1px solid #d1d5db", color: "#111827" }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ================= TOP PRODUCTS ================= */}
      <ChartCard title="Top Selling Products">
        <ul className="space-y-3">
          {topProducts.map((p) => (
            <li key={p._id} className="flex justify-between text-sm text-gray-700">
              <span>{p.name}</span>
              <span className="font-medium">{p.unitsSold || 0} sold</span>
            </li>
          ))}
        </ul>
      </ChartCard>
    </div>
  );
}

/* ---------------- UI HELPERS ---------------- */
function Kpi({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-md flex flex-col justify-center hover:shadow-lg transition">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold text-gray-900 mt-2">{value}</p>
    </div>
  );
}

function ChartCard({ title, children, full }: { title: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-6 shadow-md ${full ? "lg:col-span-2" : ""}`}>
      <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="text-gray-700">{children}</div>
    </div>
  );
}
