"use client";

import { useEffect, useState } from "react";
import type { Consejo, Lang } from "@/types/domain";
import { useSupabaseSession } from "@/hooks/use-supabase-session";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser";
import { ConsejoFormModal } from "./consejo-form-modal";

// ─── Props ────────────────────────────────────────────────────────────────────

interface ConsejosListProps {
  initialConsejos: Consejo[];
  lang: Lang;
}

// ─── Strip HTML for excerpt ───────────────────────────────────────────────────

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

// ─── Detail modal ─────────────────────────────────────────────────────────────

function ConsejoDetailModal({ consejo, lang, onClose }: { consejo: Consejo; lang: Lang; onClose: () => void }) {
  const title = lang === "eu" ? consejo.titulo_eu : consejo.titulo_es;
  const content = lang === "eu" ? consejo.contenido_eu : consejo.contenido_es;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between bg-[var(--color-primary)] px-6 py-4 text-white">
          <h2 className="font-display text-lg font-bold leading-snug">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Cerrar"
            className="rounded-full p-1 transition hover:bg-white/20">
            <i className="bi bi-x-lg text-xl" />
          </button>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: "calc(90vh - 4rem)" }}>
          {consejo.imagen_url && (
            <div className="h-52 w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={consejo.imagen_url} alt={title} className="h-full w-full object-cover" />
            </div>
          )}
          <div
            className="prose prose-sm max-w-none p-6 prose-headings:text-[var(--color-primary-dark)] prose-a:text-[var(--color-primary)]"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ConsejosList({ initialConsejos, lang }: ConsejosListProps) {
  const { session, loading: sessionLoading } = useSupabaseSession();
  const isAdmin = session?.user.app_metadata?.role === "admin";

  const [consejos, setConsejos] = useState<Consejo[]>(initialConsejos);
  const [showForm, setShowForm] = useState(false);
  const [editConsejo, setEditConsejo] = useState<Consejo | undefined>();
  const [detailConsejo, setDetailConsejo] = useState<Consejo | null>(null);

  const t = {
    es: { new: "Nueva entrada", edit: "Editar", read: "Leer más", empty: "No hay entradas publicadas." },
    eu: { new: "Sarrera berria", edit: "Editatu", read: "Irakurri gehiago", empty: "Ez dago argitaratutako sarrerarik." },
  }[lang];

  async function fetchConsejos() {
    const supabase = getBrowserSupabaseClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase.from("consejos") as any)
      .select("*")
      .order("orden", { ascending: true })
      .order("created_at", { ascending: false });
    if (!isAdmin) query = query.eq("publicado", true);
    const { data, error } = await query;
    if (error) { console.error("[AFA] Error consejos:", error); return; }
    setConsejos((data as Consejo[]) ?? []);
  }

  useEffect(() => {
    if (sessionLoading) return;
    fetchConsejos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, sessionLoading]);

  function openCreate() { setEditConsejo(undefined); setShowForm(true); }
  function openEdit(c: Consejo) { setEditConsejo(c); setShowForm(true); }
  function handleSave() { setShowForm(false); fetchConsejos(); }

  return (
    <>
      {/* Admin toolbar */}
      {isAdmin && (
        <div className="mb-4 flex justify-end">
          <button onClick={openCreate}
            className="flex items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]">
            <i className="bi bi-plus-lg" />
            {t.new}
          </button>
        </div>
      )}

      {/* Grid */}
      {consejos.length === 0 ? (
        <p className="text-center text-[var(--color-muted)]">{t.empty}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {consejos.map((c) => {
            const title = lang === "eu" ? c.titulo_eu : c.titulo_es;
            const content = lang === "eu" ? c.contenido_eu : c.contenido_es;
            const excerpt = stripHtml(content).slice(0, 160);

            return (
              <article key={String(c.id)}
                className={[
                  "flex flex-col overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-sm transition hover:shadow-md",
                  !c.publicado ? "opacity-60 ring-1 ring-amber-300" : "",
                ].join(" ")}>
                {/* Cover image */}
                {c.imagen_url && (
                  <div className="h-44 w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.imagen_url} alt={title} className="h-full w-full object-cover" />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-5">
                  {/* Draft badge */}
                  {!c.publicado && (
                    <span className="mb-2 inline-flex w-fit items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                      <i className="bi bi-eye-slash" /> Borrador
                    </span>
                  )}

                  <h2 className="font-display text-lg font-bold leading-snug text-[var(--color-primary-dark)]">
                    {title}
                  </h2>
                  {excerpt && (
                    <p className="mt-2 line-clamp-3 flex-1 text-sm text-[var(--color-muted)]">
                      {excerpt}
                    </p>
                  )}

                  <div className="mt-4 flex items-center gap-2">
                    <button onClick={() => setDetailConsejo(c)}
                      className="flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)] transition hover:text-[var(--color-primary-dark)]">
                      <i className="bi bi-arrow-right-circle" />
                      {t.read}
                    </button>
                    {isAdmin && (
                      <button onClick={() => openEdit(c)} title={t.edit}
                        className="ml-auto rounded p-1 text-[var(--color-muted)] transition hover:text-[var(--color-primary)]">
                        <i className="bi bi-pencil text-sm" />
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <ConsejoFormModal consejo={editConsejo} onSave={handleSave} onClose={() => setShowForm(false)} />
      )}

      {/* Detail modal */}
      {detailConsejo && (
        <ConsejoDetailModal consejo={detailConsejo} lang={lang} onClose={() => setDetailConsejo(null)} />
      )}
    </>
  );
}
