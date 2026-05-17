import es from "@/lib/i18n/es.json";
import eu from "@/lib/i18n/eu.json";
import type { Lang } from "@/types/domain";

type Dictionary = typeof es;

const dictionaries: Record<Lang, Dictionary> = {
  es,
  eu,
};

export function getDictionary(lang: Lang): Dictionary {
  return dictionaries[lang] ?? dictionaries.es;
}
