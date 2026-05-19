export type Lang = "es" | "eu";

export type RolSocio = "admin" | "editor" | "socio";

export interface Noticia {
  id: number;
  slug: string;
  titulo_es: string;
  titulo_eu: string;
  resumen_es: string;
  resumen_eu: string;
  contenido_es: string;
  contenido_eu: string;
  imagen_url: string;
  fecha_publicacion: string;
  publicada: boolean;
}

export interface Actividad {
  id: string | number;
  slug: string;
  titulo_es: string;
  titulo_eu: string;
  descripcion_es: string;
  descripcion_eu: string;
  fecha_inicio: string;
  hora_inicio?: string;
  ubicacion: string;
  tipo: string;
  imagen_url?: string;
  publicada: boolean;
}

export interface Consejo {
  id: string | number;
  slug: string;
  titulo_es: string;
  titulo_eu: string;
  contenido_es: string;
  contenido_eu: string;
  imagen_url?: string;
  orden: number;
  publicado: boolean;
  created_at?: string;
}

export interface DocumentoComedor {
  id: number;
  mes: string;
  anio: number;
  pdf_es_url: string;
  pdf_eu_url: string;
  publicado: boolean;
}
