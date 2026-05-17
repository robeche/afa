import type { Lang } from "@/types/domain";

interface ConcursoPageProps {
  params: Promise<{ lang: Lang }>;
}

export default async function ConcursoPage({ params }: ConcursoPageProps) {
  const { lang } = await params;

  return (
    <section className="space-y-5 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
      <h1 className="section-title">Concurso</h1>
      <p className="text-[var(--color-muted)]">
        {lang === "eu"
          ? "Lehiaketaren oinarriak, epeak eta galeria atal honetan argitaratuko ditugu."
          : "En esta seccion publicaremos bases, plazos y galeria del concurso."}
      </p>
    </section>
  );
}
