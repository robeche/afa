"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { isSupportedLanguage } from "@/lib/i18n/config";

const LANG_KEY = "afa-lang";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && isSupportedLanguage(saved)) {
      router.replace(`/${saved}`);
    }
  }, [router]);

  function saveLang(lang: string) {
    localStorage.setItem(LANG_KEY, lang);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-background)] p-6">
      <section className="w-full max-w-xl rounded-2xl border border-emerald-100 bg-white p-8 text-center shadow-sm">
        <h1 className="font-display text-3xl font-extrabold text-[var(--color-primary-dark)]">
          AFA Remontival
        </h1>
        <p className="mt-3 text-[var(--color-muted)]">
          Selecciona idioma para acceder al sitio.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/es"
            onClick={() => saveLang("es")}
            className="rounded-md bg-[var(--color-primary)] px-4 py-2 font-semibold text-white"
          >
            Entrar en castellano
          </Link>
          <Link
            href="/eu"
            onClick={() => saveLang("eu")}
            className="rounded-md bg-emerald-100 px-4 py-2 font-semibold text-[var(--color-primary-dark)]"
          >
            Euskaraz sartu
          </Link>
        </div>
      </section>
    </main>
  );
}
