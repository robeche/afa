import type { Lang } from "@/types/domain";

export const supportedLanguages: Lang[] = ["es", "eu"];

export const defaultLanguage: Lang = "es";

export const languageNames: Record<Lang, string> = {
  es: "ES",
  eu: "EU",
};

export function isSupportedLanguage(lang: string): lang is Lang {
  return supportedLanguages.includes(lang as Lang);
}
