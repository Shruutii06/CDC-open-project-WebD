import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";
import { cache } from "react";

/* ---------------- ALL PRODUCTS ---------------- */
export const getProducts = cache(async () => {
  await connectDB();

  const products = await Product.find().lean();

  return products.map((p: any) => ({
    ...p,
    _id: p._id.toString(),
    createdAt: p.createdAt?.toISOString(),
    updatedAt: p.updatedAt?.toISOString(),
    sales: p.sales?.map((s: any) => ({
      ...s,
      _id: s._id.toString(),
      date: s.date?.toISOString(),
    })),
  }));
});

/* ---------------- SINGLE PRODUCT ---------------- */
export const getProductById = cache(async (id: string) => {
  if (!id || typeof id !== "string") {
    throw new Error("Invalid product ID");
  }

  await connectDB();

  const product = await Product.findById(id).lean();
  if (!product) throw new Error("Product not found");

  return {
    ...product,
    _id: product._id.toString(),
  };
});

/* ---------------- ANALYTICS ---------------- */
export const getAllProductsForAnalytics = cache(async () => {
  await connectDB();

  const products = await Product.find().lean();

  return products.map((p: any) => ({
    _id: p._id.toString(),
    name: p.name,
    category: p.category,
    price: p.price,
    stock: p.stock,
    unitsSold: p.unitsSold ?? 0,
    createdAt: p.createdAt?.toISOString(),
  }));
});
