import type { Lang } from "@/types/domain";
import { socialLinks } from "@/lib/utils/navigation";

interface ContactoPageProps {
  params: Promise<{ lang: Lang }>;
}

export default async function ContactoPage({ params }: ContactoPageProps) {
  const { lang } = await params;

  return (
    <section className="grid gap-6 md:grid-cols-2">
      <article className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
        <h1 className="section-title">Contacto</h1>
        <p className="mt-3 text-[var(--color-muted)]">
          {lang === "eu" ? "Jarri gurekin harremanetan." : "Ponte en contacto con la APYMA."}
        </p>
        <ul className="mt-4 space-y-2 text-sm text-[var(--color-muted)]">
          <li>
            <i className="bi bi-envelope mr-2 text-[var(--color-primary)]" />
            <a href={`mailto:${socialLinks.email}`} className="hover:text-[var(--color-primary)] hover:underline">
              {socialLinks.email}
            </a>
          </li>
          <li>
            <i className="bi bi-geo-alt mr-2 text-[var(--color-primary)]" />Colegio Remontival, Estella
          </li>
        </ul>
      </article>

      <article className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
        <h2 className="font-display text-2xl font-bold text-[var(--color-primary-dark)]">
          {lang === "eu" ? "Laster formularioa" : "Formulario proximo"}
        </h2>
        <p className="mt-3 text-[var(--color-muted)]">
          {lang === "eu"
            ? "Hurrengo iterazioan anti-spamarekin lotutako formularioa gehituko dugu."
            : "En la siguiente iteracion añadiremos el formulario conectado con anti-spam."}
        </p>
      </article>
    </section>
  );
}
