
import Link from "next/link";

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

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = categories[slug];

  return (
    <main className="min-h-screen bg-[#f0f6f1] px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="text-sm text-green-700 hover:underline"
        >
          ← হোম পেজ
        </Link>

        <h1 className="mt-5 text-3xl font-bold text-[#25352c]">
          {category
            ? `${category.emoji} ${category.name} এর বাজারদর`
            : "ক্যাটাগরি পাওয়া যায়নি"}
        </h1>

        <p className="mt-2 text-gray-600">
          {category
            ? `${category.name} বিভাগের আজকের বাজারদর।`
            : `প্রাপ্ত slug: ${slug}`}
        </p>

        <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
          {category
            ? "Category route কাজ করছে। এখন এখানে পণ্যের তালিকা যোগ করা যাবে।"
            : "URL-এর slug categories তালিকার সঙ্গে মেলেনি।"}
        </section>
      </div>
    </main>
  );
}
