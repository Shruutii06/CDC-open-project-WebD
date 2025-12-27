"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-700 transition"
    >
      Logout
    </button>
  );
}
