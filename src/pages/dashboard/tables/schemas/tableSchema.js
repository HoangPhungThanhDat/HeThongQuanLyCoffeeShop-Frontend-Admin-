
import { z } from "zod";

export const tableSchema = z.object({
  number: z
    .union([z.string(), z.number()])
    .transform((val) => String(val).trim())
    .refine((val) => val.length > 0, "Vui lòng nhập số bàn!")
    .refine((val) => val.length <= 20, "Tên bàn không được vượt quá 20 ký tự!"),

  capacity: z
    .union([z.string(), z.number()])
    .transform((val) => (val === "" ? NaN : Number(val)))
    .refine((val) => !isNaN(val) && val > 0, "Số ghế phải lớn hơn 0!")
    .refine((val) => val <= 50, "Số ghế không được vượt quá 50!"),

  status: z.enum(["FREE", "OCCUPIED", "RESERVED"], {
    errorMap: () => ({ message: "Trạng thái không hợp lệ!" }),
  }),
});

/**
 * Chuyển formData → payload gửi API
 */
export function toTablePayload(formData) {
  return {
    number: String(formData.number).trim(),
    capacity: parseInt(formData.capacity),
    status: formData.status,
  };
}