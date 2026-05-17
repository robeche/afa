import { mockDocumentosComedor } from "@/lib/utils/mock-content";
import type { Lang } from "@/types/domain";

interface ComedorPageProps {
  params: Promise<{ lang: Lang }>;
}

export default async function ComedorPage({ params }: ComedorPageProps) {
  const { lang } = await params;

  return (
    <section className="space-y-5">
      <h1 className="section-title">Comedor</h1>
      <p className="text-[var(--color-muted)]">
        {lang === "eu"
          ? "Hileko menuak PDF formatuan deskargatu."
          : "Descarga los menus mensuales en formato PDF."}
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        {mockDocumentosComedor.map((doc) => (
          <a
            key={doc.id}
            href={lang === "eu" ? doc.pdf_eu_url : doc.pdf_es_url}
            className="flex items-center justify-between rounded-lg border border-emerald-100 bg-white p-4 shadow-sm"
          >
            <div>
              <p className="font-display text-lg font-bold text-[var(--color-primary-dark)]">
                {doc.mes} {doc.anio}
              </p>
              <p className="text-sm text-[var(--color-muted)]">PDF</p>
            </div>
            <i className="bi bi-file-earmark-arrow-down text-2xl text-[var(--color-primary)]" />
          </a>
        ))}
      </div>
    </section>
  );
}
