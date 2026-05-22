"use client";

import { FormEvent, useRef, useState } from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { Noticia } from "@/types/domain";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NewsFormModalProps {
  /** If provided → edit mode; otherwise → create mode. */
  noticia?: Noticia;
  onSave: () => void;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function NewsFormModal({ noticia, onSave, onClose }: NewsFormModalProps) {
  const isEdit = !!noticia;

  const [form, setForm] = useState({
    titulo_es: noticia?.titulo_es ?? "",
    titulo_eu: noticia?.titulo_eu ?? "",
    resumen_es: noticia?.resumen_es ?? "",
    resumen_eu: noticia?.resumen_eu ?? "",
    contenido_es: noticia?.contenido_es ?? "",
    contenido_eu: noticia?.contenido_eu ?? "",
    fecha_publicacion:
      noticia?.fecha_publicacion ?? new Date().toISOString().split("T")[0],
    publicada: noticia?.publicada ?? true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    noticia?.imagen_url ?? ""
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const supabase = getBrowserSupabaseClient();
      let imagen_url: string | null = imagePreview || null;

      if (imageFile) {
        const ext = imageFile.name.split(".").pop() ?? "jpg";
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("noticias")
          .upload(fileName, imageFile, { upsert: true });

        if (uploadError) {
          throw new Error(`Error al subir imagen: ${uploadError.message}`);
        }

        const { data: urlData } = supabase.storage
          .from("noticias")
          .getPublicUrl(uploadData.path);
        imagen_url = urlData.publicUrl;
      }

      const payload = {
        ...form,
        slug: slugify(form.titulo_es),
        imagen_url,
      };

      if (isEdit && noticia?.id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: dbError } = await (supabase.from("noticias") as any)
          .update(payload)
          .eq("id", noticia.id);
        if (dbError) throw new Error(dbError.message);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: dbError } = await (supabase.from("noticias") as any).insert(
          payload
        );
        if (dbError) throw new Error(dbError.message);
      }

      onSave();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error desconocido al guardar."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!noticia?.id) return;
    setDeleting(true);
    setError(null);
    try {
      const supabase = getBrowserSupabaseClient();

      if (noticia.imagen_url) {
        const url = new URL(noticia.imagen_url);
        const parts = url.pathname.split("/object/public/noticias/");
        if (parts[1]) {
          await supabase.storage.from("noticias").remove([parts[1]]);
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: dbError } = await (supabase.from("noticias") as any)
        .delete()
        .eq("id", noticia.id);
      if (dbError) throw new Error(dbError.message);

      onSave();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al eliminar la noticia."
      );
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) onClose();
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? "Editar noticia" : "Nueva noticia"}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between bg-[var(--color-primary)] px-6 py-4 text-white">
          <h2 className="font-display text-lg font-bold">
            {isEdit ? "Editar noticia" : "Nueva noticia"}
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

        {/* Scrollable form body */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 4rem)" }}
        >
          <div className="grid gap-4 p-6 sm:grid-cols-2">
            {/* Titulo ES */}
            <div>
              <label className="label-base" htmlFor="nf-titulo-es">
                Título castellano <span aria-hidden="true">*</span>
              </label>
              <input
                id="nf-titulo-es"
                type="text"
                required
                value={form.titulo_es}
                onChange={(e) => set("titulo_es", e.target.value)}
                className="input-base"
              />
            </div>

            {/* Titulo EU */}
            <div>
              <label className="label-base" htmlFor="nf-titulo-eu">
                Título euskera <span aria-hidden="true">*</span>
              </label>
              <input
                id="nf-titulo-eu"
                type="text"
                required
                value={form.titulo_eu}
                onChange={(e) => set("titulo_eu", e.target.value)}
                className="input-base"
              />
            </div>

            {/* Resumen ES */}
            <div className="sm:col-span-2">
              <label className="label-base" htmlFor="nf-resumen-es">
                Subtítulo / resumen castellano
              </label>
              <input
                id="nf-resumen-es"
                type="text"
                value={form.resumen_es}
                onChange={(e) => set("resumen_es", e.target.value)}
                className="input-base"
              />
            </div>

            {/* Resumen EU */}
            <div className="sm:col-span-2">
              <label className="label-base" htmlFor="nf-resumen-eu">
                Subtítulo / resumen euskera
              </label>
              <input
                id="nf-resumen-eu"
                type="text"
                value={form.resumen_eu}
                onChange={(e) => set("resumen_eu", e.target.value)}
                className="input-base"
              />
            </div>

            {/* Contenido ES */}
            <div className="sm:col-span-2">
              <label className="label-base" htmlFor="nf-contenido-es">
                Cuerpo castellano
              </label>
              <textarea
                id="nf-contenido-es"
                rows={5}
                value={form.contenido_es}
                onChange={(e) => set("contenido_es", e.target.value)}
                className="input-base resize-y"
              />
            </div>

            {/* Contenido EU */}
            <div className="sm:col-span-2">
              <label className="label-base" htmlFor="nf-contenido-eu">
                Cuerpo euskera
              </label>
              <textarea
                id="nf-contenido-eu"
                rows={5}
                value={form.contenido_eu}
                onChange={(e) => set("contenido_eu", e.target.value)}
                className="input-base resize-y"
              />
            </div>

            {/* Fecha publicación */}
            <div>
              <label className="label-base" htmlFor="nf-fecha">
                Fecha de publicación <span aria-hidden="true">*</span>
              </label>
              <input
                id="nf-fecha"
                type="date"
                required
                value={form.fecha_publicacion}
                onChange={(e) => set("fecha_publicacion", e.target.value)}
                className="input-base"
              />
            </div>

            {/* Imagen */}
            <div className="sm:col-span-2">
              <label className="label-base" htmlFor="nf-imagen">
                Imagen
              </label>
              <input
                id="nf-imagen"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-[var(--color-muted)]
                  file:mr-3 file:cursor-pointer file:rounded-md file:border-0
                  file:bg-[var(--color-primary)] file:px-3 file:py-1.5
                  file:text-sm file:font-semibold file:text-white
                  hover:file:bg-[var(--color-primary-dark)]"
              />
              {imagePreview && (
                <div className="mt-2 overflow-hidden rounded-lg border border-emerald-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Vista previa"
                    className="h-32 w-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Publicada */}
            <div className="sm:col-span-2 flex items-center gap-2">
              <input
                id="nf-publicada"
                type="checkbox"
                checked={form.publicada}
                onChange={(e) => set("publicada", e.target.checked)}
                className="h-4 w-4 rounded border-emerald-300 accent-[var(--color-primary)]"
              />
              <label htmlFor="nf-publicada" className="cursor-pointer text-sm font-medium">
                Publicada{" "}
                <span className="text-[var(--color-muted)]">(visible para todos)</span>
              </label>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div
              role="alert"
              className="mx-6 mb-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700"
            >
              <i className="bi bi-exclamation-triangle-fill shrink-0" />
              {error}
            </div>
          )}

          {/* Footer actions */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-emerald-100 px-6 py-4">
            {/* Delete — only in edit mode */}
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
                  Eliminar noticia
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
                {saving ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear noticia"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
