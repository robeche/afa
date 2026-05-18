import type { Lang } from "@/types/domain";

interface QuienesSomosPageProps {
  params: Promise<{ lang: Lang }>;
}

const content = {
  es: {
    title: "Quiénes somos",
    intro:
      "La AFA Remontival (Asociación de Familias del Alumnado) somos el conjunto de familias del colegio público Remontival de Estella que nos organizamos para apoyar la comunidad educativa.",
    sections: [
      {
        icon: "bi-people-fill",
        heading: "Qué es la AFA",
        body: "La AFA es la asociación que agrupa a los padres, madres y tutores legales del alumnado del centro. Trabajamos de forma voluntaria para mejorar la experiencia educativa de nuestros hijos e hijas, colaborando con el profesorado y el equipo directivo.",
      },
      {
        icon: "bi-person-badge",
        heading: "La Junta Directiva",
        body: "La AFA está gestionada por una junta directiva formada por socios voluntarios. La junta se compone de presidencia, secretaría, tesorería y vocales.",
      },
      {
        icon: "bi-flag-fill",
        heading: "Nuestra misión",
        body: "Fomentar la participación de las familias en la vida escolar, organizar actividades extraescolares y de ocio, y ser el canal de comunicación entre las familias y el centro educativo.",
      },
      {
        icon: "bi-heart-fill",
        heading: "Hazte socio",
        body: "Cualquier familia del colegio puede hacerse socia de la AFA. La cuota anual permite sufragar las actividades y servicios que ofrecemos a toda la comunidad educativa.",
      },
    ],
  },
  eu: {
    title: "Nor gara",
    intro:
      "AFA Remontival (Ikasleen Familien Elkartea) Lizarrako Remontival ikastetxe publikoko familia multzoa gara, hezkuntza komunitatea laguntzeko antolatzen garena.",
    sections: [
      {
        icon: "bi-people-fill",
        heading: "Zer da AFA",
        body: "AFA ikastetxeko ikasleen guraso, ama eta tutoreen elkartea da. Borondatez lan egiten dugu gure seme-alaben hezkuntza-esperientzia hobetzeko, irakasleei eta zuzendaritza-taldearekin lankidetzan.",
      },
      {
        icon: "bi-person-badge",
        heading: "Batzorde Nagusia",
        body: "AFA borondatezko bazkideez osatutako batzorde nagusi batek kudeatzen du. Batzordea presidentetzaz, idazkaritzaz, diruzaintza eta bokalez osatuta dago.",
      },
      {
        icon: "bi-flag-fill",
        heading: "Gure eginkizuna",
        body: "Familien parte-hartzea eskola-bizitzan sustatzea, aisialdi eta eskolaz kanpoko jarduerak antolatzea, eta familiak eta hezkuntza-zentroa lotzen dituen komunikazio-bide izatea.",
      },
      {
        icon: "bi-heart-fill",
        heading: "Egin bazkide",
        body: "Ikastetxeko edozein familiak AFAko bazkide izan daiteke. Urteko kuotak komunitate osoari eskaintzen ditugun jarduerak eta zerbitzuak ordaintzeko balio du.",
      },
    ],
  },
};

export default async function QuienesSomosPage({ params }: QuienesSomosPageProps) {
  const { lang } = await params;
  const t = content[lang];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm md:p-8">
        <h1 className="section-title">{t.title}</h1>
        <p className="mt-4 text-lg text-[var(--color-muted)]">{t.intro}</p>
      </section>

      <div className="grid gap-5 sm:grid-cols-2">
        {t.sections.map((section) => (
          <article
            key={section.heading}
            className="flex gap-4 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm"
          >
            <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[var(--color-primary)]">
              <i className={`bi ${section.icon} text-xl`} />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-[var(--color-primary-dark)]">
                {section.heading}
              </h2>
              <p className="mt-1 text-sm text-[var(--color-muted)]">{section.body}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
