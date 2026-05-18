"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { languageNames, supportedLanguages } from "@/lib/i18n/config";
import type { Lang } from "@/types/domain";

const LANG_KEY = "afa-lang";

interface LanguageSwitcherProps {
  currentLanguage: Lang;
}

export function LanguageSwitcher({ currentLanguage }: LanguageSwitcherProps) {
  const pathname = usePathname();

  function buildHref(lang: Lang): string {
    // Reemplaza el segmento de idioma en la ruta actual, p.ej. /es/noticias -> /eu/noticias
    return pathname.replace(new RegExp(`^/${currentLanguage}(/|$)`), `/${lang}$1`);
  }

  function handleClick(lang: Lang) {
    localStorage.setItem(LANG_KEY, lang);
  }

  return (
    <div className="flex items-center gap-2 text-sm font-semibold">
      {supportedLanguages.map((lang) => {
        const isActive = currentLanguage === lang;

        return (
          <Link
            key={lang}
            href={buildHref(lang)}
            onClick={() => handleClick(lang)}
            className={`rounded-md px-2 py-1 transition ${
              isActive
                ? "bg-[var(--color-primary)] text-white"
                : "bg-emerald-50 text-[var(--color-primary-dark)] hover:bg-emerald-100"
            }`}
          >
            {languageNames[lang]}
          </Link>
        );
      })}
    </div>
  );
}
