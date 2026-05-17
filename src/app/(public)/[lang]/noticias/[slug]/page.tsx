import { notFound } from "next/navigation";

import { mockNoticias } from "@/lib/utils/mock-content";
import type { Lang } from "@/types/domain";

interface NoticiaDetallePageProps {
  params: Promise<{ lang: Lang; slug: string }>;
}

export function generateStaticParams() {
  return [{ lang: "es", slug: "fiesta-fin-curso" }, { lang: "eu", slug: "fiesta-fin-curso" }, { lang: "es", slug: "asamblea-general" }, { lang: "eu", slug: "asamblea-general" }];
}

export default async function NoticiaDetallePage({ params }: NoticiaDetallePageProps) {
  const { lang, slug } = await params;
  const noticia = mockNoticias.find((item) => item.slug === slug);

  if (!noticia) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase text-[var(--color-muted)]">{noticia.fecha_publicacion}</p>
      <h1 className="font-display text-4xl font-extrabold text-[var(--color-primary-dark)]">
        {lang === "eu" ? noticia.titulo_eu : noticia.titulo_es}
      </h1>
      <div
        className="h-64 rounded-xl bg-cover bg-center"
        style={{ backgroundImage: `url(${noticia.imagen_url})` }}
      />
      <p className="leading-8 text-[var(--color-muted)]">
        {lang === "eu" ? noticia.contenido_eu : noticia.contenido_es}
      </p>
    </article>
  );
}
