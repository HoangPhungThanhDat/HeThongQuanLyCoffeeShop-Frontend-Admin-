
import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập tên sản phẩm!")
    .max(150, "Tên sản phẩm không được vượt quá 150 ký tự!"),

  description: z
    .string()
    .max(1000, "Mô tả không được vượt quá 1000 ký tự!")
    .optional()
    .or(z.literal("")),

  price: z
    .union([z.string(), z.number()])
    .transform((val) => (val === "" ? NaN : Number(val)))
    .refine((val) => !isNaN(val) && val > 0, "Giá phải lớn hơn 0!")
    .refine((val) => val <= 1_000_000_000, "Giá không được vượt quá 1 tỷ!"),

  stockQuantity: z
    .union([z.string(), z.number()])
    .transform((val) => (val === "" ? NaN : Number(val)))
    .refine((val) => !isNaN(val) && val >= 0, "Số lượng phải từ 0 trở lên!")
    .refine((val) => val <= 100000, "Số lượng không được vượt quá 100,000!"),

  categoryId: z
    .union([z.string(), z.number()])
    .refine(
      (val) => val !== "" && val !== null && val !== undefined,
      "Vui lòng chọn danh mục!"
    ),

  isActive: z.boolean().default(true),
});

/**
 * Chuyển formData + imageFile → FormData để gửi API
 */
export function toProductFormData(formData, imageFile, isEditMode = false) {
  const fd = new FormData();

  const productJson = {
    name: formData.name.trim(),
    description: formData.description?.trim() || "",
    price: parseFloat(formData.price),
    stockQuantity: parseInt(formData.stockQuantity),
    isActive: formData.isActive,
    category: { id: parseInt(formData.categoryId) },
  };

  fd.append(
    "product",
    new Blob([JSON.stringify(productJson)], { type: "application/json" })
  );

  // Create mode: ảnh bắt buộc. Edit mode: ảnh optional.
  if (imageFile) {
    fd.append("image", imageFile);
  }

  return fd;
}