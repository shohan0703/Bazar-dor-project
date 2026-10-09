"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryProducts from "@/components/CategoryProducts";

const categories: Record<
  string,
  { name: string; emoji: string }
> = {
  chal: { name: "চাল", emoji: "🍚" },
  dal: { name: "ডাল", emoji: "🫘" },
  tel: { name: "তেল", emoji: "🛢️" },
  sobji: { name: "সবজি", emoji: "🥬" },
  mach: { name: "মাছ", emoji: "🐟" },
  mangsho: { name: "মাংস", emoji: "🍗" },
  "dim-dudh": { name: "ডিম-দুধ", emoji: "🥛" },
  moshla: { name: "মসলা", emoji: "🌶️" },
};

type Product = {
  id: string | number;
  slug: string;
  nameBn: string;
  category: string;
  categoryIcon: string;
  unit: string;
  today: number;
  yesterday: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

type Props = {
  params: Promise<{ slug: string }>;
};

export default function CategoryPage({ params }: Props) {
  const { slug } = use(params);
  const category = categories[slug];

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
       const response = await fetch(
  "https://api.api-store.workers.dev/api/bazardor/products"
);

        if (response.ok) {
          const data = await response.json();
          const allProducts: Product[] = Array.isArray(data)
            ? data
            : Array.isArray(data.products)
              ? data.products
              : [];

          const filtered = allProducts.filter(
            (product) =>
              product.category === slug ||
              product.category === category?.name
          );
          setProducts(filtered);
        }
      } catch (error) {
        console.error("Products fetch failed:", error);
      } finally {
        setLoading(false);
      }
    }

    if (category) {
      fetchProducts();
    }
  }, [slug, category]);

  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f0f6f1] px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <section className="flex items-center gap-3 rounded-xl border border-[#e2eae3] bg-[#fbfdfb] px-4 py-4 sm:px-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0f3ef] text-2xl">
            {category.emoji}
          </span>

          <div>
            <h1 className="text-xl font-bold text-[#25352c]">
              {category.name}
            </h1>
            <p className="text-xs text-gray-500">
              {loading
                ? "ডাটা লোড হচ্ছে..."
                : `${products.length}টি পণ্যের আজকের দাম ও পরিবর্তন`}
            </p>
          </div>
        </section>

        <section className="mt-4">
          {loading ? (
            <div className="py-10 text-center text-gray-500">
              পণ্য লোড হচ্ছে...
            </div>
          ) : (
            <CategoryProducts
              products={products}
              categoryName={category.name}
            />
          )}
        </section>

        <div className="mt-6">
          <Link
            href="/"
            className="text-sm text-green-700 hover:underline"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
}