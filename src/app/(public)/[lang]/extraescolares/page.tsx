import Link from "next/link";

import type { Lang } from "@/types/domain";

interface ExtraescolaresPageProps {
  params: Promise<{ lang: Lang }>;
}

interface Activity {
  id: string;
  icon: string;
  name: string;
  instructor: string;
  instructorUrl?: string;
  day: string;
  time: string;
  age: string;
  price: string;
}

const activities: Record<Lang, Activity[]> = {
  es: [
    {
      id: "teatro",
      icon: "bi-camera-reels-fill",
      name: "Teatro",
      instructor: "1º Trim.: María Araiz | 2º y 3º Trim.: Beatriz Cornago",
      day: "Jueves",
      time: "16:30 – 17:30",
      age: "A partir de 4º E.P.",
      price: "30€/mes",
    },
    {
      id: "creacion",
      icon: "bi-palette-fill",
      name: "Creación artística",
      instructor: "Alatz López Lameiro",
      day: "Jueves",
      time: "13:50 – 14:50 (1er turno comedor)",
      age: "Infantil y 1º, 2º y 3º de primaria",
      price: "35€/mes aprox. (según inscritos)",
    },
    {
      id: "robotica",
      icon: "bi-robot",
      name: "Robótica",
      instructor: "DiscoverBricks",
      instructorUrl: "https://www.discoverbricks.es",
      day: "Viernes",
      time: "16:30 – 17:30",
      age: "A partir de 1º E.P.",
      price: "36€/mes",
    },
    {
      id: "patinaje",
      icon: "bi-lightning-fill",
      name: "Patinaje",
      instructor: "Manu Goñi (Artedeslizarte)",
      day: "Miércoles",
      time: "15:30 – 16:30",
      age: "A partir de 2º E.I. (4 años)",
      price: "20€/mes",
    },
    {
      id: "judo",
      icon: "bi-trophy-fill",
      name: "Judo",
      instructor: "Andrés Moreno",
      day: "Lunes y Jueves",
      time: "16:30 – 17:30",
      age: "A partir de 3º E.I. (5 años)",
      price: "1 día: 20€/mes | 2 días: 34€/mes",
    },
    {
      id: "costura",
      icon: "bi-scissors",
      name: "Costura Creativa",
      instructor: "María Leorza",
      day: "Lunes mediodía",
      time: "13:50 – 14:50 (1er turno comedor)",
      age: "Infantil y 1º, 2º y 3º de primaria",
      price: "35€/mes + material inicial",
    },
  ],
  eu: [
    {
      id: "teatro",
      icon: "bi-camera-reels-fill",
      name: "Antzerkia",
      instructor: "1. Hiruh.: María Araiz | 2. eta 3. Hiruh.: Beatriz Cornago",
      day: "Osteguna",
      time: "16:30 – 17:30",
      age: "LH 4 mailatik aurrera",
      price: "30€/hilabete",
    },
    {
      id: "creacion",
      icon: "bi-palette-fill",
      name: "Sormen artistikoa",
      instructor: "Alatz López Lameiro",
      day: "Osteguna",
      time: "13:50 – 14:50 (lehenengo txanda)",
      age: "Haur Hezkuntza eta LH 1, 2 eta 3",
      price: "35€/hilabete aprox. (izena emandakoen arabera)",
    },
    {
      id: "robotika",
      icon: "bi-robot",
      name: "Robotika",
      instructor: "DiscoverBricks",
      instructorUrl: "https://www.discoverbricks.es",
      day: "Ostirala",
      time: "16:30 – 17:30",
      age: "LH 1 mailatik aurrera",
      price: "36€/hilabete",
    },
    {
      id: "patinaia",
      icon: "bi-lightning-fill",
      name: "Patinaia",
      instructor: "Manu Goñi (Artedeslizarte)",
      day: "Asteazkena",
      time: "15:30 – 16:30",
      age: "HH 4 urtetik aurrera",
      price: "20€/hilabete",
    },
    {
      id: "judo",
      icon: "bi-trophy-fill",
      name: "Judo",
      instructor: "Andrés Moreno",
      day: "Astelehena eta Osteguna",
      time: "16:30 – 17:30",
      age: "HH 5 urtetik aurrera",
      price: "Egun 1: 20€/hilabete | 2 egun: 34€/hilabete",
    },
    {
      id: "costura",
      icon: "bi-scissors",
      name: "Jostaketa Sortzailea",
      instructor: "María Leorza",
      day: "Astelehena eguerdian",
      time: "13:50 – 14:50 (lehenengo txanda)",
      age: "Haur Hezkuntza eta LH 1, 2 eta 3",
      price: "35€/hilabete + hasierako materiala",
    },
  ],
};

