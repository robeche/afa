import { mockActividades } from "@/lib/utils/mock-content";
import { ActivityCalendar } from "@/components/ui/activity-calendar";
import type { Lang } from "@/types/domain";

interface ActividadesPageProps {
  params: Promise<{ lang: Lang }>;
}

export default async function ActividadesPage({ params }: ActividadesPageProps) {
  const { lang } = await params;

  const titles = {
    es: "Calendario de Actividades",
    eu: "Jardueren Egutegia",
  };

  return (
    <section className="space-y-5">
      <h1 className="section-title">{titles[lang]}</h1>
      <ActivityCalendar initialActivities={mockActividades} lang={lang} />
    </section>
  );
}
