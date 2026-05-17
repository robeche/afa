import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isSupportedLanguage } from "@/lib/i18n/config";
import { PublicShell } from "@/components/layout/public-shell";
import type { Lang } from "@/types/domain";

interface LangLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export const metadata: Metadata = {
  title: "APYMA Remontival",
};

export function generateStaticParams() {
  return [{ lang: "es" }, { lang: "eu" }];
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;

  if (!isSupportedLanguage(lang)) {
    notFound();
  }

  return (
    <PublicShell lang={lang as Lang}>{children}</PublicShell>
  );
}
