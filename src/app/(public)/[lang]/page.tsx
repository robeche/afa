import Link from "next/link";

import { getDictionary } from "@/lib/i18n";
import { HomeNewsSection } from "@/components/noticias/home-news-section";
import type { Lang } from "@/types/domain";

interface HomePageProps {
  params: Promise<{ lang: Lang }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  const dictionary = getDictionary(lang);
  const isBasque = lang === "eu";

  const labels = {
    mission: isBasque
      ? "Gure helburua eskola komunitatea babestea eta indartzea da. Zuen laguntza behar dugu."
      : "Nuestra meta es apoyar y aportar a la comunidad escolar. Necesitamos tu ayuda.",
    aboutAfa: isBasque ? "Ezagutu AFA" : "Conoce la AFA",
    services: isBasque ? "Ezagutu gure zerbitzuak" : "Conoce nuestros servicios",
    becomeMember: isBasque ? "Egin zaitez AFAko bazkide" : "Hazte socio de la AFA",
    followUs: isBasque ? "Jarraitu Instagramen" : "Siguenos en Instagram",
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-emerald-200 bg-white p-6 text-center shadow-sm md:p-8">
        <p className="mx-auto max-w-4xl font-display text-2xl font-bold text-[var(--color-primary-dark)] md:text-3xl">
          {labels.mission}
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <HomeNewsSection lang={lang} menuLabel={dictionary.menu.noticias} />

        <aside className="order-first space-y-4 lg:order-last">
          <Link
            href={`/${lang}/quienes-somos`}
            className="block rounded-2xl border border-emerald-200 bg-white p-5 font-display text-2xl font-bold text-[var(--color-primary-dark)] shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            {labels.aboutAfa}
          </Link>

          <Link
            href={`/${lang}/servicios`}
            className="block rounded-2xl border border-emerald-200 bg-white p-5 font-display text-2xl font-bold text-[var(--color-primary-dark)] shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            {labels.services}
          </Link>

          <Link
            href="/socios"
            className="block rounded-2xl border border-emerald-200 bg-white p-5 font-display text-2xl font-bold text-[var(--color-primary-dark)] shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            {labels.becomeMember}
          </Link>

          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm"
          >
            <span className="font-semibold text-[var(--color-muted)]">{labels.followUs}</span>
            <i className="bi bi-instagram text-3xl text-[var(--color-primary)]" />
          </a>
        </aside>
      </section>
    </div>
  );
}
