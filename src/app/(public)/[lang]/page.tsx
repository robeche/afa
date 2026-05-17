import Link from "next/link";

import { getDictionary } from "@/lib/i18n";
import { mockNoticias } from "@/lib/utils/mock-content";
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
    newsHint: isBasque ? "berriak" : "novedades",
    readMore: isBasque ? "gehiago" : "mas",
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
        <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm md:p-6">
          <h2 className="font-display text-3xl font-extrabold text-[var(--color-primary-dark)]">
            {dictionary.menu.noticias}
            <span className="ml-2 text-xl font-medium lowercase text-[var(--color-muted)]">o {labels.newsHint}?</span>
          </h2>

          <div className="mt-5 space-y-4">
            {mockNoticias.slice(0, 2).map((item) => (
              <article key={item.id} className="overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50/40">
                <div className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                    {item.fecha_publicacion}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold text-[var(--color-primary-dark)]">
                    {lang === "eu" ? item.titulo_eu : item.titulo_es}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    {lang === "eu" ? item.resumen_eu : item.resumen_es}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <Link
              href={`/${lang}/noticias`}
              className="rounded-md border border-emerald-300 px-3 py-2 text-sm font-semibold text-[var(--color-primary-dark)] hover:bg-emerald-50"
            >
              {labels.readMore}
            </Link>
          </div>
        </div>

        <aside className="space-y-4">
          <Link
            href={`/${lang}/concurso`}
            className="block rounded-2xl border border-emerald-200 bg-white p-5 font-display text-2xl font-bold text-[var(--color-primary-dark)] shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            {labels.aboutAfa}
          </Link>

          <Link
            href={`/${lang}/actividades`}
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
