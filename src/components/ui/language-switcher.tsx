import Link from "next/link";

import { languageNames, supportedLanguages } from "@/lib/i18n/config";
import type { Lang } from "@/types/domain";

interface LanguageSwitcherProps {
  currentLanguage: Lang;
}

export function LanguageSwitcher({ currentLanguage }: LanguageSwitcherProps) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold">
      {supportedLanguages.map((lang) => {
        const isActive = currentLanguage === lang;

        return (
          <Link
            key={lang}
            href={`/${lang}`}
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
