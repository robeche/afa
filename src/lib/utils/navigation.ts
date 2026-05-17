import type { Lang } from "@/types/domain";

type MenuKey =
  | "inicio"
  | "noticias"
  | "actividades"
  | "concurso"
  | "consejos"
  | "comedor"
  | "extraescolares"
  | "aulaMatinal"
  | "estatutos"
  | "contacto";

export interface MenuItem {
  key: MenuKey;
  icon: string;
  href: (lang: Lang) => string;
}

export const mainMenuItems: MenuItem[] = [
  { key: "inicio", icon: "bi-house-door", href: (lang) => `/${lang}` },
  { key: "noticias", icon: "bi-newspaper", href: (lang) => `/${lang}/noticias` },
  { key: "actividades", icon: "bi-calendar-event", href: (lang) => `/${lang}/actividades` },
  { key: "concurso", icon: "bi-trophy", href: (lang) => `/${lang}/concurso` },
  { key: "consejos", icon: "bi-lightbulb", href: (lang) => `/${lang}/consejos` },
  { key: "comedor", icon: "bi-file-earmark-pdf", href: (lang) => `/${lang}/comedor` },
  { key: "extraescolares", icon: "bi-controller", href: () => "#" },
  { key: "aulaMatinal", icon: "bi-sunrise", href: () => "#" },
  { key: "estatutos", icon: "bi-journal-text", href: () => "#" },
  { key: "contacto", icon: "bi-envelope", href: (lang) => `/${lang}/contacto` },
];
