import Image from "next/image";
import Link from "next/link";
import UpdateUnitsSold from "@/components/UpdateUnitsSold";
import { getProductById } from "@/lib/products";

export const dynamic = "force-dynamic";

/* =======================
   Types
======================= */

type Sale = {
  _id: string;
  date: string;
  quantity: number;
  priceAtSale: number;
};

type Product = {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  unitsSold?: number;
  images?: string[];
  sales?: Sale[];
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailsPage({ params }: Props) {
  const { id } = await params;

  const product = (await getProductById(id)) as Product;

  const revenue = (product.unitsSold ?? 0) * product.price;

  return (
    <div className="min-h-screen px-4 py-8">
      <div
        className="absolute inset-0 -z-10 h-full w-full"
        style={{
          backgroundColor: "#D1D5DB",
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "10rem 8rem",
        }}
      />

      <div className="mx-auto max-w-5xl bg-gray-100 border border-zinc-600 rounded-xl shadow-sm p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">
            {product.name}
          </h1>
          <Link
            href="/products"
            className="text-sm text-neutral-700 hover:text-neutral-500 transition"
          >
            ← Back to Products
          </Link>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left */}
          <div className="space-y-4">
            <div className="w-full h-64 relative border border-zinc-700 rounded-lg overflow-hidden">
              <Image
                src={product.images?.[0] || "/profile.jpg"}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <UpdateUnitsSold
              productId={product._id}
              currentUnits={product.unitsSold ?? 0}
            />
          </div>

          {/* Right */}
          <div className="bg-gray-300 border border-zinc-700 rounded-lg p-5 py-12 flex flex-col justify-between">
            <div className="space-y-3 text-neutral-800 text-xl">
              <p>
                <span className="text-neutral-900">Category:</span>{" "}
                {product.category}
              </p>
              <p>
                <span className="text-neutral-900">Description:</span>{" "}
                {product.description}
              </p>
              <p>
                <span className="text-neutral-900">Price:</span> ₹{product.price}
              </p>
              <p>
                <span className="text-neutral-900">Stock:</span>{" "}
                {product.stock}
              </p>
              <p>
                <span className="text-neutral-900">Units Sold:</span>{" "}
                {product.unitsSold ?? 0}
              </p>

              <p className="pt-2 border-t border-zinc-700">
                <span className="text-neutral-900">Total Revenue:</span>{" "}
                ₹{revenue.toLocaleString("en-IN")}
              </p>
              

              {/* Sales History */}
              <h3 className="font-semibold mt-6">Sales History</h3>

              <table className="w-full mt-3 border border-zinc-700 text-sm">
                <thead>
                  <tr className="bg-neutral-700 text-neutral-200">
                    <th className="p-2">Date</th>
                    <th className="p-2">Units Sold</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {product.sales?.length ? (
                    product.sales.map((sale: Sale) => (
                      <tr
                        key={sale._id}
                        className="border-t border-zinc-700 text-center"
                      >
                        <td className="p-2">
                          {new Date(sale.date).toLocaleDateString()}
                        </td>
                        <td className="p-2">{sale.quantity}</td>
                        <td className="p-2">₹{sale.priceAtSale}</td>
                        <td className="p-2">
                          ₹{sale.quantity * sale.priceAtSale}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-3 text-center text-neutral-700"
                      >
                        No sales recorded
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <Link
                href={`/products/edit/${product._id}`}
                className="px-4 py-2 bg-neutral-400 text-neutral-900 rounded-md font-medium hover:bg-neutral-400 transition"
              >
                Edit Product
              </Link>

              <Link
                href="/"
                className="px-4 py-2 border border-zinc-600 text-neutral-900 rounded-md hover:bg-zinc-400 transition"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

