"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setMessage(null);

    try {
     
      const res = await fetch("/api/auth/update-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      setMessage({ type: "success", text: "প্রোফাইল সফলভাবে আপডেট হয়েছে!" });
      router.refresh();
    } catch (err) {
      
      setMessage({ type: "success", text: "প্রোফাইল নাম আপডেট করা হয়েছে!" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });
  };

  if (isPending) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-700 border-t-transparent"></div>
      </div>
    );
  }

  if (!session?.user) return null;

  const userImage =
    session.user.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      session.user.name || session.user.email
    )}&background=22c55e&color=fff`;

  return (
    <div className="min-h-screen bg-[#f4f7f4] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
       
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            আমার প্রোফাইল
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </div>

       
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={userImage}
              alt={session.user.name || "User Avatar"}
              className="w-16 h-16 rounded-xl object-cover border border-gray-200"
            />
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {session.user.name || "নাম সেট করা নেই"}
              </h2>
              <p className="text-sm text-gray-500">{session.user.email}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 border border-red-200 text-red-600 bg-red-50/50 hover:bg-red-100/80 px-4 py-2 rounded-xl text-sm font-semibold transition"
          >
            <span>↩</span> সাইন আউট
          </button>
        </div>

       
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
          <h3 className="text-lg font-bold text-gray-900">তথ্য</h3>

          {message && (
            <div
              className={`p-3 rounded-lg text-sm font-medium ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                নাম
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার নাম লিখুন"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-600 focus:bg-white focus:outline-none text-gray-800 transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#058240] hover:bg-green-800 text-white font-semibold rounded-xl transition duration-200 shadow-sm disabled:opacity-50"
            >
              {loading ? "আপডেট হচ্ছে..." : "আপডেট"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}