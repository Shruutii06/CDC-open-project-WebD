import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";
import { Types } from "mongoose";

export async function getProducts() {
  await connectDB();

  const products = await Product.find().lean();

  return products.map((p) => ({
    ...p,
    _id: p._id.toString(),           // ✅ FIX
    createdAt: p.createdAt?.toISOString(),
    updatedAt: p.updatedAt?.toISOString(),
    sales: p.sales?.map((s: any) => ({
      ...s,
      _id: s._id.toString(),         // ✅ FIX
      date: s.date?.toISOString(),
    })),
  }));
}


export async function getProductById(id: string) {
  console.log("ID RECEIVED IN LIB →", id);

  if (!id || typeof id !== "string") {
    throw new Error("Invalid product ID (not a string)");
  }

  await connectDB();

  const product = await Product.findById(id).lean();
  if (!product) throw new Error("Product not found");

  return {
    ...product,
    _id: product._id.toString(),
  };
}
export async function getAllProductsForAnalytics() {
  await connectDB();

  const products = await Product.find().lean();

  return products.map((p: any) => ({
    _id: p._id.toString(),
    name: p.name,
    category: p.category,
    price: p.price,
    stock: p.stock,
    unitsSold: p.unitsSold ?? 0,
    createdAt: p.createdAt?.toISOString(), // ✅ REQUIRED
  }));
}


