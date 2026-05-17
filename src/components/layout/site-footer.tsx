export function SiteFooter() {
  return (
    <footer className="mt-14 bg-[var(--color-primary-dark)] py-8 text-white">
      <div className="container-base flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-lg font-bold uppercase tracking-wide">APYMA Remontival</p>
          <p className="text-sm text-emerald-100">Comunidad educativa activa y participativa.</p>
        </div>

        <div className="flex items-center gap-4 text-xl">
          <a href="#" aria-label="Instagram" className="hover:text-emerald-200">
            <i className="bi bi-instagram" />
          </a>
          <a href="#" aria-label="Facebook" className="hover:text-emerald-200">
            <i className="bi bi-facebook" />
          </a>
          <a href="#" aria-label="Correo" className="hover:text-emerald-200">
            <i className="bi bi-envelope-fill" />
          </a>
        </div>
      </div>
    </footer>
  );
}
