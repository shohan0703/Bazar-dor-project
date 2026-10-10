import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f4f7f4] px-4 text-center text-[#25352c]">
      <div className="max-w-md rounded-3xl border border-[#e1e9e2] bg-white p-8 shadow-sm sm:p-10">
        
        
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#eff5ef] text-4xl">
          🔍
        </div>

       
        <h1 className="mt-6 text-5xl font-extrabold text-green-800">
          ৪১০
        </h1>

        <h2 className="mt-2 text-xl font-bold text-gray-900">
          পৃষ্ঠাটি পাওয়া যায়নি
        </h2>

        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          আপনি যে পেজটি খুঁজছেন তা মুছে ফেলা হয়েছে, অথবা ঠিকানা ভুল রয়েছে।
        </p>

      
        <div className="mt-8">
          <Link
            href="/"
            className="inline-block w-full rounded-xl bg-green-700 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>

      </div>
    </div>
  );
}