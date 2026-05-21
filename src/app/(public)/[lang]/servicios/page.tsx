import Link from "next/link";
import type { Lang } from "@/types/domain";

interface ServiciosPageProps {
  params: Promise<{ lang: Lang }>;
}

const content = {
  es: {
    pageTitle: "Nuestros servicios",
    intro:
      "La AFA gestiona varios servicios para enriquecer la experiencia educacional y contribuir al buen funcionamiento del colegio. Actualmente, la Junta se encarga de los siguientes servicios:",
    services: [
      { label: "Aula Matinal", href: "#aula-matinal", internal: false },
      { label: "Extraescolares", href: "extraescolares", internal: true },
      { label: "Talleres y actividades puntuales para disfrutar en familia", href: "actividades", internal: true },
      { label: "Visitas al comedor", href: "#comedor", internal: false },
      {
        label: "7% de descuento en la compra de libros de texto en las librerías de la ciudad (Librería Papelería Ino, Librería Clarín Liburudenda, Suministros de Oficina J. Fraile)",
        href: null,
        internal: false,
      },
    ],

    // Aula Matinal
    aulaSectionTitle: "Aula Matinal",
    aulaDesc:
      "Durante el curso escolar, la AFA organiza el Aula Matinal para el alumnado que tiene que llegar al colegio antes del comienzo de la jornada escolar. Las familias pueden llegar entre las 7:30 y las 9:00 h.",
    aulaSociosOnly: "Solo las familias socias pueden utilizar este servicio.",
    aulaPricesTitle: "Precios",
    aulaPrices: [
      { label: "Mensual", price: "60 €/mes" },
      { label: "2.º hijo/a y siguientes", price: "50 €/mes" },
      { label: "Bono 5 días", price: "40 €" },
      { label: "Día suelto", price: "10 €" },
    ],

    // Extraescolares
    extraSectionTitle: "Extraescolares",
    extraDesc:
      "La gestión de las actividades extraescolares recae sobre la AFA, no sobre el colegio. Es la Junta quien busca las posibles actividades, contacta con los monitores e instructores, organiza los horarios, gestiona las inscripciones y las bajas, y se encarga del cobro de las cuotas. El colegio cede los espacios, pero toda la organización y responsabilidad de los extraescolares es de la AFA.",
    extraCta: "Ver todas las actividades extraescolares",

    // Comedor
    comedorSectionTitle: "Comedor",
    comedorNote:
      "La AFA no gestiona el comedor escolar, que depende directamente del colegio. Sin embargo, la Junta vela por que su funcionamiento sea el correcto y actúa como interlocutor entre las familias y el equipo del comedor.",
    comedorMenuBtn: "Descarga el menú",
    comedorDesc:
      "Además de la jornada de puertas abiertas al principio de cada curso, todas las familias que hacen uso del comedor pueden pedir una visita para probar la comida. La Junta de la AFA coordina esas visitas (siempre a las 12 h con un máximo de 6 personas) entre las encargadas del comedor y las familias.",
    comedorCta: "Mándanos un correo electrónico para pedir una visita al comedor.",
    comedorCtaBtn: "Contactar para visita al comedor",
  },
  eu: {
    pageTitle: "Gure zerbitzuak",
    intro:
      "AFAk hainbat zerbitzu kudeatzen ditu hezkuntza-esperientzia aberasteko eta ikastetxearen funtzionamendu onean laguntzeko. Gaur egun, Juntak zerbitzu hauez arduratzen da:",
    services: [
      { label: "Goizeko Gela", href: "#aula-matinal", internal: false },
      { label: "Eskolaz kanpoko jarduerak", href: "extraescolares", internal: true },
      { label: "Familiekin gozatzeko tailerrak eta jarduerak", href: "actividades", internal: true },
      { label: "Jantokiko bisitak", href: "#comedor", internal: false },
      {
        label: "% 7ko deskontua hiri-liburudendetako testuliburuen erosketan (Librería Papelería Ino, Librería Clarín Liburudenda, Suministros de Oficina J. Fraile)",
        href: null,
        internal: false,
      },
    ],

    // Aula Matinal
    aulaSectionTitle: "Goizeko Gela",
    aulaDesc:
      "Ikasturte osoan, AFAk Goizeko Gela antolatzen du eskola-ordutegia baino lehenago ikastetxera iritsi behar duten ikasleentzat. Familiak 7:30etik 9:00etara artean iritsi daitezke.",
    aulaSociosOnly: "Zerbitzu hau bazkide-familientzat soilik da.",
    aulaPricesTitle: "Prezioak",
    aulaPrices: [
      { label: "Hilekoa", price: "60 €/hil." },
      { label: "2. seme/alaba eta ondorengoak", price: "50 €/hil." },
      { label: "5 eguneko bonoa", price: "40 €" },
      { label: "Egun soltea", price: "10 €" },
    ],

    // Extraescolares
    extraSectionTitle: "Eskolaz kanpoko jarduerak",
    extraDesc:
      "Eskolaz kanpoko jardueren kudeaketa AFAren gain dago, ez ikastetxearengan. Juntak bilatzen ditu jarduera posibleak, monitoreekin eta hezitzaileekin harremanetan jartzen da, ordutegiak antolatzen ditu, izena ematea eta bajak kudeatzen ditu, eta kuoten kobrantza egiten du. Ikastetxeak espazioak uzten ditu, baina eskolaz kanpoko jardueren antolaketa eta ardura osoa AFArena da.",
    extraCta: "Eskolaz kanpoko jarduera guztiak ikusi",

    // Comedor
    comedorSectionTitle: "Jantokia",
    comedorNote:
      "AFAk ez du eskola-jantokia kudeatzen, ikastetxearen zuzeneko menpekoa baita. Hala ere, Juntak funtzionamendu egokia zaintzen du eta familien eta jantokiko taldearen arteko bitartekari gisa jarduten du.",
    comedorMenuBtn: "Deskargatu menua",
    comedorDesc:
      "Ikasturte hasierako ateak irekitzeko jardunaldiaz gain, jantokia erabiltzen duten familia guztiek bisita bat eska dezakete janaria probatzeko. AFAko Juntak bisita horiek koordinatzen ditu (beti 12:00etan, gehienez 6 pertsonarekin) jantokiko arduradunen eta familien artean.",
    comedorCta: "Bidali iezaguzu mezu elektroniko bat jantokira bisita bat eskatzeko.",
    comedorCtaBtn: "Harremanetan jarri jantokia bisitatzeko",
  },
};

