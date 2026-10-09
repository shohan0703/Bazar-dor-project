
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";


const categories = [
  { name: "চাল", emoji: "🍚", slug: "chal" },
  { name: "ডাল", emoji: "🫘", slug: "dal" },
  { name: "তেল", emoji: "🛢️", slug: "tel" },
  { name: "সবজি", emoji: "🥬", slug: "sobji" },
  { name: "মাছ", emoji: "🐟", slug: "mach" },
  { name: "মাংস", emoji: "🍗", slug: "mangsho" },
  { name: "ডিম-দুধ", emoji: "🥛", slug: "dim-dudh" },
  { name: "মসলা", emoji: "🌶️", slug: "moshla" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [banglaDate, setBanglaDate] = useState("");

  useEffect(() => {
    const date = new Intl.DateTimeFormat("bn-BD", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());

    setBanglaDate(date);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-[#f9fcfa]">
      
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2">
        <Link
          href="/"
          aria-label="বাজার দর হোম"
          className="flex min-w-0 items-center gap-2"
        >
          <img
            src="/logo-icon.png"
            alt="বাজার দর লোগো"
            className="h-9 w-9 shrink-0 object-contain"
          />

          <div className="min-w-0">
            <h1 className="text-base font-bold leading-tight text-[#25352c] sm:text-lg">
              বাজার দর
            </h1>

            <p className="mt-0.5 text-[10px] text-gray-600">
              {banglaDate || "\u00A0"}
            </p>
          </div>
        </Link>

        {/* Sign in and sign up */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          <Link
            href="/login"
            className="rounded-lg px-2 py-2 text-xs font-semibold text-gray-800 transition hover:bg-gray-100 sm:px-3 sm:text-sm"
          >
            সাইন ইন
          </Link>

          <Link
            href="/register"
            className="rounded-lg bg-green-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-800 sm:px-4 sm:text-sm"
          >
            সাইন আপ
          </Link>
        </div>
      </div>

     
      <nav
        aria-label="পণ্যের ক্যাটাগরি"
        className="border-t border-gray-200/70"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-start gap-2 overflow-x-auto px-3 py-1.5 sm:gap-4">
          {categories.map((category) => {
            const href = "/categories/" + category.slug;

            const isActive =
              pathname === href ||
              pathname.startsWith(href + "/");

            return (
              <Link
                key={category.slug}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={
                  "shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs transition sm:text-sm " +
                  (isActive
                    ? "bg-green-100 font-semibold text-green-800"
                    : "text-gray-700 hover:bg-green-50 hover:text-green-800")
                }
              >
                <span className="mr-1" aria-hidden="true">
                  {category.emoji}
                </span>

                {category.name}
              </Link>
            );
          })}
        </div>
      </nav>

    
      
    </header>
  );
}
