import type { Actividad, Consejo, DocumentoComedor, Noticia } from "@/types/domain";

export const mockNoticias: Noticia[] = [
  {
    id: 1,
    slug: "fiesta-fin-curso",
    titulo_es: "Fiesta de fin de curso",
    titulo_eu: "Ikasturte amaierako jaia",
    resumen_es: "Programa y horarios para la fiesta de final de curso.",
    resumen_eu: "Ikasturte amaierako jaiaren egitaraua eta ordutegiak.",
    contenido_es: "Publicaremos en esta seccion toda la informacion oficial y documentos asociados.",
    contenido_eu: "Atal honetan informazio ofizial guztia eta lotutako dokumentuak argitaratuko ditugu.",
    imagen_url: "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&w=1200&q=80",
    fecha_publicacion: "2026-05-01",
    publicada: true,
  },
  {
    id: 2,
    slug: "asamblea-general",
    titulo_es: "Asamblea general ordinaria",
    titulo_eu: "Ohiko batzar nagusia",
    resumen_es: "Convocatoria, orden del dia y documentacion previa.",
    resumen_eu: "Deialdia, gai-zerrenda eta aurreko dokumentazioa.",
    contenido_es: "Aqui apareceran las actas y acuerdos de forma accesible para las familias.",
    contenido_eu: "Hemen agiriak eta akordioak familientzat eskuragarri argitaratuko dira.",
    imagen_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    fecha_publicacion: "2026-04-20",
    publicada: true,
  },
];

export const mockActividades: Actividad[] = [
  {
    id: 1,
    slug: "taller-lectura",
    titulo_es: "Taller de lectura en familia",
    titulo_eu: "Familia irakurketa tailerra",
    descripcion_es: "Dinamicas para mejorar habitos lectores en casa.",
    descripcion_eu: "Etxeko irakurketa ohiturak hobetzeko dinamikak.",
    fecha_inicio: "2026-05-20",
    fecha_fin: "2026-05-20",
    ubicacion: "Biblioteca del centro",
    tipo: "Taller",
    publicada: true,
  },
  {
    id: 2,
    slug: "mercadillo-solidario",
    titulo_es: "Mercadillo solidario",
    titulo_eu: "Azoka solidarioa",
    descripcion_es: "Recaudacion para proyectos de mejora escolar.",
    descripcion_eu: "Eskola hobetzeko proiektuetarako diru-bilketa.",
    fecha_inicio: "2026-06-02",
    fecha_fin: "2026-06-02",
    ubicacion: "Patio principal",
    tipo: "Comunidad",
    publicada: true,
  },
];

export const mockConsejos: Consejo[] = [
  {
    id: 1,
    slug: "rutina-estudio",
    titulo_es: "Rutinas de estudio en casa",
    titulo_eu: "Etxeko ikasketa errutinak",
    contenido_es: "Proximamente publicaremos recomendaciones de orientacion familiar.",
    contenido_eu: "Laster familiei zuzendutako orientazio gomendioak argitaratuko ditugu.",
    imagen_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
    orden: 1,
    publicado: true,
  },
];

export const mockDocumentosComedor: DocumentoComedor[] = [
  {
    id: 1,
    mes: "Mayo",
    anio: 2026,
    pdf_es_url: "#",
    pdf_eu_url: "#",
    publicado: true,
  },
  {
    id: 2,
    mes: "Junio",
    anio: 2026,
    pdf_es_url: "#",
    pdf_eu_url: "#",
    publicado: true,
  },
];
