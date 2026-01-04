import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/models/Product";
import { connectDB } from "@/lib/db";
import { productSchema } from "@/schemas/productSchema";
import { verifyToken } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/* ---------- AUTH HELPER ---------- */
function requireAuth(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) throw new Error("NO_TOKEN");
  verifyToken(token);
}

/* ---------------- GET ---------------- */
export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    await connectDB();

    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");

    if (id) {
      const product = await Product.findById(id).lean();
      if (!product) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json(product);
    }

    const products = await Product.find().lean();

    const safeProducts = products.map((product: any) => ({
      ...product,
      _id: product._id.toString(),
      createdAt: product.createdAt?.toISOString(),
      updatedAt: product.updatedAt?.toISOString(),
      sales: product.sales?.map((sale: any) => ({
        ...sale,
        _id: sale._id.toString(),
        date: new Date(sale.date).toISOString(),
      })) ?? [],
    }));

    return NextResponse.json(safeProducts);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

/* ---------------- POST (CREATE) ---------------- */
export async function POST(req: NextRequest) {
  try {
    requireAuth(req);
    await connectDB();

    const body = await req.json();
    if (!Array.isArray(body.images)) body.images = [];

    const validatedData = productSchema.parse(body);

    const product = await Product.create({
      ...validatedData,
      unitsSold: 0,
      sales: [],
    });

    // ✅ revalidate AFTER mutation
    revalidatePath("/");
    revalidatePath("/products");

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    return NextResponse.json(
      { error: "Unauthorized or invalid data" },
      { status: 401 }
    );
  }
}

/* ---------------- PUT (UPDATE) ---------------- */
export async function PUT(req: NextRequest) {
  try {
    requireAuth(req);
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

    // ✅ revalidate after update
    revalidatePath("/");
    revalidatePath("/products");

    return NextResponse.json(updated);
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    return NextResponse.json(
      { error: "Unauthorized or update failed" },
      { status: 401 }
    );
  }
}

/* ---------------- DELETE ---------------- */
export async function DELETE(req: NextRequest) {
  try {
    requireAuth(req);
    await connectDB();

    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await Product.findByIdAndDelete(id);

    // ✅ revalidate after delete
    revalidatePath("/");
    revalidatePath("/products");

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

