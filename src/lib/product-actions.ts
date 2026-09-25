"use server";

import { db } from "./db";
import { revalidatePath } from "next/cache";

export async function createProductAction(input: {
  id?: string;
  sku: string;
  name: string;
  categoryId: string;
  price: number;
  stock: number;
  status: string;
}) {
  try {
    const slug = input.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || `product-${Date.now()}`;

    if (db && 'product' in db) {
      const newProduct = await (db as any).product.create({
        data: {
          id: input.id,
          sku: input.sku.trim(),
          name: input.name.trim(),
          slug,
          brandId: "brand-aura",
          categoryId: input.categoryId,
          price: input.price,
          stock: Math.max(0, input.stock),
          lowStockThreshold: 5,
          rating: 0.0,
          reviewCount: 0,
          soldCount: 0,
          isFeatured: false,
          status: input.status,
          badges: [],
          image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1400&auto=format&fit=crop",
          gallery: [
            "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1400&auto=format&fit=crop"
          ],
          shortDescription: input.name.trim(),
          description: input.name.trim(),
          ecosystems: ["cross-platform"],
          useCases: ["everyday"],
          compatibilityNotes: [],
          batteryHours: 0.0,
          connectivity: [],
          waterResistance: null,
          sensors: [],
          anc: false,
          weightGrams: null,
          warrantyMonths: 12,
          bundleProductIds: [],
        },
      });

      return { ok: true as const, product: newProduct };
    }

    const mockProduct = {
      id: input.id || `prod-${Date.now()}`,
      sku: input.sku,
      name: input.name,
      slug,
      price: input.price,
      stock: input.stock,
      status: input.status,
    };

    return { ok: true as const, product: mockProduct };
  } catch (err: any) {
    console.error("Create product action error:", err);
    return { ok: false as const, error: err.message || "Failed to create product." };
  }
}

export async function updateProductAction(
  id: string,
  input: {
    sku?: string;
    name?: string;
    categoryId?: string;
    price?: number;
    stock?: number;
    status?: string;
  }
) {
  try {
    if (db && 'product' in db) {
      const updated = await (db as any).product.update({
        where: { id },
        data: input,
      });
      return { ok: true as const, product: updated };
    }
    return { ok: true as const, product: { id, ...input } };
  } catch (err: any) {
    return { ok: false as const, error: err.message || "Failed to update product." };
  }
}

export async function deleteProductAction(id: string) {
  try {
    if (db && 'product' in db) {
      const deleted = await (db as any).product.delete({
        where: { id },
      });
      return { ok: true as const, product: deleted };
    }
    return { ok: true as const, product: { id } };
  } catch (err: any) {
    return { ok: false as const, error: err.message || "Failed to delete product." };
  }
}

export async function updateProductStockAction(id: string, stock: number) {
  try {
    if (db && 'product' in db) {
      const updated = await (db as any).product.update({
        where: { id },
        data: { stock: Math.max(0, stock) },
      });
      return { ok: true as const, product: updated };
    }
    return { ok: true as const, product: { id, stock } };
  } catch (err: any) {
    return { ok: false as const, error: err.message || "Failed to update stock." };
  }
}

export async function updateProductBadgesAction(id: string, badges: string[]) {
  try {
    if (db && 'product' in db) {
      const updated = await (db as any).product.update({
        where: { id },
        data: { badges },
      });
      return { ok: true as const, product: updated };
    }
    return { ok: true as const, product: { id, badges } };
  } catch (err: any) {
    return { ok: false as const, error: err.message || "Failed to update badges." };
  }
}