const ui: Record<
  Lang,
  {
    title: string;
    intro: string;
    instructor: string;
    day: string;
    time: string;
    age: string;
    price: string;
    enrollTitle: string;
    enrollText: string;
    enrollBtn: string;
    memberNote: string;
    memberBtn: string;
    periodLabel: string;
    periodDates: string;
    orgTitle: string;
    orgText: string;
    contactBtn: string;
  }
> = {
  es: {
    title: "Actividades Extraescolares",
    intro:
      "La AFA organiza y gestiona todas las actividades extraescolares del centro. Haz clic en cada actividad para ver los detalles.",
    instructor: "Impartida por",
    day: "Día",
    time: "Horario",
    age: "Edad",
    price: "Precio",
    enrollTitle: "¿Listo para apuntarte?",
    enrollText:
      "Completa el formulario de inscripción para reservar tu plaza. Rellena un formulario por cada actividad a la que quieras inscribir a tu hijo o hija.",
    enrollBtn: "Formulario de inscripción",
    memberNote:
      "Para inscribirse en las extraescolares es necesario ser socio de la AFA.",
    memberBtn: "Hazte socio aquí",
    periodLabel: "Plazo de inscripción",
    periodDates: "19 de Diciembre – 4 de Enero",
    orgTitle: "Organización y gestión",
    orgText:
      "Es la AFA quien gestiona y organiza todas las actividades extraescolares del centro. Si estás interesado en alguna actividad o quieres proponer una nueva, contáctanos.",
    contactBtn: "Contáctanos",
  },
  eu: {
    title: "Eskolaz Kanpoko Jarduerak",
    intro:
      "AFAk ikastetxeko eskolaz kanpoko jarduera guztiak antolatzen eta kudeatzen ditu. Sakatu jarduera bakoitzean xehetasunak ikusteko.",
    instructor: "Nork ematen du",
    day: "Eguna",
    time: "Ordutegia",
    age: "Adina",
    price: "Prezioa",
    enrollTitle: "Izena emateko prest?",
    enrollText:
      "Bete izena emateko formularioa zure tokia gordetzeko. Jarduera bakoitzeko formulario bat bete.",
    enrollBtn: "Izena emateko formularioa",
    memberNote: "Izena emateko AFAko bazkide izan behar duzu.",
    memberBtn: "Egin bazkide hemen",
    periodLabel: "Izena emateko epea",
    periodDates: "Abenduaren 19 – Urtarrilaren 4",
    orgTitle: "Antolaketa eta kudeaketa",
    orgText:
      "AFAk ikastetxeko eskolaz kanpoko jarduera guztiak antolatzen eta kudeatzen ditu. Jarduera berri bat proposatu nahi baduzu edo informazio gehiago behar baduzu, jarri gurekin harremanetan.",
    contactBtn: "Harremanetan jarri",
  },
};

