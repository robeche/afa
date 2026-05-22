"use client";

import { useCallback, useEffect, useState } from "react";
import type { DocumentoComedor, Lang } from "@/types/domain";
import { useSupabaseSession } from "@/hooks/use-supabase-session";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser";
import { ComedorUploadModal, MESES } from "@/components/ui/comedor-upload-modal";

// ─── i18n ─────────────────────────────────────────────────────────────────────

const MESES_EU = [
  "Urtarrila", "Otsaila", "Martxoa", "Apirila", "Maiatza", "Ekaina",
  "Uztaila", "Abuztua", "Iraila", "Urria", "Azaroa", "Abendua",
] as const;

const UI = {
  es: {
    currentMenu: "Menú del mes",
    download: "Descargar PDF",
    noMenu: "No hay menú publicado para este mes.",
    uploadMenu: "Subir menú",
    edit: "Editar",
    archiveTitle: "Archivo de menús",
    draft: "Borrador",
    noMenus: "No hay menús subidos.",
  },
  eu: {
    currentMenu: "Hileko menua",
    download: "PDF deskargatu",
    noMenu: "Ez dago hilabete honetarako argitaratutako menurik.",
    uploadMenu: "Menua igo",
    edit: "Editatu",
    archiveTitle: "Menuen artxiboa",
    draft: "Zirriborroa",
    noMenus: "Ez dago menirik igota.",
  },
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** ES month name for the current month (matches DB values). */
function currentMesES() {
  return MESES[new Date().getMonth()];
}

function currentYear() {
  return new Date().getFullYear();
}

/** Returns display-language month name given the stored ES name. */
function mesDisplayName(mesES: string, lang: Lang): string {
  const idx = (MESES as readonly string[]).indexOf(mesES);
  if (idx < 0) return mesES;
  return lang === "eu" ? MESES_EU[idx] : mesES;
}

/** Sort docs most-recent first using year + month index. */
function sortDocs(docs: DocumentoComedor[]): DocumentoComedor[] {
  return [...docs].sort((a, b) => {
    if (b.anio !== a.anio) return b.anio - a.anio;
    return (
      (MESES as readonly string[]).indexOf(b.mes) -
      (MESES as readonly string[]).indexOf(a.mes)
    );
  });
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ComedorSectionProps {
  lang: Lang;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ComedorSection({ lang }: ComedorSectionProps) {
  const t = UI[lang];
  const { session, loading: sessionLoading } = useSupabaseSession();
  const isAdmin = session?.user.app_metadata?.role === "admin";

  const [currentDoc, setCurrentDoc] = useState<DocumentoComedor | null>(null);
  const [allDocs, setAllDocs] = useState<DocumentoComedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDoc, setEditingDoc] = useState<DocumentoComedor | "new" | null>(null);

  const mes = currentMesES();
  const year = currentYear();

  const fetchDocs = useCallback(async () => {
    const supabase = getBrowserSupabaseClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase.from("documentos_comedor") as any)
      .select("*")
      .order("anio", { ascending: false })
      .order("created_at", { ascending: false });
    if (!isAdmin) {
      query = query.eq("publicado", true);
    }
    const { data } = await query;
    if (data) {
      const docs = data as DocumentoComedor[];
      setAllDocs(docs);
      setCurrentDoc(
        docs.find((d) => d.mes === mes && d.anio === year) ?? null
      );
    }
    setLoading(false);
  }, [isAdmin, mes, year]);

  useEffect(() => {
    if (sessionLoading) return;
    fetchDocs();
  }, [sessionLoading, fetchDocs]);

  function handleSave() {
    setEditingDoc(null);
    setLoading(true);
    fetchDocs();
  }

  const pdfUrl = currentDoc?.pdf_es_url ?? null;
  const currentMesLabel = mesDisplayName(mes, lang);
  const sortedDocs = sortDocs(allDocs);

  return (
    <div className="space-y-6">
      {/* ── Current month PDF viewer ────────────────────────────────────── */}
      <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-bold text-[var(--color-primary-dark)]">
            {t.currentMenu} — {currentMesLabel} {year}
          </h2>
          {!sessionLoading && isAdmin && (
            <button
              type="button"
              onClick={() => setEditingDoc("new")}
              className="flex items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
            >
              <i className="bi bi-cloud-upload" />
              {t.uploadMenu}
            </button>
          )}
        </div>

        {loading ? (
          <div className="h-64 animate-pulse rounded-xl bg-emerald-50" />
        ) : pdfUrl ? (
          <div className="space-y-3">
            {/* PDF iframe viewer */}
            <div className="overflow-hidden rounded-xl border border-emerald-100 bg-gray-50">
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=0`}
                title={`Menú ${currentMesLabel} ${year}`}
                className="h-[60vh] min-h-[420px] w-full"
              />
            </div>
            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2">
              {isAdmin && currentDoc && (
                <button
                  type="button"
                  onClick={() => setEditingDoc(currentDoc)}
                  className="flex items-center gap-1.5 rounded-lg border border-emerald-200 px-3 py-2 text-sm font-semibold text-[var(--color-primary-dark)] transition hover:bg-emerald-50"
                >
                  <i className="bi bi-pencil" />
                  {t.edit}
                </button>
              )}
              <a
                href={pdfUrl}
                download
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
              >
                <i className="bi bi-download" />
                {t.download}
              </a>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-[var(--color-muted)]">
            <i className="bi bi-file-earmark-pdf text-5xl opacity-25" />
            <p>{t.noMenu}</p>
          </div>
        )}
      </div>

      {/* ── Admin: full archive ──────────────────────────────────────────── */}
      {!sessionLoading && isAdmin && (
        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm space-y-3">
          <h3 className="font-bold text-[var(--color-primary-dark)]">
            <i className="bi bi-archive mr-2" />
            {t.archiveTitle}
          </h3>

          {sortedDocs.length === 0 ? (
            <p className="text-sm text-[var(--color-muted)]">{t.noMenus}</p>
          ) : (
            <div className="divide-y divide-emerald-50">
              {sortedDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="flex items-center gap-3">
                    <i className="bi bi-file-earmark-pdf text-xl text-red-500" />
                    <div>
                      <p className="font-medium text-[var(--color-primary-dark)]">
                        {mesDisplayName(doc.mes, lang)} {doc.anio}
                      </p>
                      {!doc.publicado && (
                        <span className="text-xs font-semibold text-amber-600">
                          <i className="bi bi-pencil-square mr-0.5" />
                          {t.draft}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {doc.pdf_es_url && (
                      <a
                        href={doc.pdf_es_url}
                        download
                        target="_blank"
                        rel="noreferrer"
                        title="Descargar"
                        className="rounded-md border border-emerald-200 p-1.5 text-[var(--color-primary)] transition hover:bg-emerald-50"
                      >
                        <i className="bi bi-download text-sm" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => setEditingDoc(doc)}
                      className="flex items-center gap-1 rounded-md border border-emerald-200 px-2.5 py-1.5 text-xs font-semibold text-[var(--color-primary-dark)] transition hover:bg-emerald-50"
                    >
                      <i className="bi bi-pencil" />
                      {t.edit}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Upload / edit modal */}
      {editingDoc !== null && (
        <ComedorUploadModal
          documento={editingDoc === "new" ? undefined : editingDoc}
          onSave={handleSave}
          onClose={() => setEditingDoc(null)}
        />
      )}
    </div>
  );
}
