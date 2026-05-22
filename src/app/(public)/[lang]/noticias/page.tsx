import { mockNoticias } from "@/lib/utils/mock-content";
import { NoticiasList } from "@/components/noticias/noticias-list";
import type { Lang } from "@/types/domain";

interface NoticiasPageProps {
  params: Promise<{ lang: Lang }>;
}

const TITLES: Record<Lang, string> = {
  es: "Noticias",
  eu: "Berriak",
};

export default async function NoticiasPage({ params }: NoticiasPageProps) {
  const { lang } = await params;

  return (
    <section className="space-y-5">
      <h1 className="section-title">{TITLES[lang]}</h1>
      <NoticiasList initialNoticias={mockNoticias} lang={lang} />
    </section>
  );
}
