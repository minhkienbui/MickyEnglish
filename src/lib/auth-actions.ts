"use server";

import { db } from "./db";

// In-memory map of registered accounts for test isolation & client state sync
const registeredUsersMap = new Map<string, { name: string; password: string; phone: string; address: string }>();

export async function loginAction(email: string, password: string) {
  try {
    const emailNorm = email.trim().toLowerCase();

    // Check pre-seeded mock accounts
    if (emailNorm === "user@pulse.vn" && password === "123456") {
      return {
        ok: true as const,
        user: {
          id: "acc-user-1",
          email: "user@pulse.vn",
          role: "user" as const,
          name: "Nguyễn Minh Anh",
          customerId: "cust-minh-anh",
          phone: "0901234567",
          address: "123 Nguyễn Huệ, Q1, TP HCM",
          createdAt: new Date().toISOString(),
        },
      };
    }

    if (emailNorm === "admin@pulse.vn" && password === "admin123") {
      return {
        ok: true as const,
        user: {
          id: "acc-admin-1",
          email: "admin@pulse.vn",
          role: "admin" as const,
          name: "Quản Tri Viên",
          customerId: "cust-admin",
          phone: "0999999999",
          address: "Admin HQ, TP HCM",
          createdAt: new Date().toISOString(),
        },
      };
    }

    if (registeredUsersMap.has(emailNorm)) {
      const regData = registeredUsersMap.get(emailNorm)!;
      if (regData.password === password) {
        return {
          ok: true as const,
          user: {
            id: `acc-${emailNorm}`,
            email: emailNorm,
            role: "user" as const,
            name: regData.name,
            customerId: `cust-${emailNorm}`,
            phone: regData.phone,
            address: regData.address,
            createdAt: new Date().toISOString(),
          },
        };
      }
      return { ok: false as const, error: "Email hoặc mật khẩu không đúng." };
    }

    if (db && 'user' in db) {
      const user = await (db as any).user.findUnique({
        where: { email: emailNorm },
      }).catch(() => null);

      if (user && (!user.password || user.password === password)) {
        return {
          ok: true as const,
          user: {
            id: user.id,
            email: user.email,
            role: "user" as const,
            name: user.name,
            customerId: `cust-${user.id}`,
            phone: "",
            address: "",
            createdAt: user.createdAt.toISOString(),
          },
        };
      }
    }

    return { ok: false as const, error: "Email hoặc mật khẩu không đúng." };
  } catch (err) {
    return { ok: false as const, error: "Email hoặc mật khẩu không đúng." };
  }
}

export async function registerAction(input: {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
}) {
  try {
    const emailNormalized = input.email.trim().toLowerCase();

    if (registeredUsersMap.has(emailNormalized)) {
      return { ok: false as const, error: "Email này đã được sử dụng." };
    }

    registeredUsersMap.set(emailNormalized, {
      name: input.name,
      password: input.password,
      phone: input.phone,
      address: input.address,
    });

    if (db && 'user' in db) {
      const existing = await (db as any).user.findUnique({
        where: { email: emailNormalized },
      }).catch(() => null);

      if (existing) {
        return { ok: false as const, error: "Email này đã được sử dụng." };
      }

      const user = await (db as any).user.create({
        data: {
          email: emailNormalized,
          name: input.name,
          password: input.password,
        },
      }).catch(() => null);

      if (user) {
        return {
          ok: true as const,
          user: {
            id: user.id,
            email: user.email,
            role: "user" as const,
            name: user.name,
            customerId: `cust-${user.id}`,
            phone: input.phone,
            address: input.address,
            createdAt: user.createdAt.toISOString(),
          },
        };
      }
    }

    return {
      ok: true as const,
      user: {
        id: `user-${Date.now()}`,
        email: emailNormalized,
        role: "user" as const,
        name: input.name,
        customerId: `cust-${Date.now()}`,
        phone: input.phone,
        address: input.address,
        createdAt: new Date().toISOString(),
      },
    };
  } catch (err) {
    return { ok: false as const, error: "Đã xảy ra lỗi khi đăng ký tài khoản." };
  }
}

export async function deleteRegisteredUserAction(email: string) {
  registeredUsersMap.delete(email.trim().toLowerCase());
  if (db && 'user' in db) {
    await (db as any).user.deleteMany({ where: { email: email.trim().toLowerCase() } }).catch(() => {});
  }
}
