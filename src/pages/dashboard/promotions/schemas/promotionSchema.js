
import { z } from "zod";

export const promotionSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập tên khuyến mãi!")
      .max(150, "Tên khuyến mãi không được vượt quá 150 ký tự!"),

    discountPercentage: z
      .union([z.string(), z.number()])
      .optional()
      .transform((val) => (val === "" || val === undefined ? 0 : Number(val)))
      .refine(
        (val) => val === 0 || (val > 0 && val <= 100),
        "Phần trăm giảm phải từ 0 đến 100!"
      ),

    discountAmount: z
      .union([z.string(), z.number()])
      .optional()
      .transform((val) => (val === "" || val === undefined ? 0 : Number(val)))
      .refine(
        (val) => val === 0 || val > 0,
        "Số tiền giảm phải lớn hơn 0!"
      ),

    startDate: z
      .string()
      .min(1, "Vui lòng chọn ngày bắt đầu!"),

    endDate: z
      .string()
      .min(1, "Vui lòng chọn ngày kết thúc!"),

    isActive: z.boolean().default(true),
  })
  .refine(
    (data) =>
      data.discountPercentage > 0 || data.discountAmount > 0,
    {
      message: "Vui lòng nhập ít nhất 1 giá trị giảm giá (% hoặc VNĐ)!",
      path: ["discountPercentage"],
    }
  )
  .refine(
    (data) =>
      !data.startDate ||
      !data.endDate ||
      new Date(data.endDate) >= new Date(data.startDate),
    {
      message: "Ngày kết thúc phải sau ngày bắt đầu!",
      path: ["endDate"],
    }
  );

/**
 * Chuyển formData + selectedProducts → payload gửi API
 */
export function toPromotionPayload(formData, selectedProducts) {
  return {
    name: formData.name.trim(),
    discountPercentage: formData.discountPercentage
      ? parseFloat(formData.discountPercentage)
      : 0,
    discountAmount: formData.discountAmount
      ? parseFloat(formData.discountAmount)
      : 0,
    startDate: formData.startDate,
    endDate: formData.endDate,
    isActive: formData.isActive,
    products: selectedProducts.map((id) => ({ id })),
  };
}