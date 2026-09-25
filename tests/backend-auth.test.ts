import { describe, it, expect } from 'vitest';
import bcrypt from 'bcryptjs';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../src/lib/validations/auth.schema';

describe('Auth Validation Schemas', () => {
  it('validates correct registration data', () => {
    const validData = {
      name: 'Nguyen Van A',
      email: 'nguyenvana@gmail.com',
      password: 'password123',
    };
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects registration with invalid email or short password', () => {
    const invalidEmail = {
      name: 'Nguyen Van A',
      email: 'not-an-email',
      password: 'password123',
    };
    expect(registerSchema.safeParse(invalidEmail).success).toBe(false);

    const shortPass = {
      name: 'Nguyen Van A',
      email: 'valid@gmail.com',
      password: '123',
    };
    expect(registerSchema.safeParse(shortPass).success).toBe(false);
  });

  it('validates login schema', () => {
    expect(loginSchema.safeParse({ email: 'test@gmail.com', password: 'secretpassword' }).success).toBe(true);
    expect(loginSchema.safeParse({ email: 'invalid', password: '' }).success).toBe(false);
  });

  it('validates forgot and reset password schema', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'test@gmail.com' }).success).toBe(true);
    expect(resetPasswordSchema.safeParse({ token: 'reset-123', newPassword: 'newpassword123' }).success).toBe(true);
  });
});

describe('Password Hashing with Bcrypt', () => {
  it('hashes password and verifies match correctly', async () => {
    const password = 'mySuperSecretPassword2026';
    const hash = await bcrypt.hash(password, 10);
    expect(hash).not.toBe(password);
    expect(typeof hash).toBe('string');

    const isMatch = await bcrypt.compare(password, hash);
    expect(isMatch).toBe(true);

    const isWrongMatch = await bcrypt.compare('wrongPassword', hash);
    expect(isWrongMatch).toBe(false);
  });
});
