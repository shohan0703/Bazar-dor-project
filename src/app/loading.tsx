
import { ProductGridSkeleton } from "@/components/ProductSkeleton";

export default function Loading() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">বাজার দর লোড হচ্ছে...</h2>
      <ProductGridSkeleton />
    </main>
  );
}