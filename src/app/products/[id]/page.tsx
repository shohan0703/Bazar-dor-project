"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

interface MarketPrice {
  market: string;
  division: string;
  min: number;
  max: number;
}

interface ProductDetail {
  id: number | string;
  slug?: string;
  nameBn: string;
  category: string;
  categoryNameBn?: string;
  categoryIcon: string;
  unit: string;
  today: number;
  yesterday: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
  markets?: MarketPrice[];
}

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  
  const id = params?.id ? String(params.id) : "";

  const { data: session, isPending: sessionLoading } = useSession();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // প্রাইভেট রাউট চেক
  useEffect(() => {
    if (!sessionLoading && !session?.user) {
      router.push("/login");
    }
  }, [sessionLoading, session, router]);

  // API থেকে নির্দিষ্ট প্রোডাক্টের ডেটা ফেচ করা
  useEffect(() => {
    async function fetchProductDetails() {
      if (!id || !session?.user) return;

      try {
        setLoading(true);
        // প্রথমে ডাইরেক্ট প্রোডাক্ট এন্ডপয়েন্ট ট্রাই করতে পারেন, না হলে অল প্রোডাক্টস থেকে ফিল্টার
        const res = await fetch(`https://openapi.programming-hero.com/api/bazardor/product/${id}`);
        
        if (res.ok) {
          const result = await res.json();
          const singleProduct = result.data || result;
          if (singleProduct && (singleProduct.id || singleProduct.nameBn)) {
            setProduct(singleProduct);
            setLoading(false);
            return;
          }
        }

        // যদি ডাইরেক্ট এন্ডপয়েন্ট কাজ না করে তবে পুরো লিস্ট থেকে খুঁজে বের করা
        const response = await fetch("https://openapi.programming-hero.com/api/bazardor/products");
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

        const foundProduct = list.find(
          (item: any) => String(item.id) === id || String(item.slug) === id
        );

        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError("পণ্যটি পাওয়া যায়নি");
        }
      } catch (err) {
        setError("পণ্যের তথ্য পাওয়া যাচ্ছে না।");
      } finally {
        setLoading(false);
      }
    }

    fetchProductDetails();
  }, [id, session]);

  if (sessionLoading || loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-700 border-t-transparent"></div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-red-600 font-medium">{error || "তথ্য পাওয়া যায়নি"}</p>
        <Link href="/" className="mt-4 inline-block text-sm text-green-700 underline font-semibold">
          হোমপেজে ফিরে যান
        </Link>
      </div>
    );
  }

  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";
  const diffPrice = Math.abs(product.today - product.yesterday);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
      {/* Breadcrumb */}
      <nav className="text-xs sm:text-sm text-gray-500 mb-4 flex items-center gap-1.5">
        <Link href="/" className="hover:text-green-700">হোম</Link>
        <span>›</span>
        <span className="hover:text-green-700">{product.categoryNameBn || product.category}</span>
        <span>›</span>
        <span className="text-gray-800 font-medium">{product.nameBn}</span>
      </nav>

      {/* Product Hero Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#eff5ef] rounded-2xl flex items-center justify-center text-3xl border border-gray-100">
            {product.categoryIcon || "🛒"}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {product.nameBn}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              প্রতি {product.unit} · {product.categoryNameBn || product.category}
            </p>
            <p className={`text-xs sm:text-sm font-medium mt-1 ${isUp ? "text-red-600" : isDown ? "text-green-600" : "text-gray-600"}`}>
              গতকালের তুলনায় আজ দাম {isUp ? "বেড়েছে" : isDown ? "কমেছে" : "পরিবর্তন হয়নি"} - {diffPrice} টাকা
            </p>
          </div>
        </div>

        {/* Current Price Box */}
        <div className="w-full md:w-auto bg-[#f9fcfa] border border-green-100 rounded-2xl p-4 text-center md:text-right min-w-[180px]">
          <p className="text-xs text-gray-500 mb-1">আজকের দাম</p>
          <div className="text-2xl sm:text-3xl font-extrabold text-green-800">
            {product.today?.toLocaleString("bn-BD")}
          </div>
          <p className="text-xs text-gray-600 mt-0.5">টাকা / {product.unit}</p>
          <div className={`inline-flex items-center gap-1 text-xs font-semibold mt-1 ${isUp ? "text-red-600" : "text-green-600"}`}>
            <span>{isUp ? "▲" : isDown ? "▼" : "—"} {product.change?.pct ?? 0}%</span>
          </div>
        </div>
      </div>

      {/* Price Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">আজকের দাম</p>
          <p className="text-xl font-bold text-green-700">{product.today?.toLocaleString("bn-BD")} টাকা</p>
          <p className="text-[11px] text-gray-400 mt-1">বর্তমান বাজারদর</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">গতকালের দাম</p>
          <p className="text-xl font-bold text-gray-700">{product.yesterday?.toLocaleString("bn-BD")} টাকা</p>
          <p className="text-[11px] text-gray-400 mt-1">গতকালের তুলনামূলক দাম</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">মূল্যের তারতম্য</p>
          <p className={`text-xl font-bold ${isUp ? "text-red-600" : "text-green-600"}`}>
            {isUp ? "+" : isDown ? "-" : ""}{product.change?.pct ?? 0}%
          </p>
          <p className="text-[11px] text-gray-400 mt-1">শতাংশ পরিবর্তন</p>
        </div>
      </div>

      {/* Market-wise Price Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">বাজারভিত্তিক আজকের দাম</h2>
        </div>
        
        {product.markets && product.markets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50/75 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="py-3.5 px-4 font-semibold">বাজার</th>
                  <th className="py-3.5 px-4 font-semibold">বিভাগ</th>
                  <th className="py-3.5 px-4 font-semibold">সর্বনিম্ন</th>
                  <th className="py-3.5 px-4 font-semibold">সর্বাধিক</th>
                  <th className="py-3.5 px-4 font-semibold">গড়</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {product.markets.map((m, index) => {
                  const avg = Math.round((m.min + m.max) / 2);
                  return (
                    <tr key={index} className="hover:bg-gray-50/50 transition">
                      <td className="py-3.5 px-4 font-medium text-gray-900">{m.market}</td>
                      <td className="py-3.5 px-4 text-gray-600">{m.division}</td>
                      <td className="py-3.5 px-4 text-green-700 font-medium">{m.min} টাকা</td>
                      <td className="py-3.5 px-4 text-red-600 font-medium">{m.max} টাকা</td>
                      <td className="py-3.5 px-4 font-semibold text-gray-800">{avg} টাকা</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500 text-sm">
            <p>{product.nameBn}-এর জন্য নির্দিষ্ট বাজারভিত্তিক বিস্তারিত তথ্য এই মুহূর্তে উপলব্ধ নেই।</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ProductDetailPage() {
  return (
    <div className="min-h-screen bg-[#f4f7f4]">
      <Suspense fallback={
        <div className="flex justify-center items-center h-[70vh]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-700 border-t-transparent"></div>
        </div>
      }>
        <ProductDetailContent />
      </Suspense>
    </div>
  );
}