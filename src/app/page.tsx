import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-background)] p-6">
      <section className="w-full max-w-xl rounded-2xl border border-emerald-100 bg-white p-8 text-center shadow-sm">
        <h1 className="font-display text-3xl font-extrabold text-[var(--color-primary-dark)]">
          APYMA Remontival
        </h1>
        <p className="mt-3 text-[var(--color-muted)]">
          Selecciona idioma para acceder al sitio.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/es"
            className="rounded-md bg-[var(--color-primary)] px-4 py-2 font-semibold text-white"
          >
            Entrar en castellano
          </Link>
          <Link
            href="/eu"
            className="rounded-md bg-emerald-100 px-4 py-2 font-semibold text-[var(--color-primary-dark)]"
          >
            Euskaraz sartu
          </Link>
        </div>
      </section>
    </main>
  );
}