export default async function ServiciosPage({ params }: ServiciosPageProps) {
  const { lang } = await params;
  const t = content[lang];

  return (
    <div className="space-y-8">
      {/* ── Intro ────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
        <h1 className="section-title text-2xl">
          <i className="bi bi-grid-fill mr-2 text-[var(--color-primary)]" />
          {t.pageTitle}
        </h1>
        <p className="mt-3 text-sm text-gray-700">{t.intro}</p>
        <ul className="mt-4 space-y-2">
          {t.services.map((s, i) =>
            s.href ? (
              <li key={i} className="flex items-start gap-2 text-sm">
                <i className="bi bi-check-circle-fill mt-0.5 text-[var(--color-primary)]" />
                {s.internal ? (
                  <Link
                    href={`/${lang}/${s.href}`}
                    className="font-medium text-[var(--color-primary)] hover:underline"
                  >
                    {s.label}
                  </Link>
                ) : (
                  <a href={s.href} className="font-medium text-[var(--color-primary)] hover:underline">
                    {s.label}
                  </a>
                )}
              </li>
            ) : (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <i className="bi bi-check-circle-fill mt-0.5 text-[var(--color-primary)]" />
                <span>{s.label}</span>
              </li>
            )
          )}
        </ul>
      </section>

      {/* ── Aula Matinal ─────────────────────────────────────── */}
      <section id="aula-matinal" className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
        <h2 className="section-title text-xl">
          <i className="bi bi-sunrise mr-2 text-[var(--color-primary)]" />
          {t.aulaSectionTitle}
        </h2>
        <p className="mt-3 text-sm text-gray-700">{t.aulaDesc}</p>
        <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-[var(--color-primary-dark)]">
          <i className="bi bi-person-check-fill" />
          {t.aulaSociosOnly}
        </p>

        <div className="mt-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
            {t.aulaPricesTitle}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {t.aulaPrices.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3"
              >
                <span className="text-sm text-gray-700">{item.label}</span>
                <span className="font-display text-lg font-bold text-[var(--color-primary-dark)]">{item.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Extraescolares ───────────────────────────────────── */}
      <section id="extraescolares" className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
        <h2 className="section-title text-xl">
          <i className="bi bi-controller mr-2 text-[var(--color-primary)]" />
          {t.extraSectionTitle}
        </h2>
        <p className="mt-3 text-sm text-gray-700">{t.extraDesc}</p>
        <div className="mt-4">
          <Link
            href={`/${lang}/extraescolares`}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-primary-dark)]"
          >
            <i className="bi bi-arrow-right" />
            {t.extraCta}
          </Link>
        </div>
      </section>

      {/* ── Comedor ──────────────────────────────────────────── */}}
      <section id="comedor" className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
        <h2 className="section-title text-xl">
          <i className="bi bi-cup-hot mr-2 text-[var(--color-primary)]" />
          {t.comedorSectionTitle}
        </h2>

        <p className="mt-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
          <i className="bi bi-info-circle mr-1.5" />
          {t.comedorNote}
        </p>

        <div className="mt-4">
          <Link
            href={`/${lang}/comedor`}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-primary-dark)]"
          >
            <i className="bi bi-file-earmark-arrow-down" />
            {t.comedorMenuBtn}
          </Link>
        </div>

        <p className="mt-5 text-sm text-gray-700">{t.comedorDesc}</p>

        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-900">{t.comedorCta}</p>
          <Link
            href={`/${lang}/contacto`}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] hover:underline"
          >
            <i className="bi bi-envelope" />
            {t.comedorCtaBtn}
          </Link>
        </div>
      </section>
    </div>
  );
}
