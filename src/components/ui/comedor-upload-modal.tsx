"use client";

import { FormEvent, useRef, useState } from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { DocumentoComedor } from "@/types/domain";

// ─── Constants ────────────────────────────────────────────────────────────────

export const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
] as const;

function getCurrentMes() {
  return MESES[new Date().getMonth()];
}

function getCurrentYear() {
  return new Date().getFullYear();
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ComedorUploadModalProps {
  /** If provided → edit mode; otherwise → create mode. */
  documento?: DocumentoComedor;
  onSave: () => void;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ComedorUploadModal({ documento, onSave, onClose }: ComedorUploadModalProps) {
  const isEdit = !!documento;
  const currentYear = getCurrentYear();

  const [mes, setMes] = useState<string>(documento?.mes ?? getCurrentMes());
  const [anio, setAnio] = useState<number>(documento?.anio ?? currentYear);
  const [publicado, setPublicado] = useState(documento?.publicado ?? true);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const yearOptions = [currentYear - 1, currentYear, currentYear + 1];

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) onClose();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!pdfFile && !isEdit) {
      setError("Debes seleccionar un archivo PDF.");
      return;
    }
    setSaving(true);
    setError(null);

    try {
      const supabase = getBrowserSupabaseClient();
      let pdf_url: string | null = documento?.pdf_es_url ?? null;

      if (pdfFile) {
        const fileName = `${anio}-${mes.toLowerCase().replace(/ /g, "-")}-${Date.now()}.pdf`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("comedor")
          .upload(fileName, pdfFile, { upsert: true, contentType: "application/pdf" });

        if (uploadError) {
          throw new Error(`Error al subir PDF: ${uploadError.message}`);
        }

        const { data: urlData } = supabase.storage
          .from("comedor")
          .getPublicUrl(uploadData.path);
        pdf_url = urlData.publicUrl;
      }

      const payload = { mes, anio, pdf_es_url: pdf_url, pdf_eu_url: pdf_url, publicado };

      if (isEdit && documento?.id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: dbError } = await (supabase.from("documentos_comedor") as any)
          .update(payload)
          .eq("id", documento.id);
        if (dbError) throw new Error(dbError.message);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: dbError } = await (supabase.from("documentos_comedor") as any)
          .insert(payload);
        if (dbError) throw new Error(dbError.message);
      }

      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido al guardar.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!documento?.id) return;
    setDeleting(true);
    setError(null);
    try {
      const supabase = getBrowserSupabaseClient();

      if (documento.pdf_es_url) {
        const url = new URL(documento.pdf_es_url);
        const parts = url.pathname.split("/object/public/comedor/");
        if (parts[1]) {
          await supabase.storage.from("comedor").remove([parts[1]]);
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: dbError } = await (supabase.from("documentos_comedor") as any)
        .delete()
        .eq("id", documento.id);
      if (dbError) throw new Error(dbError.message);

      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar el documento.");
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? "Editar menú" : "Subir menú del comedor"}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div className="flex w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between bg-[var(--color-primary)] px-6 py-4 text-white">
          <h2 className="font-display text-lg font-bold">
            {isEdit ? "Editar menú" : "Subir menú del comedor"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-full p-1 transition hover:bg-white/20"
          >
            <i className="bi bi-x-lg text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
          {/* Mes */}
          <div>
            <label className="label-base" htmlFor="cf-mes">
              Mes <span aria-hidden="true">*</span>
            </label>
            <select
              id="cf-mes"
              required
              value={mes}
              onChange={(e) => setMes(e.target.value)}
              className="input-base"
            >
              {MESES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Año */}
          <div>
            <label className="label-base" htmlFor="cf-anio">
              Año <span aria-hidden="true">*</span>
            </label>
            <select
              id="cf-anio"
              required
              value={anio}
              onChange={(e) => setAnio(Number(e.target.value))}
              className="input-base"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* PDF */}
          <div>
            <label className="label-base" htmlFor="cf-pdf">
              Archivo PDF {!isEdit && <span aria-hidden="true">*</span>}
            </label>
            {isEdit && documento?.pdf_es_url && (
              <p className="mb-2 text-xs text-[var(--color-muted)]">
                <i className="bi bi-check-circle-fill mr-1 text-emerald-600" />
                PDF ya subido. Selecciona uno nuevo para reemplazarlo.
              </p>
            )}
            <input
              id="cf-pdf"
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-[var(--color-muted)]
                file:mr-3 file:cursor-pointer file:rounded-md file:border-0
                file:bg-[var(--color-primary)] file:px-3 file:py-1.5
                file:text-sm file:font-semibold file:text-white
                hover:file:bg-[var(--color-primary-dark)]"
            />
          </div>

          {/* Publicado */}
          <div className="flex items-center gap-2">
            <input
              id="cf-publicado"
              type="checkbox"
              checked={publicado}
              onChange={(e) => setPublicado(e.target.checked)}
              className="h-4 w-4 rounded border-emerald-300 accent-[var(--color-primary)]"
            />
            <label htmlFor="cf-publicado" className="cursor-pointer text-sm font-medium">
              Publicado{" "}
              <span className="text-[var(--color-muted)]">(visible para todos)</span>
            </label>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700"
            >
              <i className="bi bi-exclamation-triangle-fill shrink-0" />
              {error}
            </div>
          )}

          {/* Footer */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-emerald-100 pt-4">
            {isEdit && (
              confirmDelete ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-red-600">¿Eliminar?</span>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                  >
                    {deleting && <i className="bi bi-arrow-clockwise animate-spin" />}
                    Sí, eliminar
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <i className="bi bi-trash3" />
                  Eliminar menú
                </button>
              )
            )}

            <div className="ml-auto flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)] disabled:opacity-60"
              >
                {saving && <i className="bi bi-arrow-clockwise animate-spin" />}
                {saving ? "Guardando…" : isEdit ? "Guardar cambios" : "Subir menú"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
