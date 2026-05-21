import type { Lang } from "@/types/domain";

interface QuienesSomosPageProps {
  params: Promise<{ lang: Lang }>;
}

const estatutosArticles = [
  { n: "1", title: "Denominación", body: "Con la denominación de Asociación de Familias Remontival Familia Elkartea, se constituye en Estella una asociación sin ánimo de lucro, que se regirá por los presentes Estatutos, por los acuerdos válidamente adoptados por sus Órganos Directivos dentro de sus competencias, y por la legislación vigente en materia de asociaciones." },
  { n: "2", title: "Domicilio y Ámbito territorial", body: "El domicilio social se fija en el Colegio Público Remontival, calle Remontival nº 7, Estella. El ámbito territorial es el escolar correspondiente al citado Colegio." },
  { n: "3", title: "Duración", body: "La Asociación se constituye por tiempo indefinido. Su disolución se realizará conforme a los presentes Estatutos y a la legislación vigente." },
  { n: "4", title: "Fines", body: "Asistir y apoyar a las familias en la educación; colaborar con el Centro educativo; promover la participación activa de las familias; facilitar su representación en el Consejo Escolar; promover actividades educativas, culturales, extraescolares y de bienestar; desarrollar acciones formativas e informativas; fomentar la igualdad, la inclusión y la convivencia intercultural; y colaborar con administraciones y entidades sociales." },
  { n: "5", title: "Socios/as", body: "Integrarán la Asociación los padres, madres y tutores legales del alumnado del Centro que, habiendo cursado debidamente su solicitud, deseen cooperar con sus fines y acepten los presentes Estatutos." },
  { n: "6", title: "Derechos y deberes", body: "Derechos: asistir con voz y voto a las Asambleas; elegir y ser elegido para la Junta; participar en actividades; recibir servicios; proponer asuntos; informarse del funcionamiento. Deberes: aceptar los Estatutos; estar al corriente de las cuotas; contribuir a los fines; respetar la transparencia." },
  { n: "7", title: "Pérdida de la condición de socio/a", body: "Por renuncia, pérdida de la condición de padre/madre/tutor del alumnado, impago de cuotas, o acuerdo de la Junta Directiva por incumplimiento de obligaciones estatutarias (ratificado por la primera Asamblea General)." },
  { n: "8", title: "Asamblea General", body: "Órgano supremo de la Asociación. Se reunirá ordinariamente una vez al año y extraordinariamente cuando lo exija la ley, la Junta o lo solicite al menos el 20% de los socios." },
  { n: "9", title: "Convocatorias y quórum", body: "Convocatoria con al menos 8 días de antelación. Primera convocatoria: mitad de socios. Segunda: cualquier número. Acuerdos por mayoría simple." },
  { n: "10", title: "Facultades de la Asamblea Ordinaria", body: "Aprobar memoria, balance y presupuestos. Elegir miembros de la Junta Directiva." },
  { n: "11", title: "Facultades de la Asamblea Extraordinaria", body: "Modificar Estatutos; decidir sobre cuestiones de la Junta o el 20% de socios; autorizar enajenaciones; acordar la disolución. En empate, el/la Presidente/a tiene voto de calidad." },
  { n: "12", title: "Composición de la Junta Directiva", body: "Presidente/a, Vicepresidente/a, Secretario/a, Tesorero/a y hasta 10 vocales." },
  { n: "13", title: "Duración de los cargos", body: "Dos años, con posibilidad de reelección. La Junta se renueva por mitades mediante sufragio libre y secreto." },
  { n: "14", title: "Reuniones de la Junta", body: "Al menos una vez al mes y siempre que lo solicite el/la Presidente/a o al menos 4 miembros." },
  { n: "15", title: "Funciones de la Junta Directiva", body: "Ejecutar acuerdos de la Asamblea; representar legalmente a la Asociación; administrar fondos; resolver sobre admisión y baja de socios; elaborar memorias y presupuestos; proponer expulsiones; crear comisiones de trabajo." },
  { n: "16", title: "Acuerdos", body: "Mayoría simple con asistencia de al menos la mitad de la Junta. En caso de empate, el/la Presidente/a tiene voto de calidad." },
  { n: "17", title: "Gratuidad del cargo", body: "Todos los miembros ejercerán sus cargos con carácter gratuito." },
  { n: "18", title: "Funciones del/la Presidente/a", body: "Representación legal; convocar y presidir reuniones; autorizar disposiciones de fondos junto al/la Tesorero/a; autorizar actas." },
  { n: "19", title: "Funciones del/la Vicepresidente/a", body: "Apoyar al/la Presidente/a y sustituirle en caso de urgencia, enfermedad, imposibilidad o delegación." },
  { n: "20", title: "Funciones del/la Secretario/a", body: "Actuar como tal en Asambleas y Juntas; gestionar correspondencia; llevar libros de registro de socios y actas." },
  { n: "21", title: "Funciones del/la Tesorero/a", body: "Custodiar fondos; llevar libro de cuentas; autorizar disposiciones de fondos junto al/la Presidente/a; preparar balances." },
  { n: "22", title: "Constitución de la Junta", body: "Válida con la presencia del/la Presidente/a (o Vicepresidente/a en sustitución) y al menos la mitad de los miembros." },
  { n: "23", title: "Régimen económico", body: "La Asociación se constituye sin patrimonio fundacional." },
  { n: "24", title: "Recursos económicos", body: "Cuotas y aportaciones voluntarias; subvenciones y ayudas públicas o privadas; cualquier otro recurso lícito aprobado por la Asamblea. Todos los recursos se gestionarán con transparencia." },
  { n: "25", title: "Disolución", body: "Por acuerdo de la Asamblea General Extraordinaria con mayoría de dos tercios. Los bienes sobrantes se destinarán a fines educativos o sociales, preferentemente a favor del alumnado del Colegio Remontival." },
];

