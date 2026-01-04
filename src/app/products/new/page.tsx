/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import ImageUpload from "@/components/ImageUpload";

/* -------------------- */
/* Zod Schema */
/* -------------------- */
const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce
    .number()
    .min(0, "Price must be positive")
    .refine((v) => !isNaN(v), "Price is required"),
  category: z.enum(
    ["electronic", "clothing", "stationary", "bath essential", "beauty"],
    { required_error: "Category is required" }
  ),
  stock: z.coerce
    .number()
    .min(0, "Stock must be 0 or more")
    .refine((v) => !isNaN(v), "Stock is required"),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export default function NewProductPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema) as any,
    defaultValues: { price: 0, stock: 0 },
  });

  async function onSubmit(values: ProductFormValues) {
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        images: images.length ? images : [],
      }),
    });

    router.push("/products");
  }

  return (
    <div className="min-h-screen  px-6 py-12">
      <div
        className="absolute inset-0 -z-10 h-full w-full"
        style={{
          backgroundColor: "#D1D5DB", // bg-gray-300
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "10rem 8rem",
        }}
      ></div>

      <div className="mx-auto max-w-2xl bg-gray-100 border border-zinc-700 rounded-xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-neutral-900 mb-8">
          Add New Product
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* ---------------- STEP 1 ---------------- */}
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1 text-neutral-800">
                  Product Name
                </label>
                <input
                  {...register("name")}
                  className="w-full px-3 py-2 rounded-md bg-gray-300 border border-zinc-700 text-neutral-900 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-600 transition"
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-neutral-800">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  className="w-full px-3 py-2 rounded-md bg-gray-300 border border-zinc-700 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-600 transition"
                  placeholder="Enter product description"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href="/products"
                  className="text-sm text-neutral-600 hover:text-neutral-400 transition"
                >
                  ← Back to Products
                </Link>

                <button
                  type="button"
                  className="bg-gray-400 text-neutral-900 px-5 py-2 rounded-md font-medium hover:bg-gray-300 transition"
                  onClick={async () => {
                    const valid = await trigger(["name", "description"]);
                    if (valid) setStep(2);
                  }}
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* ---------------- STEP 2 ---------------- */}
          {step === 2 && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1 text-neutral-900">
                  Price (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("price")}
                  className="w-full px-3 py-2 rounded-md bg-gray-300 border border-zinc-700 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-600 transition"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-neutral-800">
                  Category
                </label>
                <select
                  {...register("category")}
                  defaultValue=""
                  className="w-full px-3 py-2 rounded-md bg-gray-300 border border-zinc-700 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-600 transition"
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  <option value="electronic">Electronic</option>
                  <option value="clothing">Clothing</option>
                  <option value="stationary">Stationary</option>
                  <option value="bath essential">Bath Essential</option>
                  <option value="beauty">Beauty</option>
                </select>

                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-neutral-800">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  {...register("stock")}
                  className="w-full px-3 py-2 rounded-md bg-gray-300 border border-zinc-700 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-600 transition"
                />
                {errors.stock && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.stock.message}
                  </p>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-md bg-gray-600 border  border-zinc-700 text-neutral-200 hover:bg-zinc-700 transition"
                >
                  Back
                </button>

                <button
                  type="button"
                  className="bg-gray-400 text-neutral-900 px-5 py-2 rounded-md font-medium hover:bg-gray-300 transition"
                  onClick={async () => {
                    const valid = await trigger(["price", "category", "stock"]);
                    if (valid) setStep(3);
                  }}
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* ---------------- STEP 3 ---------------- */}
          {step === 3 && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-900">
                  Product Images
                </label>
                <ImageUpload value={images} onChange={setImages} />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-md bg-gray-500 border border-zinc-700 text-neutral-200 hover:bg-zinc-600 transition"
                >
                  Back
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition"
                >
                  Create Product
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
