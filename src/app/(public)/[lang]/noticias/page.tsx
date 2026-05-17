import Link from "next/link";

import { mockNoticias } from "@/lib/utils/mock-content";
import type { Lang } from "@/types/domain";

interface NoticiasPageProps {
  params: Promise<{ lang: Lang }>;
}

export default async function NoticiasPage({ params }: NoticiasPageProps) {
  const { lang } = await params;

  return (
    <section className="space-y-5">
      <h1 className="section-title">Noticias</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {mockNoticias.map((noticia) => (
          <article key={noticia.id} className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase text-[var(--color-muted)]">
              {noticia.fecha_publicacion}
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-[var(--color-primary-dark)]">
              {lang === "eu" ? noticia.titulo_eu : noticia.titulo_es}
            </h2>
            <p className="mt-2 text-[var(--color-muted)]">
              {lang === "eu" ? noticia.resumen_eu : noticia.resumen_es}
            </p>
            <Link
              className="mt-4 inline-flex items-center gap-2 font-semibold text-[var(--color-primary)]"
              href={`/${lang}/noticias/${noticia.slug}`}
            >
              Ver detalle <i className="bi bi-arrow-right" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
