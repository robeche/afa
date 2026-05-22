"use client";

import { useCallback, useEffect, useState } from "react";
import type { Lang, Noticia } from "@/types/domain";
import { useSupabaseSession } from "@/hooks/use-supabase-session";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser";
import { NewsFormModal } from "@/components/ui/news-form-modal";
import { NewsDetailModal } from "@/components/ui/news-detail-modal";

// ─── i18n ─────────────────────────────────────────────────────────────────────

const UI = {
  es: {
    newNoticia: "Nueva noticia",
    edit: "Editar",
    saberMas: "Saber más",
    noNoticias: "No hay noticias publicadas.",
    draft: "Borrador",
  },
  eu: {
    newNoticia: "Berri berria",
    edit: "Editatu",
    saberMas: "Gehiago jakin",
    noNoticias: "Ez dago argitaratutako berririk.",
    draft: "Zirriborroa",
  },
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NoticiasListProps {
  initialNoticias: Noticia[];
  lang: Lang;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function NoticiasList({ initialNoticias, lang }: NoticiasListProps) {
  const t = UI[lang];
  const { session, loading: sessionLoading } = useSupabaseSession();
  const isAdmin = session?.user.app_metadata?.role === "admin";

  const [noticias, setNoticias] = useState<Noticia[]>(initialNoticias);
  const [selectedDetail, setSelectedDetail] = useState<Noticia | null>(null);
  // null = closed, "new" = create form, Noticia = edit form
  const [editingNoticia, setEditingNoticia] = useState<Noticia | "new" | null>(null);

  const fetchNoticias = useCallback(async () => {
    const supabase = getBrowserSupabaseClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase.from("noticias") as any)
      .select("*")
      .order("fecha_publicacion", { ascending: false });
    if (!isAdmin) {
      query = query.eq("publicada", true);
    }
    const { data } = await query;
    if (data) setNoticias(data as Noticia[]);
  }, [isAdmin]);

  useEffect(() => {
    if (sessionLoading) return;
    fetchNoticias();
  }, [sessionLoading, fetchNoticias]);

  function handleSave() {
    setEditingNoticia(null);
    fetchNoticias();
  }

  return (
    <section className="space-y-5">
      {/* Admin toolbar */}
      {!sessionLoading && isAdmin && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setEditingNoticia("new")}
            className="flex items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
          >
            <i className="bi bi-plus-lg" />
            {t.newNoticia}
          </button>
        </div>
      )}

      {noticias.length === 0 ? (
        <p className="text-center text-[var(--color-muted)]">{t.noNoticias}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {noticias.map((noticia) => (
            <article
              key={noticia.id}
              className="flex flex-col rounded-xl border border-emerald-100 bg-white p-5 shadow-sm"
            >
              {!noticia.publicada && isAdmin && (
                <span className="mb-2 inline-flex w-fit items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                  <i className="bi bi-pencil-square" />
                  {t.draft}
                </span>
              )}
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                {noticia.fecha_publicacion}
              </p>
              <h2 className="mt-2 font-display text-xl font-bold text-[var(--color-primary-dark)]">
                {lang === "eu" ? noticia.titulo_eu : noticia.titulo_es}
              </h2>
              <p className="mt-2 flex-1 text-sm text-[var(--color-muted)]">
                {lang === "eu" ? noticia.resumen_eu : noticia.resumen_es}
              </p>
              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedDetail(noticia)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]"
                >
                  {t.saberMas} <i className="bi bi-arrow-right" />
                </button>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setEditingNoticia(noticia)}
                    className="ml-auto flex items-center gap-1.5 rounded-md border border-emerald-200 px-3 py-1 text-xs font-semibold text-[var(--color-primary-dark)] transition hover:bg-emerald-50"
                  >
                    <i className="bi bi-pencil" />
                    {t.edit}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selectedDetail && (
        <NewsDetailModal
          noticia={selectedDetail}
          lang={lang}
          onClose={() => setSelectedDetail(null)}
        />
      )}

      {/* Create / Edit modal */}
      {editingNoticia !== null && (
        <NewsFormModal
          noticia={editingNoticia === "new" ? undefined : editingNoticia}
          onSave={handleSave}
          onClose={() => setEditingNoticia(null)}
        />
      )}
    </section>
  );
}
