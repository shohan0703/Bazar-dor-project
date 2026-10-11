
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import { toast } from "react-hot-toast";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (searchParams.get("error") === "unauthorized") {
      toast.error("এই পেজটি দেখতে প্রথমে লগইন করুন!", {
        id: "unauthorized-toast",
        duration: 4000,
      });

      window.history.replaceState({}, "", "/login");
    }
  }, [searchParams]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await signIn.email({
        email,
        password,
      });

      if (res.error) {
        const message =
          res.error.message || "ইমেইল বা পাসওয়ার্ড ভুল হয়েছে!";

        setErrorMessage(message);
        toast.error(message);
        return;
      }

      toast.success("সফলভাবে লগইন হয়েছে!");
      router.replace("/");
      router.refresh();
    } catch {
      const message =
        "লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন!";

      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialSignIn(
    provider: "google" | "github"
  ) {
    try {
      toast.loading(
        `${provider === "google" ? "Google" : "GitHub"} দিয়ে সাইন ইন হচ্ছে...`,
        { id: "social-login" }
      );

      await signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch {
      toast.dismiss("social-login");
      toast.error("সোশাল সাইন-ইন ব্যর্থ হয়েছে!");
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-emerald-50/40 py-12 sm:px-6 lg:px-8">
      <div className="text-center sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-3xl font-extrabold text-emerald-950">
          স্বাগতম বাজার দর-এ
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          আপনার অ্যাকাউন্টে সাইন ইন করুন
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-emerald-100 bg-white px-4 py-8 shadow-xl sm:px-10">
          {errorMessage && (
            <div
              role="alert"
              className="mb-4 rounded border-l-4 border-red-500 bg-red-50 p-3 text-sm text-red-700"
            >
              {errorMessage}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                ইমেইল
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                পাসওয়ার্ড
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white shadow-md transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন করুন"}
            </button>
          </form>

          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                অথবা
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialSignIn("google")}
              className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Google
            </button>

            <button
              type="button"
              onClick={() => handleSocialSignIn("github")}
              className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              GitHub
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            নতুন অ্যাকাউন্ট তৈরি করতে চান?{" "}
            <Link
              href="/register"
              className="font-semibold text-emerald-600 hover:text-emerald-500"
            >
              সাইন আপ করুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-emerald-50/40">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
