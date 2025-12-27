import { NextResponse } from "next/server";
import Product from "@/lib/models/Product";
import { connectDB } from "@/lib/db";
import { productSchema } from "@/schemas/productSchema";

/* ---------------- GET ---------------- */
export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const product = await Product.findById(id).lean();
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  }

  const products = await Product.find().lean();

const safeProducts = products.map((product: { _id: { toString: () => any; }; createdAt: { toISOString: () => any; }; updatedAt: { toISOString: () => any; }; sales: any[]; }) => ({
  ...product,
  _id: product._id.toString(),
  createdAt: product.createdAt?.toISOString(),
  updatedAt: product.updatedAt?.toISOString(),

  sales: product.sales.map((sale) => ({
    ...sale,
    _id: sale._id.toString(),
    date: new Date(sale.date).toISOString(),
  })),
}));

return NextResponse.json(safeProducts);

}

/* ---------------- POST ---------------- */
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    if (!Array.isArray(body.images)) body.images = [];

    const validatedData = productSchema.parse(body);

    const product = await Product.create({
      ...validatedData,
      unitsSold: 0,
      sales: [],
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}

/* ---------------- PUT ---------------- */
export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const validatedData = productSchema.partial().parse({
      name: body.name,
      description: body.description,
      category: body.category,
      price: body.price,
      stock: body.stock,
      images: body.images ?? [],
    });

    const updated = await Product.findByIdAndUpdate(
      body.id,
      validatedData,
      { new: true }
    ).lean();

    return NextResponse.json(updated);
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

/* ---------------- DELETE ---------------- */
export async function DELETE(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  await Product.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
