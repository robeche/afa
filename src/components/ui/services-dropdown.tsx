"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface DropdownItem {
  label: string;
  href: string;
}

interface ServicesDropdownProps {
  label: string;
  items: DropdownItem[];
}

export function ServicesDropdown({ label, items }: ServicesDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <li ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex cursor-pointer items-center gap-1 hover:text-[var(--color-primary)]"
      >
        {label}
        <i
          className={`bi bi-chevron-down text-xs transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul className="absolute left-0 z-20 mt-2 min-w-52 rounded-xl border border-emerald-100 bg-white p-2 shadow-lg">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-semibold normal-case hover:bg-emerald-50"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
