import { Suspense } from "react";
import Link from "next/link";
import CategoryContent from "@/components/CategoryContent";

type Props = {
  params: Promise<{ slug: string }>;
};

export default function CategoryPage({ params }: Props) {
  return (
    <main className="min-h-screen bg-[#f0f6f1] px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <Suspense
          fallback={
            <div className="py-12 text-center text-gray-500">
              পণ্য ও বাজারদর লোড হচ্ছে...
            </div>
          }
        >
          <CategoryContent params={params} />
        </Suspense>

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