"use client";

import { FormEvent, useRef, useState } from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { Actividad } from "@/types/domain";

// ─── Constants ────────────────────────────────────────────────────────────────

const TIPOS = [
  { value: "Taller", label: "Taller" },
  { value: "Excursion", label: "Excursión" },
  { value: "Reunion", label: "Reunión" },
  { value: "Festival", label: "Festival" },
  { value: "Comunidad", label: "Evento social" },
] as const;

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

export interface ActivityFormModalProps {
  /** If provided → edit mode; otherwise → create mode. */
  activity?: Actividad;
  onSave: () => void;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ActivityFormModal({ activity, onSave, onClose }: ActivityFormModalProps) {
  const isEdit = !!activity;

  const [form, setForm] = useState({
    titulo_es: activity?.titulo_es ?? "",
    titulo_eu: activity?.titulo_eu ?? "",
    tipo: activity?.tipo ?? "Taller",
    fecha_inicio: activity?.fecha_inicio ?? "",
    hora_inicio: activity?.hora_inicio ?? "",
    ubicacion: activity?.ubicacion ?? "",
    descripcion_es: activity?.descripcion_es ?? "",
    descripcion_eu: activity?.descripcion_eu ?? "",
    publicada: activity?.publicada ?? true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(activity?.imagen_url ?? "");
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

      // Upload image to Supabase Storage if a file was selected
      if (imageFile) {
        const ext = imageFile.name.split(".").pop() ?? "jpg";
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("actividades")
          .upload(fileName, imageFile, { upsert: true });

        if (uploadError) {
          throw new Error(`Error al subir imagen: ${uploadError.message}`);
        }

        const { data: urlData } = supabase.storage
          .from("actividades")
          .getPublicUrl(uploadData.path);
        imagen_url = urlData.publicUrl;
      }

      const payload = {
        ...form,
        slug: slugify(form.titulo_es),
        imagen_url,
      };

      if (isEdit && activity?.id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: dbError } = await (supabase.from("actividades") as any)
          .update(payload)
          .eq("id", activity.id);
        if (dbError) throw new Error(dbError.message);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: dbError } = await (supabase.from("actividades") as any)
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
    if (!activity?.id) return;
    setDeleting(true);
    setError(null);
    try {
      const supabase = getBrowserSupabaseClient();

      // Delete image from Storage if it exists
      if (activity.imagen_url) {
        const url = new URL(activity.imagen_url);
        // Path is everything after /object/public/actividades/
        const parts = url.pathname.split("/object/public/actividades/");
        if (parts[1]) {
          await supabase.storage.from("actividades").remove([parts[1]]);
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: dbError } = await (supabase.from("actividades") as any)
        .delete()
        .eq("id", activity.id);
      if (dbError) throw new Error(dbError.message);

      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar la actividad.");
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  // Close when clicking the dark overlay (but not the modal itself)
  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) {
      onClose();
    }
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? "Editar actividad" : "Nueva actividad"}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between bg-[var(--color-primary)] px-6 py-4 text-white">
          <h2 className="font-display text-lg font-bold">
            {isEdit ? "Editar actividad" : "Nueva actividad"}
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
              <label className="label-base" htmlFor="af-titulo-es">
                Título castellano <span aria-hidden="true">*</span>
              </label>
              <input
                id="af-titulo-es"
                type="text"
                required
                value={form.titulo_es}
                onChange={(e) => set("titulo_es", e.target.value)}
                className="input-base"
              />
            </div>

            {/* Titulo EU */}
            <div>
              <label className="label-base" htmlFor="af-titulo-eu">
                Título euskera <span aria-hidden="true">*</span>
              </label>
              <input
                id="af-titulo-eu"
                type="text"
                required
                value={form.titulo_eu}
                onChange={(e) => set("titulo_eu", e.target.value)}
                className="input-base"
              />
            </div>

            {/* Tipo */}
            <div>
              <label className="label-base" htmlFor="af-tipo">
                Tipo de actividad <span aria-hidden="true">*</span>
              </label>
              <select
                id="af-tipo"
                required
                value={form.tipo}
                onChange={(e) => set("tipo", e.target.value)}
                className="input-base"
              >
                {TIPOS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Ubicacion */}
            <div>
              <label className="label-base" htmlFor="af-ubicacion">
                Lugar
              </label>
              <input
                id="af-ubicacion"
                type="text"
                value={form.ubicacion}
                onChange={(e) => set("ubicacion", e.target.value)}
                className="input-base"
              />
            </div>

            {/* Fecha inicio */}
            <div>
              <label className="label-base" htmlFor="af-fecha-inicio">
                Fecha <span aria-hidden="true">*</span>
              </label>
              <input
                id="af-fecha-inicio"
                type="date"
                required
                value={form.fecha_inicio}
                onChange={(e) => set("fecha_inicio", e.target.value)}
                className="input-base"
              />
            </div>

            {/* Hora inicio */}
            <div>
              <label className="label-base" htmlFor="af-hora-inicio">
                Hora de inicio
              </label>
              <input
                id="af-hora-inicio"
                type="time"
                value={form.hora_inicio}
                onChange={(e) => set("hora_inicio", e.target.value)}
                className="input-base"
              />
            </div>

            {/* Descripcion ES */}
            <div className="sm:col-span-2">
              <label className="label-base" htmlFor="af-desc-es">
                Descripción castellano <span aria-hidden="true">*</span>
              </label>
              <textarea
                id="af-desc-es"
                required
                rows={3}
                value={form.descripcion_es}
                onChange={(e) => set("descripcion_es", e.target.value)}
                className="input-base resize-none"
              />
            </div>

            {/* Descripcion EU */}
            <div className="sm:col-span-2">
              <label className="label-base" htmlFor="af-desc-eu">
                Descripción euskera <span aria-hidden="true">*</span>
              </label>
              <textarea
                id="af-desc-eu"
                required
                rows={3}
                value={form.descripcion_eu}
                onChange={(e) => set("descripcion_eu", e.target.value)}
                className="input-base resize-none"
              />
            </div>

            {/* Imagen */}
            <div className="sm:col-span-2">
              <label className="label-base" htmlFor="af-imagen">
                Imagen
              </label>
              <input
                id="af-imagen"
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
                id="af-publicada"
                type="checkbox"
                checked={form.publicada}
                onChange={(e) => set("publicada", e.target.checked)}
                className="h-4 w-4 rounded border-emerald-300 accent-[var(--color-primary)]"
              />
              <label htmlFor="af-publicada" className="cursor-pointer text-sm font-medium">
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
                  Eliminar actividad
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
                {saving ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear actividad"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
