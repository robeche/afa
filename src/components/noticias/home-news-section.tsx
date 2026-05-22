"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Lang, Noticia } from "@/types/domain";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser";
import { NewsDetailModal } from "@/components/ui/news-detail-modal";
import { mockNoticias } from "@/lib/utils/mock-content";

const UI = {
  es: {
    readMore: "más",
    saberMas: "Saber más",
    newsHint: "novedades",
  },
  eu: {
    readMore: "gehiago",
    saberMas: "Gehiago jakin",
    newsHint: "berriak",
  },
} as const;

export interface HomeNewsSectionProps {
  lang: Lang;
  menuLabel: string;
}

export function HomeNewsSection({ lang, menuLabel }: HomeNewsSectionProps) {
  const t = UI[lang];
  const [noticias, setNoticias] = useState<Noticia[]>(mockNoticias.slice(0, 2));
  const [selectedDetail, setSelectedDetail] = useState<Noticia | null>(null);

  useEffect(() => {
    async function fetchNoticias() {
      const supabase = getBrowserSupabaseClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase.from("noticias") as any)
        .select("*")
        .eq("publicada", true)
        .order("fecha_publicacion", { ascending: false })
        .limit(2);
      if (data && data.length > 0) setNoticias(data as Noticia[]);
    }
    fetchNoticias();
  }, []);

  return (
    <>
      <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm md:p-6">
        <h2 className="font-display text-3xl font-extrabold text-[var(--color-primary-dark)]">
          {menuLabel}
          <span className="ml-2 text-xl font-medium lowercase text-[var(--color-muted)]">
            o {t.newsHint}?
          </span>
        </h2>

        <div className="mt-5 space-y-4">
          {noticias.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50/40"
            >
              <div className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                  {item.fecha_publicacion}
                </p>
                <h3 className="mt-1 font-display text-xl font-bold text-[var(--color-primary-dark)]">
                  {lang === "eu" ? item.titulo_eu : item.titulo_es}
                </h3>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  {lang === "eu" ? item.resumen_eu : item.resumen_es}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedDetail(item)}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)]"
                >
                  {t.saberMas} <i className="bi bi-arrow-right text-xs" />
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <Link
            href={`/${lang}/noticias`}
            className="rounded-md border border-emerald-300 px-3 py-2 text-sm font-semibold text-[var(--color-primary-dark)] hover:bg-emerald-50"
          >
            {t.readMore}
          </Link>
        </div>
      </div>

      {selectedDetail && (
        <NewsDetailModal
          noticia={selectedDetail}
          lang={lang}
          onClose={() => setSelectedDetail(null)}
        />
      )}
    </>
  );
}
