
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

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
  products: Product[];
  categoryName: string;
};

const money = (amount: number) =>
  new Intl.NumberFormat("bn-BD").format(amount);

export default function CategoryProducts({
  products,
  categoryName,
}: Props) {
  const [sort, setSort] = useState("default");

  const sortedProducts = useMemo(() => {
    const result = [...products];

    if (sort === "low") {
      result.sort((a, b) => a.today - b.today);
    } else if (sort === "high") {
      result.sort((a, b) => b.today - a.today);
    } else if (sort === "name") {
      result.sort((a, b) =>
        a.nameBn.localeCompare(b.nameBn, "bn")
      );
    }

    return result;
  }, [products, sort]);

  return (
    <>
      
      <div className="flex min-h-[48px] items-center justify-between gap-3 rounded-xl border border-[#e2eae3] bg-[#fbfdfb] px-4 py-2">
        <span className="text-xs text-gray-500">
          সাজান
        </span>

        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          aria-label="পণ্য সাজান"
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 outline-none focus:border-green-600"
        >
          <option value="default">ডিফল্ট</option>
          <option value="low">দাম: কম থেকে বেশি</option>
          <option value="high">দাম: বেশি থেকে কম</option>
          <option value="name">নাম অনুযায়ী</option>
        </select>
      </div>

      <p className="mb-3 mt-4 text-xs text-gray-500">
        {categoryName} এর পণ্য দেখানো হচ্ছে
      </p>

      {sortedProducts.length === 0 ? (
        <div className="rounded-xl border border-[#e2eae3] bg-[#fbfdfb] px-4 py-12 text-center">
          <p className="text-3xl">🧺</p>
          <h2 className="mt-3 font-semibold text-[#25352c]">
            এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            API-এর category value যাচাই করে দেখো।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProducts.map((product) => {
            const direction = product.change?.dir ?? "flat";
            const percentage = product.change?.pct ?? 0;

            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group rounded-xl border border-[#e2eae3] bg-[#fbfdfb] p-3 transition hover:-translate-y-0.5 hover:border-green-300 hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0f3ef] text-xl">
                    {product.categoryIcon || "🛒"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-sm font-semibold text-[#25352c] group-hover:text-green-800">
                      {product.nameBn}
                    </h2>
                    <p className="text-[11px] text-gray-500">
                      প্রতি {product.unit}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-end justify-between gap-2">
                  <div>
                    <p className="text-[11px] text-gray-500">
                      বাজারদর
                    </p>
                    <p className="mt-0.5 text-base font-bold text-[#25352c]">
                      {money(product.today)} টাকা
                    </p>
                  </div>

                  <span
                    className={`mb-0.5 whitespace-nowrap rounded-full px-2 py-1 text-[10px] font-semibold ${
                      direction === "up"
                        ? "bg-red-50 text-red-600"
                        : direction === "down"
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {direction === "up"
                      ? "▲ "
                      : direction === "down"
                        ? "▼ "
                        : "— "}
                    {money(percentage)}%
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
