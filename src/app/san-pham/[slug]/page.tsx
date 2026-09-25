import Image from "next/image";
import Link from "next/link";
export const dynamic = "force-dynamic";
import { ArrowLeft, Star } from "lucide-react";
import { CustomerShell } from "@/components/layout/CustomerShell";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductPurchaseActions } from "@/components/product/ProductPurchaseActions";
import { ProductSpecs } from "@/components/product/ProductSpecs";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { brands } from "@/data/brands";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { formatCurrency } from "@/lib/utils";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug && p.status === "active") ?? null;

  if (!product) {
    return (
      <CustomerShell>
        <section className="shell py-12">
          <EmptyState
            title="Khong tim thay san pham"
            description="San pham co the da ngung ban hoac duong dan khong chinh xac."
            action={
              <Link
                href="/"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-pulse/70 bg-pulse px-4 text-sm font-semibold text-obsidian transition-colors hover:bg-[#9af6dc]"
              >
                Quay lai trang chu
              </Link>
            }
          />
        </section>
      </CustomerShell>
    );
  }

  const brand = brands.find((item) => item.id === product.brandId);
  const category = categories.find((item) => item.id === product.categoryId);
  const relatedProducts = products
    .filter((candidate) => candidate.id !== product.id && candidate.status === "active")
    .slice(0, 4);
  const bundleProducts = products.filter((item) => product.bundleProductIds.includes(item.id));
  const stockLabel = product.stock <= product.lowStockThreshold ? `Con ${product.stock}` : "Con hang";

  return (
    <CustomerShell>
      <section className="shell py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-steel hover:text-pulse">
          <ArrowLeft size={16} aria-hidden="true" />
          Quay lai trang chu
        </Link>
      </section>

      <section className="shell grid gap-8 pb-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
        <div className="grid gap-3">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-line bg-graphite">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <aside className="rounded-lg border border-line bg-panel p-5 sm:p-6">
          <div className="flex flex-wrap gap-2">
            {product.badges.map((badge) => (
              <Badge key={badge} variant={badge === "Save" ? "violet" : "mint"}>
                {badge}
              </Badge>
            ))}
            <Badge variant={product.stock <= product.lowStockThreshold ? "warning" : "mint"}>{stockLabel}</Badge>
          </div>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-frost text-balance">{product.name}</h1>
          <p className="mt-4 text-sm leading-6 text-steel">{product.description}</p>
        </aside>
      </section>
    </CustomerShell>
  );
}
