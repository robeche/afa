import { ComedorSection } from "@/components/comedor/comedor-section";
import type { Lang } from "@/types/domain";

interface ComedorPageProps {
  params: Promise<{ lang: Lang }>;
}

const TITLES: Record<Lang, string> = {
  es: "Comedor",
  eu: "Jantokia",
};

export default async function ComedorPage({ params }: ComedorPageProps) {
  const { lang } = await params;

  return (
    <section className="space-y-5">
      <h1 className="section-title">{TITLES[lang]}</h1>
      <ComedorSection lang={lang} />
    </section>
  );
}
