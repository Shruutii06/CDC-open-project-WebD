import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Admin from "@/lib/models/Admin";

export async function POST(req: Request) {
  await connectDB();
  const { email, password } = await req.json();

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // ✅ Sign JWT
  const token = jwt.sign(
    { id: admin._id },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  // ✅ Set cookie
  const res = NextResponse.json({ success: true });

  res.cookies.set("admin_token", token, {
    httpOnly: true,
    path: "/",           // required for all routes
    sameSite: "lax",     // 🔹 change from strict → lax for local dev
    secure: process.env.NODE_ENV === "production", // true only in prod
  });

  return res;
}
