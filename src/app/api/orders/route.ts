import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { productId, quantity } = await req.json();

    if (!productId || !quantity || quantity <= 0) {
      return NextResponse.json(
        { error: "Invalid order data" },
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

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: "Insufficient stock" },
        { status: 400 }
      );
    }

    // ✅ UPDATE INVENTORY
    product.stock -= quantity;
    product.unitsSold += quantity;

    // ✅ RECORD SALE
    product.sales.push({
      date: new Date(),
      quantity,
      priceAtSale: product.price,
    });

    await product.save();

    return NextResponse.json({
      success: true,
      stock: product.stock,
      unitsSold: product.unitsSold,
    });
  } catch (err) {
    console.error("ORDER ERROR:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
