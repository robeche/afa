"use client";

import { useRef } from "react";
import type { Actividad, Lang } from "@/types/domain";

const TYPE_BG: Record<string, string> = {
  Taller: "bg-emerald-500",
  Excursion: "bg-cyan-500",
  Reunion: "bg-amber-400",
  Festival: "bg-red-500",
  Comunidad: "bg-slate-400",
};

const TYPE_LABEL: Record<string, { es: string; eu: string }> = {
  Taller: { es: "Taller", eu: "Tailerra" },
  Excursion: { es: "Excursión", eu: "Irteera" },
  Reunion: { es: "Reunión", eu: "Bilera" },
  Festival: { es: "Festival", eu: "Jaialdia" },
  Comunidad: { es: "Evento social", eu: "Gizarte-ekitaldia" },
};

const UI = {
  es: { close: "Cerrar", date: "Fecha", time: "Hora", location: "Lugar" },
  eu: { close: "Itxi", date: "Data", time: "Ordua", location: "Lekua" },
} as const;

export interface ActivityDetailModalProps {
  activity: Actividad;
  lang: Lang;
  onClose: () => void;
}

export function ActivityDetailModal({ activity, lang, onClose }: ActivityDetailModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const t = UI[lang];

  const title = lang === "eu" ? activity.titulo_eu : activity.titulo_es;
  const description = lang === "eu" ? activity.descripcion_eu : activity.descripcion_es;
  const typeLabel = TYPE_LABEL[activity.tipo]?.[lang] ?? activity.tipo;
  const headerBg = TYPE_BG[activity.tipo] ?? "bg-slate-400";

  // Format date using locale
  const dateLabel = (() => {
    try {
      const locale = lang === "eu" ? "eu-ES" : "es-ES";
      const [y, m, d] = activity.fecha_inicio.split("-").map(Number);
      const s = new Intl.DateTimeFormat(locale, {
        day: "numeric", month: "long", year: "numeric",
      }).format(new Date(y, m - 1, d));
      return s.charAt(0).toUpperCase() + s.slice(1);
    } catch {
      return activity.fecha_inicio;
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
      <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Coloured header */}
        <div className={`flex shrink-0 items-center justify-between ${headerBg} px-5 py-3 text-white`}>
          <span className="text-xs font-bold uppercase tracking-wider opacity-90">
            {typeLabel}
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
          {activity.imagen_url && (
            <div className="h-48 w-full overflow-hidden sm:h-56">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activity.imagen_url}
                alt={title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="space-y-4 p-5">
            {/* Title */}
            <h2 className="font-display text-xl font-bold leading-snug text-[var(--color-primary-dark)]">
              {title}
            </h2>

            {/* Meta: date / time / location */}
            <ul className="space-y-1.5">
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <i className="bi bi-calendar3 w-4 shrink-0 text-[var(--color-primary)]" />
                <span>{dateLabel}</span>
              </li>
              {activity.hora_inicio && (
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <i className="bi bi-clock w-4 shrink-0 text-[var(--color-primary)]" />
                  <span>{activity.hora_inicio}</span>
                </li>
              )}
              {activity.ubicacion && (
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <i className="bi bi-geo-alt w-4 shrink-0 text-[var(--color-primary)]" />
                  <span>{activity.ubicacion}</span>
                </li>
              )}
            </ul>

            {/* Description */}
            <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
