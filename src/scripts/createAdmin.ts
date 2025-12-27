import "dotenv/config";

// console.log("MONGODB_URI =", process.env.MONGODB_URI);

import { connectDB } from "../lib/db";
import Admin from "../lib/models/Admin";
import bcrypt from "bcryptjs";

async function createAdmin() {
  await connectDB();

  const hashedPassword = await bcrypt.hash("admin123", 10);

  await Admin.create({
    email: "admin@example.com",
    password: hashedPassword,
  });

  console.log("Admin created");
  process.exit(0);
}

createAdmin();
