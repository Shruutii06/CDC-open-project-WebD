"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Invalid credentials");
      return;
    }

    router.replace("/");
  }

  return (
    <div className="relative h-screen">
      {/* Background Pattern */}
      <div
  className="absolute inset-0 -z-10 h-full w-full "
  style={{
    backgroundColor: "#F3F4F6 ",
    backgroundImage:
      "linear-gradient(to right,  #D1D5DB , 1px, transparent 1px), linear-gradient(to bottom, rgba(209,213,219,0.8) 1px, transparent 1px)",
    backgroundSize: "10rem 8rem", // grid square size
  }}
></div>

      {/* Login Form */}
      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-200 border border-gray-400 p-8 rounded-lg w-96 shadow-md"
        >
          <h2 className="text-2xl text-gray-900 font-bold text-center mb-7">
            Yhills Pvt. Limited
          </h2>
          <h1 className="text-xl text-gray-800 font-semibold mb-5">
            Admin Login
          </h1>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 px-3 py-2 bg-gray-100 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 px-3 py-2 bg-gray-100 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <button
            disabled={loading}
            className="w-full bg-blue-700 text-white py-2 rounded font-medium hover:bg-blue-400 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
