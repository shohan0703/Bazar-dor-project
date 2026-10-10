"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL =
  "https://openapi.programming-hero.com/api/bazardor/products";

type Product = {
  id: number;
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

function ProductCard({ product }: { product: Product }) {
  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";

  return (
    <Link
      href={`/products/${product.id}`}
      className="block rounded-xl border border-[#e1e9e2] bg-[#fbfdfb] p-3 transition hover:-translate-y-0.5 hover:shadow-md sm:p-4"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eff5ef] text-2xl">
          {product.categoryIcon || "🛒"}
        </div>

        <div className="min-w-0">
          <h3 className="truncate font-bold text-[#25352c]">
            {product.nameBn}
          </h3>
          <p className="text-xs text-gray-500">
            প্রতি {product.unit}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-2">
        <div>
          <p className="text-xs text-gray-500">আজকের দাম</p>
          <p className="mt-1 text-lg font-bold text-[#25352c]">
            {product.today.toLocaleString("bn-BD")} টাকা
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${
            isUp
              ? "bg-red-50 text-red-600"
              : isDown
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-600"
          }`}
        >
          {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
          {product.change?.pct?.toLocaleString("bn-BD") ?? "০"}%
        </span>
      </div>
    </Link>
  );
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [banglaDate, setBanglaDate] = useState("");

  useEffect(() => {
    const updateDate = () => {
      const today = new Intl.DateTimeFormat("bn-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Dhaka",
      }).format(new Date());

      setBanglaDate(today);
    };

    updateDate();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("পণ্যের তথ্য লোড করা যায়নি");
        }

        const result = await response.json();

        const list = Array.isArray(result)
          ? result
          : Array.isArray(result.products)
            ? result.products
            : Array.isArray(result.data)
              ? result.data
              : [];

        setProducts(list);
      } catch {
        setError(
          "পণ্যের তথ্য পাওয়া যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।"
        );
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const increased = products.filter(
    (product) => product.change?.dir === "up"
  );

  const decreased = products.filter(
    (product) => product.change?.dir === "down"
  );

  return (
    <main className="min-h-screen bg-[#f0f6f1] text-[#25352c]">
      <div className="mx-auto max-w-6xl px-4 pb-12 pt-5 sm:pt-7">

        {/* Hero Section */}
        <section className="flex min-h-[200px] items-center justify-between gap-5 rounded-2xl border border-[#e1e9e2] bg-[#fbfdfb] p-5 sm:p-8">
          <div className="max-w-xl">
            <span className="inline-block rounded-full bg-[#e0f2e5] px-3 py-1 text-xs font-medium text-green-800">
              {banglaDate || "তারিখ লোড হচ্ছে..."}
            </span>

            <h1 className="mt-3 text-2xl font-extrabold leading-tight sm:text-4xl">
              আজকের বাজারের দাম এক নজরে
            </h1>

            <p className="mt-3 text-xs leading-6 text-gray-600 sm:text-sm">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
              বাজারদরের বিস্তারিত এবং দামের পরিবর্তন এক জায়গায়।
            </p>

            <a
              href="#all-products"
              className="mt-5 inline-block rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800"
            >
              সব পণ্য দেখুন
            </a>
          </div>

          <div className="hidden w-[180px] shrink-0 items-center justify-center sm:flex md:w-[220px]">
            <img
              src="/bazar-hero.png"
              alt="বাজারের পণ্য"
              className="max-h-44 w-full object-contain"
            />
          </div>
        </section>

        {/* Dynamic Price Sections */}
        <div className="mt-7 space-y-7" id="price-sections">

          {/* Increased Section */}
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <span className="text-red-500">▲</span>
              আজ দাম বেড়েছে
            </h2>

            {loading ? (
              <p className="text-sm text-gray-500">
                পণ্যের তথ্য লোড হচ্ছে...
              </p>
            ) : increased.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {increased.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              !error && (
                <p className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-500">
                  বর্তমানে দাম বেড়েছে এমন পণ্যের তথ্য নেই।
                </p>
              )
            )}
          </section>

          {/* Decreased Section */}
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <span className="text-green-600">▼</span>
              আজ দাম কমেছে
            </h2>

            {loading ? (
              <p className="text-sm text-gray-500">
                পণ্যের তথ্য লোড হচ্ছে...
              </p>
            ) : decreased.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {decreased.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              !error && (
                <p className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-500">
                  বর্তমানে দাম কমেছে এমন পণ্যের তথ্য নেই।
                </p>
              )
            )}
          </section>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </p>
          )}

        </div>

        {/* All Products Section */}
        <section className="mt-8 pb-10" id="all-products">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-[#25352c]">
              সব পণ্য
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              মোট {products.length.toLocaleString("bn-BD")}টি পণ্যের আজকের বাজারদর
            </p>
          </div>

          {loading ? (
            <p className="py-6 text-sm text-gray-500">
              পণ্যের তথ্য লোড হচ্ছে...
            </p>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            !error && (
              <p className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
                API থেকে কোনো পণ্যের তথ্য পাওয়া যায়নি।
              </p>
            )
          )}
        </section>

      </div>
    </main>
  );
}