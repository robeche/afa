"use client";

import { useRef } from "react";
import type { Lang, Noticia } from "@/types/domain";

const UI = {
  es: { close: "Cerrar" },
  eu: { close: "Itxi" },
} as const;

export interface NewsDetailModalProps {
  noticia: Noticia;
  lang: Lang;
  onClose: () => void;
}

export function NewsDetailModal({ noticia, lang, onClose }: NewsDetailModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const t = UI[lang];

  const title = lang === "eu" ? noticia.titulo_eu : noticia.titulo_es;
  const subtitle = lang === "eu" ? noticia.resumen_eu : noticia.resumen_es;
  const body = lang === "eu" ? noticia.contenido_eu : noticia.contenido_es;

  const dateLabel = (() => {
    try {
      const locale = lang === "eu" ? "eu-ES" : "es-ES";
      const [y, m, d] = noticia.fecha_publicacion.split("-").map(Number);
      const s = new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(y, m - 1, d));
      return s.charAt(0).toUpperCase() + s.slice(1);
    } catch {
      return noticia.fecha_publicacion;
    }
  })();

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) onClose();
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between bg-[var(--color-primary)] px-5 py-3 text-white">
          <span className="text-xs font-bold uppercase tracking-wider opacity-90">
            {dateLabel}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="rounded-full p-1 transition hover:bg-white/20"
          >
            <i className="bi bi-x-lg text-lg" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto" style={{ maxHeight: "calc(90vh - 3.5rem)" }}>
          {/* Image */}
          {noticia.imagen_url && (
            <div className="h-52 w-full overflow-hidden sm:h-64">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={noticia.imagen_url}
                alt={title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="space-y-4 p-6">
            {/* Title */}
            <h2 className="font-display text-2xl font-extrabold text-[var(--color-primary-dark)] sm:text-3xl">
              {title}
            </h2>

            {/* Subtitle / resumen */}
            {subtitle && (
              <p className="text-lg font-medium text-[var(--color-muted)]">
                {subtitle}
              </p>
            )}

            {/* Body */}
            {body && (
              <p className="whitespace-pre-wrap leading-relaxed text-gray-700">
                {body}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
