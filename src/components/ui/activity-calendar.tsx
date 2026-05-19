"use client";

import { useEffect, useState } from "react";
import type { Actividad, Lang } from "@/types/domain";
import { useSupabaseSession } from "@/hooks/use-supabase-session";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser";
import { ActivityFormModal } from "./activity-form-modal";

// ─── Colour mapping ───────────────────────────────────────────────────────────

const TYPE_DOT: Record<string, string> = {
  Taller: "bg-emerald-500",
  Excursion: "bg-cyan-500",
  Reunion: "bg-amber-400",
  Festival: "bg-red-500",
  Comunidad: "bg-slate-400",
};

const TYPE_BORDER: Record<string, string> = {
  Taller: "border-emerald-500",
  Excursion: "border-cyan-500",
  Reunion: "border-amber-400",
  Festival: "border-red-500",
  Comunidad: "border-slate-400",
};

const LEGEND_ITEMS = [
  { key: "Taller", es: "Talleres", eu: "Tailerrak", dot: "bg-emerald-500" },
  { key: "Excursion", es: "Excursiones", eu: "Irteerak", dot: "bg-cyan-500" },
  { key: "Reunion", es: "Reuniones", eu: "Bilerak", dot: "bg-amber-400" },
  { key: "Festival", es: "Festivales", eu: "Jaialdiak", dot: "bg-red-500" },
  { key: "Comunidad", es: "Eventos sociales", eu: "Gizarte-ekitaldiak", dot: "bg-slate-400" },
] as const;

// ─── i18n ─────────────────────────────────────────────────────────────────────

