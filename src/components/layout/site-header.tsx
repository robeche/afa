import Image from "next/image";
import Link from "next/link";

import { getDictionary } from "@/lib/i18n";
import type { Lang } from "@/types/domain";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { MobileNav } from "@/components/layout/mobile-nav";

interface SiteHeaderProps {
  lang: Lang;
}

export function SiteHeader({ lang }: SiteHeaderProps) {
  const dictionary = getDictionary(lang);
  const isBasque = lang === "eu";

  const labels = {
    calendario: isBasque ? "Egutegia" : "Calendario",
    servicios: isBasque ? "Zerbitzuak" : "Servicios",
    sobreAfa: isBasque ? "AFAri buruz" : "Sobre la AFA",
  };

  const navItems = [
    { label: dictionary.menu.noticias, href: `/${lang}/noticias` },
    { label: labels.calendario, href: `/${lang}/actividades` },
    {
      label: labels.servicios,
      href: "#",
      children: [
        { label: dictionary.menu.extraescolares, href: `/${lang}/actividades` },
        { label: dictionary.menu.aulaMatinal, href: `/${lang}/actividades` },
        { label: dictionary.menu.comedor, href: `/${lang}/comedor` },
      ],
    },
    { label: dictionary.menu.consejos, href: `/${lang}/consejos` },
    { label: labels.sobreAfa, href: `/${lang}/concurso` },
    { label: dictionary.menu.contacto, href: `/${lang}/contacto` },
  ];

  return (
    <header className="relative border-b border-emerald-100 bg-white">
      <div className="container-base py-3">
        <div className="flex items-center justify-between gap-3">
          <Link href={`/${lang}`} className="flex items-center">
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/assets/logos/LogoHorizontal.png`}
              alt="AFA Remontival"
              width={340}
              height={90}
              priority
              className="h-20 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-3">
            <LanguageSwitcher currentLanguage={lang} />
            <Link
              href="/socios"
              className="rounded-md bg-[var(--color-primary)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--color-primary-dark)]"
            >
              <i className="bi bi-person-lock mr-2" />
              <span className="hidden sm:inline">{dictionary.login}</span>
            </Link>
            <MobileNav items={navItems} />
          </div>
        </div>
      </div>

      <nav className="hidden border-t border-emerald-100 bg-white text-[var(--color-primary-dark)] md:block">
        <div className="container-base">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 py-3 text-sm font-bold uppercase tracking-wide md:text-base">
            <li>
              <Link href={`/${lang}/noticias`} className="hover:text-[var(--color-primary)]">
                {dictionary.menu.noticias}
              </Link>
            </li>

            <li>
              <Link href={`/${lang}/actividades`} className="hover:text-[var(--color-primary)]">
                {labels.calendario}
              </Link>
            </li>

            <li>
              <details className="group relative [&_summary::-webkit-details-marker]:hidden">
                <summary className="list-none cursor-pointer hover:text-[var(--color-primary)]">{labels.servicios}</summary>
                <ul className="absolute left-0 z-20 mt-2 min-w-52 rounded-xl border border-emerald-100 bg-white p-2 shadow-lg">
                  <li>
                    <Link href={`/${lang}/actividades`} className="block rounded-md px-3 py-2 text-sm font-semibold normal-case hover:bg-emerald-50">
                      {dictionary.menu.extraescolares}
                    </Link>
                  </li>
                  <li>
                    <Link href={`/${lang}/actividades`} className="block rounded-md px-3 py-2 text-sm font-semibold normal-case hover:bg-emerald-50">
                      {dictionary.menu.aulaMatinal}
                    </Link>
                  </li>
                  <li>
                    <Link href={`/${lang}/comedor`} className="block rounded-md px-3 py-2 text-sm font-semibold normal-case hover:bg-emerald-50">
                      {dictionary.menu.comedor}
                    </Link>
                  </li>
                </ul>
              </details>
            </li>

            <li>
              <Link href={`/${lang}/consejos`} className="hover:text-[var(--color-primary)]">
                {dictionary.menu.consejos}
              </Link>
            </li>

            <li>
              <Link href={`/${lang}/concurso`} className="hover:text-[var(--color-primary)]">
                {labels.sobreAfa}
              </Link>
            </li>

            <li>
              <Link href={`/${lang}/contacto`} className="hover:text-[var(--color-primary)]">
                {dictionary.menu.contacto}
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
