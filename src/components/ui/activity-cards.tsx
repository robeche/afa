"use client";

import { useEffect, useRef, useState } from "react";

export interface Activity {
  id: string;
  icon: string;
  name: string;
  instructor: string;
  instructorUrl?: string;
  day: string;
  time: string;
  age: string;
  price: string;
}

interface ActivityCardsProps {
  activities: Activity[];
  enrollUrl: string;
  labels: {
    instructor: string;
    day: string;
    time: string;
    age: string;
    price: string;
    enrollBtn: string;
    closeBtn: string;
    detailsTitle: string;
  };
}

export function ActivityCards({
  activities,
  enrollUrl,
  labels,
}: ActivityCardsProps) {
  const [selected, setSelected] = useState<Activity | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  function openModal(act: Activity) {
    setSelected(act);
    dialogRef.current?.showModal();
  }

  function closeModal() {
    dialogRef.current?.close();
    setSelected(null);
  }

  // Cerrar al pulsar el backdrop
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    function onCancel(e: Event) {
      e.preventDefault();
      closeModal();
    }
    dialog.addEventListener("cancel", onCancel);
    return () => dialog.removeEventListener("cancel", onCancel);
  }, []);

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    const rect = dialogRef.current?.getBoundingClientRect();
    if (!rect) return;
    const { clientX: x, clientY: y } = e;
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      closeModal();
    }
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activities.map((act) => (
          <button
            key={act.id}
            onClick={() => openModal(act)}
            className="flex cursor-pointer items-center gap-3 rounded-2xl border border-emerald-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[var(--color-primary)]">
              <i className={`bi ${act.icon} text-xl`} />
            </span>
            <span className="flex-1 font-display text-lg font-bold text-[var(--color-primary-dark)]">
              {act.name}
            </span>
            <i className="bi bi-info-circle text-[var(--color-muted)]" />
          </button>
        ))}
      </div>

      {/* Modal */}
      <dialog
        ref={dialogRef}
        onClick={handleBackdropClick}
        className="w-full max-w-md rounded-2xl p-0 shadow-2xl backdrop:bg-black/50"
      >
        {selected && (
          <div>
            {/* Cabecera */}
            <div className="flex items-center justify-between rounded-t-2xl bg-[var(--color-primary)] px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <i className={`bi ${selected.icon} text-2xl`} />
                <h2 className="font-display text-xl font-bold uppercase tracking-wide">
                  {selected.name}
                </h2>
              </div>
              <button
                onClick={closeModal}
                aria-label="Cerrar"
                className="rounded-lg p-1 text-white/80 hover:text-white"
              >
                <i className="bi bi-x-lg text-xl" />
              </button>
            </div>

            {/* Subtítulo */}
            <div className="border-b border-emerald-100 px-5 py-3">
              <p className="text-sm font-semibold text-[var(--color-primary)]">
                <i className="bi bi-info-circle mr-1" />
                {labels.detailsTitle}
              </p>
            </div>

            {/* Detalle */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 px-5 py-5 text-sm">
              <div>
                <p className="flex items-center gap-1 font-bold text-[var(--color-primary-dark)]">
                  <span className="inline-block h-3 w-3 rounded-sm bg-[var(--color-primary)]" />
                  {labels.instructor}:
                </p>
                {selected.instructorUrl ? (
                  <a
                    href={selected.instructorUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--color-primary)] underline"
                  >
                    {selected.instructor}
                  </a>
                ) : (
                  <p className="text-[var(--color-muted)]">{selected.instructor}</p>
                )}
              </div>

              <div>
                <p className="flex items-center gap-1 font-bold text-[var(--color-primary-dark)]">
                  <i className="bi bi-calendar3 text-amber-400" />
                  {labels.day}:
                </p>
                <p className="text-[var(--color-muted)]">{selected.day}</p>
              </div>

              <div>
                <p className="flex items-center gap-1 font-bold text-[var(--color-primary-dark)]">
                  <i className="bi bi-clock text-sky-500" />
                  {labels.time}:
                </p>
                <p className="text-[var(--color-muted)]">{selected.time}</p>
              </div>

              <div>
                <p className="flex items-center gap-1 font-bold text-[var(--color-primary-dark)]">
                  <i className="bi bi-people text-sky-500" />
                  {labels.age}:
                </p>
                <p className="text-[var(--color-muted)]">{selected.age}</p>
              </div>

              <div className="col-span-2">
                <p className="flex items-center gap-1 font-bold text-[var(--color-primary-dark)]">
                  <i className="bi bi-currency-euro text-emerald-500" />
                  {labels.price}:
                </p>
                <p className="text-xl font-bold text-[var(--color-primary)]">
                  {selected.price}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-emerald-100 px-5 py-4">
              <button
                onClick={closeModal}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                {labels.closeBtn}
              </button>
              <a
                href={enrollUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--color-primary-dark)]"
              >
                <i className="bi bi-pencil-square" />
                {labels.enrollBtn}
              </a>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
