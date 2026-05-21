import { ConsejosList } from "@/components/ui/consejos-list";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import type { Consejo, Lang } from "@/types/domain";

interface ConsejosPageProps {
  params: Promise<{ lang: Lang }>;
}

async function fetchPublishedConsejos(): Promise<Consejo[]> {
  try {
    const supabase = getServerSupabaseClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from("consejos") as any)
      .select("*")
      .eq("publicado", true)
      .order("orden", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[AFA] Error pre-fetching consejos:", error);
      return [];
    }
    return (data as Consejo[]) ?? [];
  } catch (e) {
    console.error("[AFA] Error building consejos page:", e);
    return [];
  }
}

export default async function ConsejosPage({ params }: ConsejosPageProps) {
  const { lang } = await params;
  const initialConsejos = await fetchPublishedConsejos();

  return (
    <section className="space-y-5">
      <h1 className="section-title">
        {lang === "eu" ? "Aholkuak" : "Consejos"}
      </h1>
      <ConsejosList initialConsejos={initialConsejos} lang={lang} />
    </section>
  );
}
