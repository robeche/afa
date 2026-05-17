import Link from "next/link";

import { getDictionary } from "@/lib/i18n";
import { mainMenuItems } from "@/lib/utils/navigation";
import type { Lang } from "@/types/domain";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

interface SiteHeaderProps {
  lang: Lang;
}

export function SiteHeader({ lang }: SiteHeaderProps) {
  const dictionary = getDictionary(lang);

  return (
    <header className="border-b border-emerald-100 bg-white">
      <div className="container-base py-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)] text-xl text-white">
              A
            </div>
            <div>
              <p className="font-display text-xl font-extrabold text-[var(--color-primary-dark)]">
                {dictionary.siteName}
              </p>
              <p className="text-sm text-[var(--color-muted)]">Colegio Remontival</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher currentLanguage={lang} />
            <Link
              href="/socios"
              className="rounded-md bg-[var(--color-primary)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--color-primary-dark)]"
            >
              <i className="bi bi-person-lock mr-2" />
              {dictionary.login}
            </Link>
          </div>
        </div>
      </div>

      <nav className="bg-[var(--color-primary)] text-white">
        <div className="container-base">
          <ul className="grid grid-cols-2 gap-1 py-2 text-sm md:grid-cols-5 lg:grid-cols-10">
            {mainMenuItems.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href(lang)}
                  className="flex items-center justify-center gap-2 rounded-md px-2 py-2 text-center font-semibold hover:bg-emerald-700"
                >
                  <i className={`bi ${item.icon}`} />
                  <span>{dictionary.menu[item.key]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
