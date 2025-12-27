import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { productId, quantity } = await req.json();

    // 🔒 VALIDATION
    if (!productId || !quantity || quantity <= 0) {
      return NextResponse.json(
        { error: "Product ID and valid quantity required" },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // ❌ Prevent overselling
    if (quantity > product.stock) {
      return NextResponse.json(
        { error: "Not enough stock" },
        { status: 400 }
      );
    }

    // ✅ Update product
    product.unitsSold += quantity;
    product.stock -= quantity;

    // ✅ PUSH SALES ENTRY (THIS WAS BROKEN)
    product.sales.push({
      date: new Date(),
      quantity: quantity, // ✅ REQUIRED
      priceAtSale: product.price,
    });

    await product.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("SALES UPDATE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to update sales" },
      { status: 500 }
    );
  }
}
