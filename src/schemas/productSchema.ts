import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string(),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  images: z.array(z.string()).optional(),
});