const content = {
  es: {
    motto: "Construyamos nuestra escuela",
    mottoSub: "Elkarrekin Egiten Dugu Eskola",
    welcome:
      "Desde la Junta de la Asociación de Familias Remontival, te damos la bienvenida a nuestro sitio web. Si tu familia forma parte de la comunidad del Colegio Público Remontival, ser socio de la AFA te puede aportar muchas ventajas:",
    benefits: [
      { label: "Aula Matinal", href: "extraescolares" },
      { label: "Extraescolares", href: "extraescolares" },
      { label: "Talleres y actividades en familia", href: "actividades" },
      { label: "7% de descuento en la compra de libros de texto en las librerías de la ciudad", href: null },
      { label: "Asistir a las Asambleas con voz y voto", href: null },
    ],
    missionTitle: "Sin ánimo de lucro y con transparencia, la AFA se enfoca en:",
    mission: [
      { icon: "bi-people-fill",       text: "Apoyar a las familias en la educación y desarrollo de sus hijos" },
      { icon: "bi-building",          text: "Aportar al buen funcionamiento del colegio y colaborar para mejorar la calidad educativa" },
      { icon: "bi-hand-thumbs-up",    text: "Fomentar la participación activa de familias y tutores en la vida escolar" },
      { icon: "bi-person-badge",      text: "Representar a las familias en el Consejo Escolar y otros órganos" },
      { icon: "bi-heart-pulse",       text: "Promover hábitos de vida saludables, la educación emocional y el bienestar personal y social" },
      { icon: "bi-globe2",            text: "Impulsar la igualdad, la inclusión y la convivencia intercultural en nuestra comunidad escolar" },
    ],
    federacionTitle: "Federación y modelos educativos",
    federacion:
      "La AFA del Colegio Remontival forma parte de la Federación de Asociaciones de Familias del Alumnado de Navarra Herrikoa, entidad que defiende la Escuela Pública y nos ofrece apoyo y asesoramiento legal.",
    modelos:
      "Está formada por familias de los dos modelos educativos que se imparten en el centro: Modelo D y Programa A-G/PAI. Todas las madres, padres y tutores legales del alumnado del Colegio Remontival pueden hacerse socios de la AFA.",
    ctaSocio: "Hazte socio de la AFA",
    ctaEstatutos: "Lee los estatutos",
    salaTitle: "Sala de la AFA",
    sala: "Disponemos de una amplia sala cedida por el colegio donde desarrollamos actividades para las familias y organizamos las actividades extraescolares. Este espacio está equipado con materiales para talleres y encuentros, y cuenta además con un rincón Lego integrado en el proyecto educativo del centro. Los socios de la AFA pueden proponer actividades para llevar a cabo en la Sala.",
    salaContact: "Mándanos un correo con tu propuesta",
    juntaTitle: "La Junta Directiva",
    junta: "La Junta Directiva de la AFA Remontival se compone por miembros de la comunidad escolar que se han comprometido de forma voluntaria a gestionar las actividades de la AFA. Nos encargamos de la administración y organización de servicios como la acogida matinal, los extraescolares, actividades para familias y actividades comunitarias. La Junta toma decisiones sobre aportaciones económicas apoyando la compra de material y mejoras de las instalaciones del colegio. También representa los intereses de las familias en contextos institucionales como el Consejo Escolar de Navarra y la Comisión General de Escolarización de Navarra.",
    juntaCtaText: "Si quieres contribuir con tus ideas, destrezas o tiempo a nuestra comunidad escolar, te animamos a unirte a la Junta.",
    juntaCta: "Contacta con nosotros",
    estatutosTitle: "Estatutos",
    estatutosDesc: "Puedes descargar los estatutos completos de la AFA Remontival en formato PDF.",
    estatutosDl: "Descargar estatutos (PDF)",
    estatutosArticles,
  },
  eu: {
    motto: "Elkarrekin Egiten Dugu Eskola",
    mottoSub: "Construyamos nuestra escuela",
    welcome:
      "Remontival Familien Elkarteko Batzardetik, ongi etorri gure webgunera. Zure familia Remontival Ikastetxe Publikoko komunitatearen parte bada, AFAko bazkide izateak abantaila ugari ekar diezazuke:",
    benefits: [
      { label: "Goizeko Harrera", href: "extraescolares" },
      { label: "Eskolaz Kanpoko Jarduerak", href: "extraescolares" },
      { label: "Familientzako tailerrak eta jarduerak", href: "actividades" },
      { label: "%7ko deskontua hiriko liburudendetako testu-liburuetan", href: null },
      { label: "Batzar Orokorretan hitz egiteko eta botoa emateko eskubidea", href: null },
    ],
    missionTitle: "Irabazi asmorik gabe eta gardenki, AFA honetan zentratzen da:",
    mission: [
      { icon: "bi-people-fill",       text: "Familiei seme-alaben hezkuntzan eta garapenean laguntzea" },
      { icon: "bi-building",          text: "Ikastetxearen funtzionamendu egokia sustatzea eta hezkuntza-kalitatea hobetzea" },
      { icon: "bi-hand-thumbs-up",    text: "Familien eta tutoreen parte-hartze aktiboa bultzatzea eskola-bizitzan" },
      { icon: "bi-person-badge",      text: "Familiak Eskola Kontseiluan eta beste organoetan ordezkatzea" },
      { icon: "bi-heart-pulse",       text: "Bizi-ohitura osasuntsuak, hezkuntza emozionala eta ongizate pertsonala eta soziala sustatzea" },
      { icon: "bi-globe2",            text: "Berdintasuna, inklusioa eta kultur arteko bizikidetza bultzatzea gure eskola-komunitatean" },
    ],
    federacionTitle: "Federazioa eta hezkuntza-ereduak",
    federacion:
      "Remontival Ikastetxeko AFAk Nafarroako Ikasleen Familien Elkarteko Herrikoa Federazioko kide da, Eskola Publikoa defendatzen duen eta laguntza eta aholkularitza juridikoa eskaintzen digun erakundea.",
    modelos:
      "Ikastetxean ematen diren bi hezkuntza-ereduetako familiek osatzen dute: D Eredua eta A-G/PAI Programa. Remontival Ikastetxeko edozein guraso eta tutorrek AFA bazkide izan daitezke.",
    ctaSocio: "Egin AFAko bazkide",
    ctaEstatutos: "Irakurri estatutuak",
    salaTitle: "AFAren Gela",
    sala: "Ikastetxeak utzitako gela handi bat daukagu, familien jarduerak eta eskolaz kanpoko jarduerak antolatzeko erabiltzen duguna. Espazio hau tailerretarako materialez hornituta dago eta ikastetxeko hezkuntza-proiektuan integratutako Lego txoko bat ere badauka. AFAko bazkideek jarduerak proposatu ditzakete Gelan egiteko.",
    salaContact: "Bidali iezaguzu zure proposamena mezu elektroniko batean",
    juntaTitle: "Batzorde Nagusia",
    junta: "AFAko Batzorde Nagusia borondatez AFAren jarduerak kudeatzera konpromezatu diren eskola-komunitateko kidez osatuta dago. Goizeko harrera, eskolaz kanpoko jarduerak, familientzako jarduerak eta komunitate-jarduerak bezalako zerbitzuen administrazio eta antolakuntzaz arduratzen gara. Batzordeak erabakiak hartzen ditu ikastetxearen materialak eta instalazioak hobetzen laguntzen duten ekarpenen inguruan. Nafarroako Eskola Kontseiluan eta Eskolatzeko Batzorde Nagusian ere familien interesak ordezkatzen ditugu.",
    juntaCtaText: "Zure ideiak, gaitasunak edo denbora gure eskola-komunitatearen alde jarri nahi badituzu, animatzen zaitugu Batzordera batzera.",
    juntaCta: "Jarri gurekin harremanetan",
    estatutosTitle: "Estatutuak",
    estatutosDesc: "AFA Remontivaleko estatutu osoak PDF formatuan deskarga ditzakezu.",
    estatutosDl: "Estatutuak deskargatu (PDF)",
    estatutosArticles,
  },
};

