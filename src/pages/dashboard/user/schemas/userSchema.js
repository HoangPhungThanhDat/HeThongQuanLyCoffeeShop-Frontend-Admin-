
import { z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10,11}$/;

/**
 * Schema cho form tạo user
 */
export const createUserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username phải có ít nhất 3 ký tự!")
    .max(50, "Username không được vượt quá 50 ký tự!")
    .regex(/^[a-zA-Z0-9_]+$/, "Username chỉ được chứa chữ, số và dấu gạch dưới!"),

  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự!")
    .max(100, "Mật khẩu không được vượt quá 100 ký tự!"),

  fullName: z
    .string()
    .trim()
    .min(2, "Họ tên phải có ít nhất 2 ký tự!")
    .max(100, "Họ tên không được vượt quá 100 ký tự!"),

  role: z.enum(["ADMIN", "EMPLOYEE"], {
    errorMap: () => ({ message: "Vui lòng chọn vai trò!" }),
  }),

  email: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập email!")
    .regex(emailRegex, "Email không hợp lệ!"),

  phone: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || phoneRegex.test(val),
      "Số điện thoại phải có 10-11 chữ số!"
    ),

  isActive: z.boolean().default(true),
});

/**
 * Schema cho form update user (password optional)
 */
export const updateUserSchema = createUserSchema.extend({
  username: createUserSchema.shape.username.optional(),
  password: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || val.length >= 6,
      "Mật khẩu phải có ít nhất 6 ký tự!"
    ),
});

/**
 * Chuyển formData + imageFile → FormData để gửi API
 */
export function toUserFormData(formData, imageFile, isEditMode = false) {
  const fd = new FormData();

  const userJson = {
    username: formData.username,
    fullName: formData.fullName,
    role: formData.role,
    isActive: formData.isActive,
    email: formData.email,
    phone: formData.phone,
  };

  // Chỉ gửi password nếu có (create mode luôn có, edit mode optional)
  if (formData.password) {
    userJson.password = formData.password;
  }

  fd.append(
    "user",
    new Blob([JSON.stringify(userJson)], { type: "application/json" })
  );

  if (imageFile) {
    fd.append("image", imageFile);
  }

  return fd;
}