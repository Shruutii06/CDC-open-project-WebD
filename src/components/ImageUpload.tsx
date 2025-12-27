/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
}

export default function ImageUpload({ value, onChange }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleUpload(file: File) {
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    // ✅ append image instead of replace
    onChange([...value, data.secure_url]);

    setLoading(false);
  }

  function removeImage(url: string) {
    onChange(value.filter((img) => img !== url));
  }

  return (
    <div className="space-y-3">
      <label className="cursor-pointer text-blue-600 underline">
        Choose image
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleUpload(e.target.files[0]);
            }
          }}
        />
      </label>

      {loading && <p className="text-sm text-gray-500">Uploading...</p>}

      <div className="flex gap-2 flex-wrap">
        {value.map((img) => (
          <div
            key={img}
            className="relative w-[80px] h-[90px] border rounded overflow-hidden"
          >
            <img
              src={img}
              className="w-full h-full object-cover"
              alt="preview"
            />
            <button
              type="button"
              onClick={() => removeImage(img)}
              className="absolute top-0 right-0 bg-black text-white text-xs px-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