export default async function QuienesSomosPage({ params }: QuienesSomosPageProps) {
  const { lang } = await params;
  const t = content[lang];

  return (
    <div className="space-y-6">

      {/* ── Hero bienvenida ─────────────────────────────────── */}
      <section className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm md:p-8">
        <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-[var(--color-primary)]">
          {t.mottoSub}
        </p>
        <h1 className="section-title">{t.motto}</h1>
        <p className="mt-4 text-base text-[var(--color-muted)]">{t.welcome}</p>

        <ul className="mt-4 space-y-2">
          {t.benefits.map((b) => (
            <li key={b.label} className="flex items-start gap-2 text-sm text-gray-700">
              <i className="bi bi-check-circle-fill mt-0.5 shrink-0 text-[var(--color-primary)]" />
              {b.href ? (
                <a
                  href={`/${lang}/${b.href}`}
                  className="font-medium text-[var(--color-primary)] underline underline-offset-2 hover:text-[var(--color-primary-dark)]"
                >
                  {b.label}
                </a>
              ) : (
                <span>{b.label}</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* ── Misión ─────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-base font-semibold text-[var(--color-primary-dark)]">
          {t.missionTitle}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {t.mission.map((m) => (
            <article
              key={m.text}
              className="flex gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm"
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[var(--color-primary)]">
                <i className={`bi ${m.icon} text-lg`} />
              </span>
              <p className="text-sm text-gray-700">{m.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Federación + modelos ────────────────────────────── */}
      <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
        <h2 className="mb-2 font-bold text-[var(--color-primary-dark)]">
          <i className="bi bi-diagram-3-fill mr-2" />
          {t.federacionTitle}
        </h2>
        <p className="text-sm text-gray-700">{t.federacion}</p>
        <p className="mt-2 text-sm text-gray-700">{t.modelos}</p>
      </section>

      {/* ── CTAs ────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        <a
          href="/socios"
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-primary-dark)]"
        >
          <i className="bi bi-person-plus-fill" />
          {t.ctaSocio}
        </a>
        <a
          href="#estatutos"
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-primary)] shadow-sm transition hover:bg-emerald-50"
        >
          <i className="bi bi-file-text" />
          {t.ctaEstatutos}
        </a>
      </div>

      {/* ── Sala de la AFA ──────────────────────────────────── */}
      <section className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
        <h2 className="section-title text-xl">
          <i className="bi bi-door-open mr-2 text-[var(--color-primary)]" />
          {t.salaTitle}
        </h2>
        {/* TODO: añadir foto de la sala — colocar imagen en public/assets/ y reemplazar este bloque */}
        <div className="mt-4 flex aspect-video w-full items-center justify-center rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50 text-[var(--color-muted)]">
          <span className="flex flex-col items-center gap-2 text-sm">
            <i className="bi bi-image text-3xl" />
            Foto de la sala (próximamente)
          </span>
        </div>
        <p className="mt-4 text-sm text-gray-700">{t.sala}</p>
        <a
          href={`/${lang}/contacto`}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] hover:underline"
        >
          <i className="bi bi-envelope" />
          {t.salaContact}
        </a>
      </section>

      {/* ── La Junta ────────────────────────────────────────── */}
      <section className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
        <h2 className="section-title text-xl">
          <i className="bi bi-people mr-2 text-[var(--color-primary)]" />
          {t.juntaTitle}
        </h2>
        <p className="mt-4 text-sm text-gray-700">{t.junta}</p>
        <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-4">
          <p className="text-sm text-amber-800">{t.juntaCtaText}</p>
          <a
            href={`/${lang}/contacto`}
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:underline"
          >
            <i className="bi bi-arrow-right-circle" />
            {t.juntaCta}
          </a>
        </div>
      </section>

      {/* ── Estatutos ───────────────────────────────────────── */}
      <section id="estatutos" className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
        <h2 className="section-title text-xl">
          <i className="bi bi-file-earmark-text mr-2 text-[var(--color-primary)]" />
          {t.estatutosTitle}
        </h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">{t.estatutosDesc}</p>
        <a
          href="/assets/estatutos-afa.pdf"
          download
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-emerald-100"
        >
          <i className="bi bi-download" />
          {t.estatutosDl}
        </a>

        {t.estatutosArticles.length > 0 && (
          <details className="mt-5">
            <summary className="cursor-pointer select-none text-sm font-semibold text-[var(--color-primary-dark)] hover:underline">
              Ver texto completo de los estatutos
            </summary>
            <div className="mt-4 space-y-3">
              {t.estatutosArticles.map((art) => (
                <div key={art.n} className="rounded-xl border border-emerald-50 bg-gray-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-primary)]">
                    Artículo {art.n}. — {art.title}
                  </p>
                  <p className="mt-1 text-sm text-gray-700">{art.body}</p>
                </div>
              ))}
            </div>
          </details>
        )}
      </section>

    </div>
  );
}
