"use client";

import { FormEvent, useRef, useState } from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser";
import { RichTextEditor } from "./rich-text-editor";
import type { Consejo } from "@/types/domain";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export interface ConsejoFormModalProps {
  consejo?: Consejo;
  onSave: () => void;
  onClose: () => void;
}

type Lang = "es" | "eu";

export function ConsejoFormModal({ consejo, onSave, onClose }: ConsejoFormModalProps) {
  const isEdit = !!consejo;
  const overlayRef = useRef<HTMLDivElement>(null);
  const [activeLang, setActiveLang] = useState<Lang>("es");

  const [form, setForm] = useState({
    titulo_es: consejo?.titulo_es ?? "",
    titulo_eu: consejo?.titulo_eu ?? "",
    contenido_es: consejo?.contenido_es ?? "",
    contenido_eu: consejo?.contenido_eu ?? "",
    orden: consejo?.orden ?? 0,
    publicado: consejo?.publicado ?? false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(consejo?.imagen_url ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
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
      let imagen_url: string | null = consejo?.imagen_url ?? null;

      if (imageFile) {
        const ext = imageFile.name.split(".").pop() ?? "jpg";
        const fileName = `portada-${Date.now()}.${ext}`;
        const { data: up, error: upErr } = await supabase.storage
          .from("consejos")
          .upload(fileName, imageFile, { upsert: true });
        if (upErr) throw new Error(`Error al subir portada: ${upErr.message}`);
        const { data: urlData } = supabase.storage.from("consejos").getPublicUrl(up.path);
        imagen_url = urlData.publicUrl;
      }

      const payload = {
        ...form,
        slug: slugify(form.titulo_es),
        imagen_url,
      };

      if (isEdit && consejo?.id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: dbErr } = await (supabase.from("consejos") as any)
          .update(payload)
          .eq("id", consejo.id);
        if (dbErr) throw new Error(dbErr.message);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: dbErr } = await (supabase.from("consejos") as any).insert(payload);
        if (dbErr) throw new Error(dbErr.message);
      }
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!consejo?.id) return;
    setDeleting(true);
    setError(null);
    try {
      const supabase = getBrowserSupabaseClient();
      if (consejo.imagen_url) {
        const url = new URL(consejo.imagen_url);
        const parts = url.pathname.split("/object/public/consejos/");
        if (parts[1]) await supabase.storage.from("consejos").remove([parts[1]]);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: dbErr } = await (supabase.from("consejos") as any)
        .delete()
        .eq("id", consejo.id);
      if (dbErr) throw new Error(dbErr.message);
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar.");
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
      aria-label={isEdit ? "Editar consejo" : "Nueva entrada"}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div
        className="flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */
        <div className="flex shrink-0 items-center justify-between bg-[var(--color-primary)] px-6 py-4 text-white">
          <h2 className="font-display text-lg font-bold">
            {isEdit ? "Editar entrada" : "Nueva entrada"}
          </h2>
          <button type="button" onClick={onClose} aria-label="Cerrar"
            className="rounded-full p-1 transition hover:bg-white/20">
            <i className="bi bi-x-lg text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 4rem)" }}>
          <div className="space-y-5 p-6">

            {/* Títulos */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label-base" htmlFor="cf-titulo-es">Título castellano *</label>
                <input id="cf-titulo-es" type="text" required value={form.titulo_es}
                  onChange={(e) => set("titulo_es", e.target.value)} className="input-base" />
              </div>
              <div>
                <label className="label-base" htmlFor="cf-titulo-eu">Título euskera *</label>
                <input id="cf-titulo-eu" type="text" required value={form.titulo_eu}
                  onChange={(e) => set("titulo_eu", e.target.value)} className="input-base" />
              </div>
            </div>

            {/* Imagen de portada */}
            <div>
              <label className="label-base">Imagen de portada</label>
              <input type="file" accept="image/*" onChange={handleCoverChange}
                className="block w-full text-sm text-[var(--color-muted)]
                  file:mr-3 file:cursor-pointer file:rounded-md file:border-0
                  file:bg-[var(--color-primary)] file:px-3 file:py-1.5
                  file:text-sm file:font-semibold file:text-white
                  hover:file:bg-[var(--color-primary-dark)]" />
              {imagePreview && (
                <div className="mt-2 overflow-hidden rounded-lg border border-emerald-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview} alt="Portada" className="h-32 w-full object-cover" />
                </div>
              )}
            </div>

            {/* Editor bilingüe — tabs */}
            <div>
              <div className="mb-2 flex gap-2">
                {(["es", "eu"] as Lang[]).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setActiveLang(l)}
                    className={[
                      "rounded-md px-3 py-1 text-sm font-semibold transition",
                      activeLang === l
                        ? "bg-[var(--color-primary)] text-white"
                        : "border border-gray-200 text-gray-600 hover:bg-gray-50",
                    ].join(" ")}
                  >
                    {l === "es" ? "🇪🇸 Castellano" : "🏴 Euskera"}
                  </button>
                ))}
              </div>

              {activeLang === "es" ? (
                <RichTextEditor
                  key="editor-es"
                  value={form.contenido_es}
                  onChange={(html) => set("contenido_es", html)}
                  placeholder="Contenido en castellano..."
                />
              ) : (
                <RichTextEditor
                  key="editor-eu"
                  value={form.contenido_eu}
                  onChange={(html) => set("contenido_eu", html)}
                  placeholder="Edukia euskaraz..."
                />
              )}
            </div>

            {/* Orden + Publicado */}
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <label className="label-base" htmlFor="cf-orden">Orden</label>
                <input id="cf-orden" type="number" min={0} value={form.orden}
                  onChange={(e) => set("orden", Number(e.target.value))}
                  className="input-base w-24" />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input id="cf-publicado" type="checkbox" checked={form.publicado}
                  onChange={(e) => set("publicado", e.target.checked)}
                  className="h-4 w-4 rounded border-emerald-300 accent-[var(--color-primary)]" />
                <label htmlFor="cf-publicado" className="cursor-pointer text-sm font-medium">
                  Publicado <span className="text-[var(--color-muted)]">(visible para todos)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div role="alert" className="mx-6 mb-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
              <i className="bi bi-exclamation-triangle-fill shrink-0" />
              {error}
            </div>
          )}

          {/* Footer */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-emerald-100 px-6 py-4">
            {isEdit && (
              confirmDelete ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-red-600">¿Eliminar?</span>
                  <button type="button" onClick={handleDelete} disabled={deleting}
                    className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-60">
                    {deleting && <i className="bi bi-arrow-clockwise animate-spin" />}
                    Sí, eliminar
                  </button>
                  <button type="button" onClick={() => setConfirmDelete(false)}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50">
                    Cancelar
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50">
                  <i className="bi bi-trash3" /> Eliminar
                </button>
              )
            )}
            <div className="ml-auto flex items-center gap-3">
              <button type="button" onClick={onClose}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50">
                Cancelar
              </button>
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)] disabled:opacity-60">
                {saving && <i className="bi bi-arrow-clockwise animate-spin" />}
                {saving ? "Guardando…" : isEdit ? "Guardar cambios" : "Publicar entrada"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
