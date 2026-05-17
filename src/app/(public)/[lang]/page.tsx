import { getDictionary } from "@/lib/i18n";
import { mockActividades, mockNoticias } from "@/lib/utils/mock-content";
import { ContentCard } from "@/components/ui/content-card";
import { HeroCarousel } from "@/components/ui/hero-carousel";
import type { Lang } from "@/types/domain";

interface HomePageProps {
  params: Promise<{ lang: Lang }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  const dictionary = getDictionary(lang);

  return (
    <div className="space-y-10">
      <HeroCarousel lang={lang} />

      <section className="rounded-2xl bg-gradient-to-r from-emerald-50 to-lime-50 p-6">
        <h1 className="font-display text-3xl font-extrabold text-[var(--color-primary-dark)] md:text-4xl">
          {dictionary.home.title}
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-[var(--color-muted)]">{dictionary.home.subtitle}</p>
      </section>

      <section className="space-y-4">
        <h2 className="section-title">{dictionary.home.latestNews}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {mockNoticias.slice(0, 2).map((item) => (
            <ContentCard
              key={item.id}
              title={lang === "eu" ? item.titulo_eu : item.titulo_es}
              summary={lang === "eu" ? item.resumen_eu : item.resumen_es}
              date={item.fecha_publicacion}
              image={item.imagen_url}
              href={`/${lang}/noticias/${item.slug}`}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="section-title">{dictionary.home.nextActivities}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {mockActividades.map((item) => (
            <article key={item.id} className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase text-[var(--color-muted)]">{item.fecha_inicio}</p>
              <h3 className="font-display text-xl font-bold text-[var(--color-primary-dark)]">
                {lang === "eu" ? item.titulo_eu : item.titulo_es}
              </h3>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                {lang === "eu" ? item.descripcion_eu : item.descripcion_es}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
