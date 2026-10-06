
import { z } from "zod";

/**
 * Schema validate form Bill
 */
export const billSchema = z.object({
  orderId: z
    .union([z.string(), z.number()])
    .refine((val) => val !== "" && val !== null && val !== undefined, {
      message: "Vui lòng chọn đơn hàng!",
    }),

  totalAmount: z
    .union([z.string(), z.number()])
    .transform((val) => (val === "" ? NaN : Number(val)))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Vui lòng nhập tổng tiền hợp lệ (lớn hơn 0)!",
    }),

  paymentMethod: z.enum(["CASH", "CARD", "MOBILE"], {
    errorMap: () => ({ message: "Phương thức thanh toán không hợp lệ!" }),
  }),

  paymentStatus: z.enum(["PENDING", "COMPLETED", "FAILED"], {
    errorMap: () => ({ message: "Trạng thái thanh toán không hợp lệ!" }),
  }),

  notes: z
    .string()
    .max(500, "Ghi chú không được vượt quá 500 ký tự!")
    .optional()
    .or(z.literal("")),

  issuedAt: z.string().optional().or(z.literal("")),
});

/**
 * Chuyển form data → payload gửi API
 */
export function toBillPayload(formData) {
  return {
    order: { id: parseInt(formData.orderId) },
    totalAmount: parseFloat(formData.totalAmount),
    paymentMethod: formData.paymentMethod,
    paymentStatus: formData.paymentStatus,
    notes: formData.notes || "",
    issuedAt: formData.issuedAt || new Date().toISOString(),
  };
}

/**
 * Validate và trả về { success, errors, data }
 */
export function validateBill(data) {
  const result = billSchema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
      data: null,
    };
  }
  return { success: true, errors: {}, data: result.data };
}