
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#e1e9e2] bg-[#fbfdfb] px-4 py-5">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-xs text-gray-600 sm:flex-row">
        <Link href="/" className="hover:text-green-700">
          বাজার দর — বাংলাদেশের বাজার দামের এক নজর।
        </Link>

        <p>
          সকল দাম সম্ভাব্য; বাজার অবস্থার উপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
}
