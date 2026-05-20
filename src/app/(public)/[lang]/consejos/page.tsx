import { ConsejosList } from "@/components/ui/consejos-list";
import type { Lang } from "@/types/domain";

interface ConsejosPageProps {
  params: Promise<{ lang: Lang }>;
}

export default async function ConsejosPage({ params }: ConsejosPageProps) {
  const { lang } = await params;

  return (
    <section className="space-y-5">
      <h1 className="section-title">
        {lang === "eu" ? "Aholkuak" : "Consejos"}
      </h1>
      <ConsejosList initialConsejos={[]} lang={lang} />
    </section>
  );
}
