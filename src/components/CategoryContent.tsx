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


const categorySlugMap: Record<string, string[]> = {
  chal: ["chal", "চাল", "rice"],
  dal: ["dal", "ডাল", "pulses"],
  tel: ["tel", "তেল", "oil"],
  sobji: ["sobji", "সবজি", "vegetables"],
  mach: ["mach", "মাছ", "fish"],
  mangsho: ["mangsho", "মাংস", "meat"],
  "dim-dudh": [
    "dim-dudh",
    "dim_dudh",
    "dimdudh",
    "ডিম-দুধ",
    "ডিম ও দুধ",
    "ডিম",
    "দুধ",
    "dim",
    "dudh",
    "egg",
    "milk",
    "dairy",
  ],
  moshla: ["moshla", "মসলা", "masala", "spices", "mosla"],
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

export default async function CategoryContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = categories[slug];

  if (!category) {
    notFound();
  }

  let products: Product[] = [];

  try {
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

      const targetKeywords = categorySlugMap[slug] || [slug, category.name];

      products = allProducts.filter((product) => {
        const prodCat = (product.category || "").toLowerCase();
       
        return targetKeywords.some((keyword) => {
          const lowerKw = keyword.toLowerCase();
          return (
            prodCat === lowerKw ||
            prodCat.includes(lowerKw) ||
            lowerKw.includes(prodCat)
          );
        });
      });
    }
  } catch (error) {
    console.error("Products fetch failed:", error);
  }

  return (
    <>
      <section className="flex items-center gap-3 rounded-xl border border-[#e2eae3] bg-[#fbfdfb] px-4 py-4 sm:px-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0f3ef] text-2xl">
          {category.emoji}
        </span>

        <div>
          <h1 className="text-xl font-bold text-[#25352c]">
            {category.name}
          </h1>
          <p className="text-xs text-gray-500">
            {products.length}টি পণ্যের আজকের দাম ও পরিবর্তন
          </p>
        </div>
      </section>

      <section className="mt-4">
        <CategoryProducts
          products={products}
          categoryName={category.name}
        />
      </section>
    </>
  );
}