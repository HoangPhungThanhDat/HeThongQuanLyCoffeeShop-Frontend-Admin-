// src/pages/dashboard/category/schemas/categorySchema.js
import { z } from "zod";

/**
 * Base schema cho category form (create + edit)
 */
export const categorySchema = z.object({
  name: z
    .string({ required_error: "Vui lòng nhập tên danh mục!" })
    .trim()
    .min(1, "Vui lòng nhập tên danh mục!")
    .min(2, "Tên danh mục phải có ít nhất 2 ký tự!")
    .max(100, "Tên danh mục không được vượt quá 100 ký tự!"),

  description: z
    .string()
    .trim()
    .max(500, "Mô tả không được vượt quá 500 ký tự!")
    .optional()
    .or(z.literal("")),
});

/**
 * Schema cho API response (đầy đủ fields)
 */
export const categoryResponseSchema = categorySchema.extend({
  id: z.number(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  products: z.array(z.any()).optional(),
});

/**
 * Helper: validate và trả về { success, errors, data }
 */
export function validateCategory(data) {
  const result = categorySchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
      data: null,
    };
  }

  return {
    success: true,
    errors: {},
    data: result.data,
  };
}