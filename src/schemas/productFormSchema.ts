import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  category: z.string().min(1, "Category is required"),
  price: z.number().positive("Price must be greater than 0"),
  stock: z.number().int().nonnegative(),
  description: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