export default async function ExtraescolaresPage({
  params,
}: ExtraescolaresPageProps) {
  const { lang } = await params;
  const acts = activities[lang];
  const t = ui[lang];

  return (
    <div className="space-y-8">
      {/* Cabecera */}
      <section className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm md:p-8">
        <h1 className="section-title">{t.title}</h1>
        <p className="mt-3 text-[var(--color-muted)]">{t.intro}</p>
      </section>

      {/* Tarjetas de actividades */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {acts.map((act) => (
          <details
            key={act.id}
            className="group rounded-2xl border border-emerald-100 bg-white shadow-sm open:border-emerald-300"
          >
            <summary className="flex cursor-pointer list-none items-center gap-3 p-5 [&::-webkit-details-marker]:hidden">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[var(--color-primary)]">
                <i className={`bi ${act.icon} text-xl`} />
              </span>
              <span className="flex-1 font-display text-lg font-bold text-[var(--color-primary-dark)]">
                {act.name}
              </span>
              <i className="bi bi-chevron-down text-[var(--color-muted)] transition-transform group-open:rotate-180" />
            </summary>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-emerald-100 px-5 pb-5 pt-4 text-sm">
              <div>
                <p className="font-semibold text-[var(--color-primary-dark)]">
                  <i className="bi bi-person-fill mr-1" />
                  {t.instructor}
                </p>
                {act.instructorUrl ? (
                  <a
                    href={act.instructorUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--color-primary)] underline"
                  >
                    {act.instructor}
                  </a>
                ) : (
                  <p className="text-[var(--color-muted)]">{act.instructor}</p>
                )}
              </div>

              <div>
                <p className="font-semibold text-[var(--color-primary-dark)]">
                  <i className="bi bi-calendar3 mr-1" />
                  {t.day}
                </p>
                <p className="text-[var(--color-muted)]">{act.day}</p>
              </div>

              <div>
                <p className="font-semibold text-[var(--color-primary-dark)]">
                  <i className="bi bi-clock mr-1" />
                  {t.time}
                </p>
                <p className="text-[var(--color-muted)]">{act.time}</p>
              </div>

              <div>
                <p className="font-semibold text-[var(--color-primary-dark)]">
                  <i className="bi bi-people mr-1" />
                  {t.age}
                </p>
                <p className="text-[var(--color-muted)]">{act.age}</p>
              </div>

              <div className="col-span-2">
                <p className="font-semibold text-[var(--color-primary-dark)]">
                  <i className="bi bi-tag-fill mr-1" />
                  {t.price}
                </p>
                <p className="font-bold text-[var(--color-primary)]">
                  {act.price}
                </p>
              </div>
            </div>
          </details>
        ))}
      </div>

      {/* Inscripción */}
      <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm md:p-8">
        <h2 className="font-display text-2xl font-extrabold text-[var(--color-primary-dark)]">
          {t.enrollTitle}
        </h2>
        <p className="mt-2 text-[var(--color-muted)]">{t.enrollText}</p>

        <div className="mt-5">
          <a
            href="https://forms.gle/9d3fNr4nRAXaRBPz6"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-2.5 font-semibold text-white hover:bg-[var(--color-primary-dark)]"
          >
            <i className="bi bi-pencil-square" />
            {t.enrollBtn}
          </a>
        </div>

        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
          <p className="font-semibold text-amber-800">
            <i className="bi bi-exclamation-triangle-fill mr-1" />
            {t.memberNote}
          </p>
          <a
            href="https://forms.gle/781gPFtLM6yyVZyz5"
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-block text-[var(--color-primary)] underline"
          >
            {t.memberBtn} →
          </a>
        </div>

        <p className="mt-4 text-sm text-[var(--color-muted)]">
          <i className="bi bi-calendar-check mr-1" />
          <span className="font-semibold">{t.periodLabel}: </span>
          {t.periodDates}
        </p>
      </section>

      {/* Organización */}
      <section className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
        <h2 className="font-display text-xl font-bold text-[var(--color-primary-dark)]">
          {t.orgTitle}
        </h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">{t.orgText}</p>
        <Link
          href={`/${lang}/contacto`}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-emerald-300 px-4 py-2 text-sm font-semibold text-[var(--color-primary-dark)] hover:bg-emerald-50"
        >
          <i className="bi bi-envelope" />
          {t.contactBtn}
        </Link>
      </section>
    </div>
  );
}
