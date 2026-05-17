import type { ReactNode } from "react";

import type { Lang } from "@/types/domain";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

interface PublicShellProps {
  lang: Lang;
  children: ReactNode;
}

export function PublicShell({ lang, children }: PublicShellProps) {
  return (
    <>
      <SiteHeader lang={lang} />
      <main className="container-base w-full flex-1 py-8">{children}</main>
      <SiteFooter />
    </>
  );
}