const UI = {
  es: {
    prev: "Mes anterior",
    next: "Mes siguiente",
    noEvents: "No hay actividades programadas para este día.",
    legend: "Tipos de Actividades",
    today: "Día actual",
    newActivity: "Nueva actividad",
    edit: "Editar",
  },
  eu: {
    prev: "Aurreko hilabetea",
    next: "Hurrengo hilabetea",
    noEvents: "Ez dago jarduerarik programatuta egun honetarako.",
    legend: "Jarduera motak",
    today: "Gaur eguna",
    newActivity: "Jarduera berria",
    edit: "Editatu",
  },
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toISODate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

/**
 * Returns an array of (Date | null) representing the calendar grid for the
 * given month.  Weeks start on Monday; null cells pad the first and last rows.
 */
function buildCalendarGrid(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Monday-based dow: 0 = Mon … 6 = Sun
  let startDow = firstDay.getDay();
  startDow = startDow === 0 ? 6 : startDow - 1;

  const cells: (Date | null)[] = Array(startDow).fill(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    cells.push(new Date(year, month, d));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function eventsForDay(activities: Actividad[], date: Date): Actividad[] {
  const ds = toISODate(date);
  return activities.filter(
    (a) => a.publicada && ds === a.fecha_inicio
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface ActivityCalendarProps {
  initialActivities: Actividad[];
  lang: Lang;
}

export function ActivityCalendar({ initialActivities, lang }: ActivityCalendarProps) {
  const locale = lang === "eu" ? "eu-ES" : "es-ES";
  const t = UI[lang];

  // ── Auth ─────────────────────────────────────────────────────────────────
  const { session, loading: sessionLoading } = useSupabaseSession();
  // Admin: authenticated user with role "admin" set in Supabase app_metadata
  const isAdmin = session?.user.app_metadata?.role === "admin";

  // ── Activities (Supabase fetch replaces initial server data) ─────────────
  const [activities, setActivities] = useState<Actividad[]>(initialActivities);

  useEffect(() => {
    if (sessionLoading) return;
    const supabase = getBrowserSupabaseClient();
    const fetchActivities = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = (supabase.from("actividades") as any).select("*").order("fecha_inicio");
      if (!isAdmin) {
        query = query.eq("publicada", true);
      }
      const { data } = await query;
      if (data && data.length > 0) setActivities(data as Actividad[]);
    };
    fetchActivities();
  }, [isAdmin, sessionLoading]);

  async function refetch() {
    const supabase = getBrowserSupabaseClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase.from("actividades") as any).select("*").order("fecha_inicio");
    if (!isAdmin) query = query.eq("publicada", true);
    const { data } = await query;
    if (data) setActivities(data as Actividad[]);
  }

  // ── Calendar state ────────────────────────────────────────────────────────
  const [today] = useState<Date>(() => new Date());
  const [year, setYear] = useState<number>(() => new Date().getFullYear());
  const [month, setMonth] = useState<number>(() => new Date().getMonth());
  const [selected, setSelected] = useState<Date>(() => new Date());

  // ── Form modal state ──────────────────────────────────────────────────────
  const [showForm, setShowForm] = useState(false);
  const [editActivity, setEditActivity] = useState<Actividad | undefined>();

  function openCreateForm() {
    setEditActivity(undefined);
    setShowForm(true);
  }

  function openEditForm(activity: Actividad) {
    setEditActivity(activity);
    setShowForm(true);
  }

  function handleFormSave() {
    setShowForm(false);
    refetch();
  }

  // ── Calendar data ─────────────────────────────────────────────────────────
  const cells = buildCalendarGrid(year, month);

  const dayNames = Array.from({ length: 7 }, (_, i) => {
    const ref = new Date(2024, 0, 1 + i); // 2024-01-01 is a Monday
    try {
      return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(ref);
    } catch {
      return new Intl.DateTimeFormat("es-ES", { weekday: "short" }).format(ref);
    }
  });

  const monthYearLabel = (() => {
    try {
      const s = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" })
        .format(new Date(year, month));
      return s.charAt(0).toUpperCase() + s.slice(1);
    } catch {
      return new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" })
        .format(new Date(year, month));
    }
  })();

  // ── Navigation ────────────────────────────────────────────────────────────
  function goPrevMonth() {
    if (month === 0) { setYear((y) => y - 1); setMonth(11); }
    else setMonth((m) => m - 1);
  }

  function goNextMonth() {
    if (month === 11) { setYear((y) => y + 1); setMonth(0); }
    else setMonth((m) => m + 1);
  }

  // ── Selected-day panel ────────────────────────────────────────────────────
  const selectedEvents = eventsForDay(activities, selected);

  const selectedLabel = (() => {
    try {
      const s = new Intl.DateTimeFormat(locale, {
        day: "numeric", month: "long", year: "numeric",
      }).format(selected);
      return s.charAt(0).toUpperCase() + s.slice(1);
    } catch {
      return selected.toLocaleDateString("es-ES", {
        day: "numeric", month: "long", year: "numeric",
      });
    }
  })();

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="space-y-4">
        {/* ── Month navigation + admin button ── */}
        <div className="flex items-center justify-between gap-2 rounded-xl border border-emerald-100 bg-white px-4 py-3 shadow-sm">
          <button
            onClick={goPrevMonth}
            aria-label={t.prev}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            ‹ {t.prev}
          </button>

          <div className="flex items-center gap-3">
            <h2 className="font-display text-xl font-bold text-[var(--color-primary-dark)]">
              {monthYearLabel}
            </h2>
            {isAdmin && (
              <button
                onClick={openCreateForm}
                aria-label={t.newActivity}
                className="flex items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
              >
                <i className="bi bi-plus-lg" />
                <span className="hidden sm:inline">{t.newActivity}</span>
              </button>
            )}
          </div>

          <button
            onClick={goNextMonth}
            aria-label={t.next}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            {t.next} ›
          </button>
        </div>

        {/* ── Calendar grid + side panel ── */}
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Calendar grid */}
          <div className="flex-1 overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-sm">
            {/* Day-of-week header */}
            <div className="grid grid-cols-7 border-b border-emerald-100 bg-emerald-50">
              {dayNames.map((name) => (
                <div
                  key={name}
                  className="py-2 text-center text-xs font-bold uppercase tracking-wide text-[var(--color-muted)]"
                >
                  {name}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7">
              {cells.map((date, idx) => {
                if (!date) {
                  return (
                    <div
                      key={`empty-${idx}`}
                      className="h-16 border-b border-r border-emerald-50 bg-gray-50/40"
                    />
                  );
                }

                const isToday = isSameDay(date, today);
                const isSelected = isSameDay(date, selected);
                const dayEvents = eventsForDay(activities, date);

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelected(date)}
                    aria-label={date.toLocaleDateString(locale)}
                    aria-pressed={isSelected}
                    className={[
                      "relative flex h-16 flex-col items-start border-b border-r border-emerald-50 p-1 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
                      isSelected
                        ? "bg-blue-50 ring-1 ring-inset ring-blue-300"
                        : "hover:bg-emerald-50",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "inline-flex h-6 w-6 items-center justify-center rounded-full text-sm font-semibold",
                        isToday
                          ? "bg-blue-500 text-white"
                          : isSelected
                          ? "bg-blue-300 text-white"
                          : "text-[var(--color-primary-dark)]",
                      ].join(" ")}
                    >
                      {date.getDate()}
                    </span>

                    {dayEvents.length > 0 && (
                      <div className="mt-0.5 flex flex-wrap gap-0.5 px-0.5">
                        {dayEvents.slice(0, 4).map((ev) => (
                          <span
                            key={ev.id}
                            className={`block h-2 w-2 rounded-full ${TYPE_DOT[ev.tipo] ?? "bg-slate-400"}`}
                          />
                        ))}
                        {dayEvents.length > 4 && (
                          <span className="text-[10px] leading-none text-[var(--color-muted)]">
                            +{dayEvents.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Side panel */}
          <div className="w-full overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-sm lg:w-72">
            <div className="flex items-center gap-2 bg-[#4a5568] px-4 py-3 text-white">
              <i className="bi bi-calendar3 text-sm" />
              <span className="text-sm font-semibold capitalize">{selectedLabel}</span>
            </div>

            {selectedEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 px-4 py-10 text-center text-[var(--color-muted)]">
                <i className="bi bi-calendar-x text-4xl opacity-40" />
                <p className="text-sm">{t.noEvents}</p>
              </div>
            ) : (
              <ul className="space-y-2 p-3">
                {selectedEvents.map((ev) => (
                  <li
                    key={ev.id}
                    className={`rounded-lg border-l-4 ${TYPE_BORDER[ev.tipo] ?? "border-slate-400"} bg-gray-50 p-3`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                        {ev.tipo}
                      </p>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => openEditForm(ev)}
                          aria-label={`${t.edit}: ${lang === "eu" ? ev.titulo_eu : ev.titulo_es}`}
                          className="shrink-0 rounded p-0.5 text-[var(--color-muted)] transition hover:text-[var(--color-primary)]"
                        >
                          <i className="bi bi-pencil text-xs" />
                        </button>
                      )}
                    </div>
                    <p className="mt-0.5 font-semibold text-sm text-[var(--color-primary-dark)]">
                      {lang === "eu" ? ev.titulo_eu : ev.titulo_es}
                    </p>
                    {ev.ubicacion && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-[var(--color-muted)]">
                        <i className="bi bi-geo-alt" />
                        {ev.ubicacion}
                      </p>
                    )}
                    {ev.hora_inicio && (
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-[var(--color-muted)]">
                        <i className="bi bi-clock" />
                        {ev.hora_inicio}
                      </p>
                    )}
                    <p className="mt-1 line-clamp-3 text-xs text-[var(--color-muted)]">
                      {lang === "eu" ? ev.descripcion_eu : ev.descripcion_es}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ── Legend ── */}
        <div className="rounded-xl bg-[#4a5568] px-5 py-4">
          <div className="mb-2 flex items-center gap-2">
            <i className="bi bi-info-circle text-white text-sm" />
            <span className="text-sm font-semibold text-white">{t.legend}</span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGEND_ITEMS.map((item) => (
              <div key={item.key} className="flex items-center gap-2">
                <span className={`block h-3 w-3 rounded-full ${item.dot}`} />
                <span className="text-sm text-white">{lang === "eu" ? item.eu : item.es}</span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <span className="block h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-sm text-white">{t.today}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Activity form modal ── */}
      {showForm && (
        <ActivityFormModal
          activity={editActivity}
          onSave={handleFormSave}
          onClose={() => setShowForm(false)}
        />
      )}
    </>
  );
}
