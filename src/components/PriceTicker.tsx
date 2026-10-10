"use client";

import { useEffect, useState } from "react";

interface Product {
  id: number;
  slug: string;
  nameBn: string;
  categoryIcon: string;
  unit: string;
  today: number;
  yesterday: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
}

const API_URL = "https://openapi.programming-hero.com/api/bazardor/products";

export default function PriceTicker() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Unexpected API response format");
        }

        setProducts(data as Product[]);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        console.error("Failed to load market prices:", err);
        setError(true);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="border-t border-gray-200 px-4 py-2 text-sm text-gray-500">
        বাজারদর লোড হচ্ছে...
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className="border-t border-gray-200 px-4 py-2 text-sm text-gray-600">
        বাজারদর লোড করা যাচ্ছে না।
      </div>
    );
  }

  const tickerProducts = [...products, ...products];

  return (
    <div
      className="overflow-hidden border-t border-gray-200 bg-white py-1.5 w-full"
      aria-label="আজকের বাজারদর"
    >
      <div className="flex items-center">
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="price-marquee flex items-center shrink-0">
            {tickerProducts.map((product, index) => {
              const isUp = product.change?.dir === "up";
              const isDown = product.change?.dir === "down";

              return (
                <span
                  key={`${product.id}-${index}`}
                  className="mx-4 inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-sm"
                >
                  <span>{product.categoryIcon}</span>

                  <span className="font-medium text-gray-800">
                    {product.nameBn}
                  </span>

                  <span className="font-semibold text-gray-900">
                    ৳{product.today}
                  </span>

                  <span className="text-gray-500">
                    /{product.unit === "kg" ? "কেজি" : "লিটার"}
                  </span>

                  <span
                    className={
                      isUp
                        ? "font-medium text-red-600"
                        : isDown
                          ? "font-medium text-green-700"
                          : "font-medium text-gray-500"
                    }
                  >
                    {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
                    {Math.abs(product.change?.pct || 0)}%
                  </span>

                  <span className="ml-2 text-gray-300">|</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}