"use client";

import { useState } from "react";
import Link from "next/link";

interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

interface MobileNavProps {
  items: NavItem[];
}

export function MobileNav({ items }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        className="flex h-10 w-10 items-center justify-center rounded-md border border-emerald-200 text-[var(--color-primary-dark)] hover:bg-emerald-50"
      >
        {open ? (
          <i className="bi bi-x-lg text-xl" />
        ) : (
          <i className="bi bi-list text-2xl" />
        )}
      </button>

      {open && (
        <nav className="absolute left-0 right-0 z-50 border-t border-emerald-100 bg-white shadow-lg">
          <ul className="container-base divide-y divide-emerald-50 py-2">
            {items.map((item) => (
              <li key={item.label}>
                {item.children ? (
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between py-3 font-bold uppercase tracking-wide text-[var(--color-primary-dark)] [&::-webkit-details-marker]:hidden">
                      {item.label}
                      <i className="bi bi-chevron-down text-sm group-open:rotate-180 transition-transform" />
                    </summary>
                    <ul className="pb-2 pl-4">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <Link
                            href={child.href}
                            onClick={() => setOpen(false)}
                            className="block py-2 text-sm font-semibold text-[var(--color-muted)] hover:text-[var(--color-primary)]"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 font-bold uppercase tracking-wide text-[var(--color-primary-dark)] hover:text-[var(--color-primary)]"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
