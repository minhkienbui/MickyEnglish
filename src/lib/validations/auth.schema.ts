import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, { message: 'Họ và tên phải có ít nhất 2 ký tự' }),
  email: z.string().email({ message: 'Địa chỉ email không hợp lệ' }),
  password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email({ message: 'Địa chỉ email không hợp lệ' }),
  password: z.string().min(1, { message: 'Vui lòng nhập mật khẩu' }),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Địa chỉ email không hợp lệ' }),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().min(1, { message: 'Mã xác thực không hợp lệ' }),
  newPassword: z.string().min(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự' }),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
