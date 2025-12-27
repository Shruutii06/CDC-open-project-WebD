import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";
import { productSchema } from "@/schemas/productSchema";

// GET all products
export async function GET() {
  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 });
  return NextResponse.json(products);
}

// CREATE product
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const validatedData = productSchema.parse({
      ...body,
      images: body.images || [], // ✅ default
    });

    const product = await Product.create(validatedData);
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

// UPDATE product
export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      throw new Error("Product ID is required");
    }

    const validatedData = productSchema.parse({
      ...data,
      images: data.images || [], // ✅ default
    });

    const updated = await Product.findByIdAndUpdate(
      id,
      validatedData,
      { new: true }
    );

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

// DELETE product
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      throw new Error("Product ID required");
    }

    await Product.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
