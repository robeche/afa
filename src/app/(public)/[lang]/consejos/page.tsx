import { mockConsejos } from "@/lib/utils/mock-content";
import type { Lang } from "@/types/domain";

interface ConsejosPageProps {
  params: Promise<{ lang: Lang }>;
}

export default async function ConsejosPage({ params }: ConsejosPageProps) {
  const { lang } = await params;

  return (
    <section className="space-y-5">
      <h1 className="section-title">Consejos</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {mockConsejos.map((item) => (
          <article key={item.id} className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-[var(--color-primary-dark)]">
              {lang === "eu" ? item.titulo_eu : item.titulo_es}
            </h2>
            <p className="mt-3 text-[var(--color-muted)]">
              {lang === "eu" ? item.contenido_eu : item.contenido_es}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
