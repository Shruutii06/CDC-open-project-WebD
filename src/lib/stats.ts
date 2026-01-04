import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";

export async function getDashboardStats() {
  await connectDB();

  const [stats] = await Product.aggregate([
    {
      $facet: {
        totalProducts: [{ $count: "count" }],
        categories: [
          { $group: { _id: "$category" } },
          { $count: "count" },
        ],
        lowStock: [
          { $match: { stock: { $lte: 5 } } },
          { $count: "count" },
        ],
      },
    },
  ]);

  return {
    totalProducts: stats.totalProducts[0]?.count ?? 0,
    totalCategories: stats.categories[0]?.count ?? 0,
    lowStock: stats.lowStock[0]?.count ?? 0,
  };
}
