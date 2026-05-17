import Link from "next/link";

interface ContentCardProps {
  title: string;
  summary: string;
  date?: string;
  image?: string;
  href: string;
}

export function ContentCard({ title, summary, date, image, href }: ContentCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-sm">
      {image ? (
        <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
      ) : null}

      <div className="space-y-3 p-4">
        {date ? <p className="text-xs font-semibold uppercase text-[var(--color-muted)]">{date}</p> : null}
        <h3 className="font-display text-lg font-bold text-[var(--color-primary-dark)]">{title}</h3>
        <p className="text-sm text-[var(--color-muted)]">{summary}</p>
        <Link href={href} className="inline-flex items-center gap-2 font-semibold text-[var(--color-primary)]">
          Leer mas <i className="bi bi-arrow-right" />
        </Link>
      </div>
    </article>
  );
}
