
"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

interface MarketPrice {
  market: string;
  division: string;
  min: number;
  max: number;
}

interface ProductDetail {
  id: number;
  slug?: string;
  nameBn: string;
  category: string;
  categoryNameBn?: string;
  categoryIcon?: string;
  unit: string;
  today: number;
  yesterday?: number;
  change?: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
  markets?: MarketPrice[];
}

function ProductDetailContent() {
  const params = useParams();
  const id = params?.id ? String(params.id) : "";

  const { data: session, isPending: sessionLoading } = useSession();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  
  useEffect(() => {
    if (sessionLoading) return;

    if (!session?.user) {
      window.location.replace("/login?error=unauthorized");
    }
  }, [sessionLoading, session]);

 
  useEffect(() => {
    if (sessionLoading || !session?.user || !id) return;

    let cancelled = false;

    async function fetchProduct() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `https://openapi.programming-hero.com/api/bazardor/product/${id}`
        );

        if (response.ok) {
          const result = await response.json();
          const item = result?.data ?? result?.product ?? result;

          if (
            item &&
            (item.id !== undefined || item.nameBn)
          ) {
            if (!cancelled) {
              setProduct(item);
              setLoading(false);
            }
            return;
          }
        }

        const listResponse = await fetch(
          "https://openapi.programming-hero.com/api/bazardor/products"
        );

        if (!listResponse.ok) {
          throw new Error("Failed to fetch products");
        }

        const result = await listResponse.json();

        const products = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result?.products)
              ? result.products
              : [];

        const found = products.find(
          (item: ProductDetail) =>
            String(item.id) === id || item.slug === id
        );

        if (!cancelled) {
          if (found) {
            setProduct(found);
          } else {
            setError("পণ্যটি পাওয়া যায়নি।");
          }
        }
      } catch {
        if (!cancelled) {
          setError("পণ্যের তথ্য পাওয়া যাচ্ছে না। আবার চেষ্টা করুন।");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [id, session, sessionLoading]);

  if (sessionLoading || !session?.user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-emerald-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          <p className="mt-4 text-gray-600">
            {sessionLoading
              ? "অপেক্ষা করুন..."
              : "লগইন পেজে নেওয়া হচ্ছে..."}
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-[60vh] px-4 py-16 text-center">
        <p className="mb-5 text-lg text-red-600">
          {error || "পণ্যটি পাওয়া যায়নি।"}
        </p>
        <Link
          href="/"
          className="rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800"
        >
          হোম পেজে ফিরে যান
        </Link>
      </main>
    );
  }

  const direction = product.change?.dir ?? "flat";
  const percentage = product.change?.pct ?? 0;

  const changeColor =
    direction === "up"
      ? "text-red-600"
      : direction === "down"
        ? "text-green-700"
        : "text-gray-500";

  return (
    <main className="min-h-screen bg-emerald-50/60 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 font-medium text-emerald-800 hover:text-emerald-950"
        >
          ← হোম পেজে ফিরে যান
        </Link>

        <section className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row">
            <div>
              <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-800">
                {product.categoryNameBn || product.category}
              </span>

              <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                {product.categoryIcon || "🛒"} {product.nameBn}
              </h1>

              <p className="mt-2 text-gray-500">
                প্রতি {product.unit}
              </p>

              <p className="mt-8 text-sm text-gray-500">
                আজকের বাজারদর
              </p>

              <p className="mt-1 text-4xl font-bold text-gray-900">
                {product.today} টাকা
              </p>

              {product.change && (
                <p className={`mt-3 font-semibold ${changeColor}`}>
                  {direction === "up"
                    ? "▲"
                    : direction === "down"
                      ? "▼"
                      : "—"}{" "}
                  {percentage}%{" "}
                  <span className="font-normal text-gray-600">
                    গতকালের তুলনায়
                  </span>
                </p>
              )}

              {product.yesterday !== undefined && (
                <div className="mt-5 rounded-xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">
                    গতকালের দাম
                  </p>
                  <p className="mt-1 text-xl font-semibold">
                    {product.yesterday} টাকা / {product.unit}
                  </p>
                </div>
              )}
            </div>

            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-6xl sm:h-36 sm:w-36 sm:text-7xl">
              {product.categoryIcon || "🛒"}
            </div>
          </div>
        </section>

        {product.markets && product.markets.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              বাজারভিত্তিক দাম
            </h2>

            <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-left">
                  <thead className="bg-emerald-50">
                    <tr>
                      <th className="px-5 py-4">বাজার</th>
                      <th className="px-5 py-4">বিভাগ</th>
                      <th className="px-5 py-4">সর্বনিম্ন দাম</th>
                      <th className="px-5 py-4">সর্বোচ্চ দাম</th>
                    </tr>
                  </thead>

                  <tbody>
                    {product.markets.map((market, index) => (
                      <tr
                        key={`${market.market}-${market.division}-${index}`}
                        className="border-t border-gray-100"
                      >
                        <td className="px-5 py-4">{market.market}</td>
                        <td className="px-5 py-4">{market.division}</td>
                        <td className="px-5 py-4 font-semibold text-emerald-700">
                          {market.min} টাকা
                        </td>
                        <td className="px-5 py-4 font-semibold text-emerald-700">
                          {market.max} টাকা
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        <p className="mt-6 rounded-xl border border-emerald-100 bg-white p-4 text-sm text-gray-600">
          নোট: বাজার ও সময় অনুযায়ী পণ্যের দাম পরিবর্তিত হতে পারে।
        </p>
      </div>
    </main>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
        </div>
      }
    >
      <ProductDetailContent />
    </Suspense>
  );
}
