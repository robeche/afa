import { mockActividades } from "@/lib/utils/mock-content";
import type { Lang } from "@/types/domain";

interface ActividadesPageProps {
  params: Promise<{ lang: Lang }>;
}

export default async function ActividadesPage({ params }: ActividadesPageProps) {
  const { lang } = await params;

  return (
    <section className="space-y-5">
      <h1 className="section-title">Actividades</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {mockActividades.map((item) => (
          <article key={item.id} className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase text-[var(--color-muted)]">{item.tipo}</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-[var(--color-primary-dark)]">
              {lang === "eu" ? item.titulo_eu : item.titulo_es}
            </h2>
            <p className="mt-2 text-[var(--color-muted)]">
              {lang === "eu" ? item.descripcion_eu : item.descripcion_es}
            </p>
            <p className="mt-4 text-sm font-semibold text-[var(--color-primary)]">{item.fecha_inicio}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
