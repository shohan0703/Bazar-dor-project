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
  avg?: number;
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

  // Fetch product detail
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
            setError("পণ্যটি পাওয়া যায়নি।");
          }
        }
      } catch {
        if (!cancelled) {
          setError("পণ্যের তথ্য পাওয়া যাচ্ছে না। আবার চেষ্টা করুন।");
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
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f4f7f4]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-green-700 border-t-transparent" />
          <p className="mt-4 text-sm text-gray-600">
            {sessionLoading
              ? "অপেক্ষা করুন..."
              : "লগইন পেজে নেওয়া হচ্ছে..."}
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f4f7f4]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-700 border-t-transparent" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-[60vh] bg-[#f4f7f4] px-4 py-16 text-center">
        <p className="mb-5 text-lg font-semibold text-red-600">
          {error || "পণ্যটি পাওয়া যায়নি।"}
        </p>
        <Link className="rounded-xl bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800" href="/">
          হোম পেজে ফিরে যান
        </Link>
      </main>
    );
  }

  const direction = product.change?.dir ?? "flat";
  const percentage = product.change?.pct ?? 0;

  const isUp = direction === "up";
  const isDown = direction === "down";

  const marketList = product.markets ?? [];
  const minPrices = marketList.map((m) => m.min);
  const maxPrices = marketList.map((m) => m.max);

  const overallMin = minPrices.length > 0 ? Math.min(...minPrices) : product.today;
  const overallMax = maxPrices.length > 0 ? Math.max(...maxPrices) : product.today;
  
  const cheapestMarket = marketList.find((m) => m.min === overallMin)?.market || "সাধারণ বাজার";
  const highestMarket = marketList.find((m) => m.max === overallMax)?.market || "সাধারণ বাজার";

  return (
    <main className="min-h-screen bg-[#f4f7f4] text-[#25352c] px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link className="hover:text-green-800" href="/">হোম</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">{product.nameBn}</span>
        </div>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#f4f7f4] text-4xl sm:h-24 sm:w-24 sm:text-5xl border border-gray-100">
              {product.categoryIcon || "🛒"}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                {product.nameBn}
              </h1>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                প্রতি কেজি · {product.categoryNameBn || product.category}
              </p>
              <p className="mt-2 text-xs text-gray-600">
                গতকালের তুলনায় আজ দাম {isUp ? "বেড়েছে" : isDown ? "কমেছে" : "পরিবর্তিত হয়নি"} - {percentage}%
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#f4f7f4] border border-gray-200 px-6 py-4 text-center shrink-0 w-full sm:w-auto">
            <p className="text-xs text-gray-500 font-medium">আজকের দাম</p>
            <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-gray-900">
              {product.today.toLocaleString("bn-BD")}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">টাকা / {product.unit}</p>
            <span className={`mt-2 inline-block text-xs font-bold ${isUp ? "text-red-600" : isDown ? "text-green-700" : "text-gray-600"}`}>
              {isUp ? "▲" : isDown ? "▼" : "—"} {percentage.toLocaleString("bn-BD")}%
            </span>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-gray-900">দামের সারসংক্ষেপ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs text-gray-500 font-medium">সর্বনিম্ন দাম</p>
              <p className="mt-2 text-2xl font-bold text-green-700">
                {overallMin.toLocaleString("bn-BD")} টাকা
              </p>
              <p className="mt-1 text-xs text-gray-400 truncate">
                সবচেয়ে কম দামের বাজার: {cheapestMarket}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs text-gray-500 font-medium">সর্বাধিক দাম</p>
              <p className="mt-2 text-2xl font-bold text-red-600">
                {overallMax.toLocaleString("bn-BD")} টাকা
              </p>
              <p className="mt-1 text-xs text-gray-400 truncate">
                সবচেয়ে বেশি দামের বাজার: {highestMarket}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs text-gray-500 font-medium">গড় দাম</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {product.today.toLocaleString("bn-BD")} টাকা
              </p>
              <p className="mt-1 text-xs text-gray-400">
                প্রতি কেজি-এর হিসেবে
              </p>
            </div>
          </div>
        </section>

        {marketList.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-4 text-lg font-bold text-gray-900">বাজারভিত্তিক আজকের দাম</h2>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left text-sm">
                  <thead className="bg-[#f4f7f4] text-xs font-semibold text-gray-600 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4">বাজার</th>
                      <th className="px-6 py-4">বিভাগ</th>
                      <th className="px-6 py-4">সর্বনিম্ন</th>
                      <th className="px-6 py-4">সর্বাধিক</th>
                      <th className="px-6 py-4">গড়</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {marketList.map((market, index) => {
                      const avgPrice = Math.round((market.min + market.max) / 2);
                      return (
                        <tr
                          key={`${market.market}-${market.division}-${index}`}
                          className="hover:bg-gray-50 transition"
                        >
                          <td className="px-6 py-4 font-medium text-gray-900">{market.market}</td>
                          <td className="px-6 py-4 text-gray-600">{market.division}</td>
                          <td className="px-6 py-4 font-semibold text-gray-800">
                            {market.min.toLocaleString("bn-BD")} টাকা
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-800">
                            {market.max.toLocaleString("bn-BD")} টাকা
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-800">
                            {avgPrice.toLocaleString("bn-BD")} টাকা
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center bg-[#f4f7f4]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-700 border-t-transparent" />
        </div>
      }
    >
      <ProductDetailContent />
    </Suspense>
  );
}