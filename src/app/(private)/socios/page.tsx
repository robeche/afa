"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import { useSupabaseSession } from "@/hooks/use-supabase-session";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser";

// Carga diferida para evitar errores SSR con el widget de Cloudflare
const Turnstile = dynamic(
  () => import("@marsidev/react-turnstile").then((m) => m.Turnstile),
  { ssr: false }
);

type Tab = "login" | "register";

// ─── Formulario de inicio de sesión ──────────────────────────────────────────

function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const supabase = getBrowserSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      // Mensaje genérico para no revelar si el email existe o no
      setError("Email o contraseña incorrectos. Por favor, inténtalo de nuevo.");
    } else {
      const lang = localStorage.getItem("afa-lang") ?? "es";
      router.push(`/${lang}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label-base" htmlFor="login-email">Email</label>
        <input
          id="login-email" type="email" autoComplete="email" required
          value={email} onChange={(e) => setEmail(e.target.value)}
          className="input-base"
        />
      </div>
      <div>
        <label className="label-base" htmlFor="login-password">Contraseña</label>
        <div className="relative">
          <input
            id="login-password"
            type={showPwd ? "text" : "password"}
            autoComplete="current-password" required
            value={password} onChange={(e) => setPassword(e.target.value)}
            className="input-base pr-10"
          />
          <button
            type="button" onClick={() => setShowPwd(!showPwd)}
            aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <i className={`bi bi-eye${showPwd ? "-slash" : ""}`} />
          </button>
        </div>
      </div>

      {error && <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <button
        type="submit" disabled={busy}
        className="w-full rounded-lg bg-[var(--color-primary)] py-2.5 font-semibold text-white transition hover:bg-[var(--color-primary-dark)] disabled:opacity-60"
      >
        {busy ? "Accediendo…" : "Acceder"}
      </button>
    </form>
  );
}

// ─── Formulario de registro ───────────────────────────────────────────────────

function RegisterForm({ onRegistered }: { onRegistered: () => void }) {
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pwdConfirm, setPwdConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== pwdConfirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (!captchaToken) {
      setError("Por favor, completa la verificación de seguridad.");
      return;
    }

    setBusy(true);
    const supabase = getBrowserSupabaseClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Los metadatos se usan en el trigger handle_new_user() para crear socios_perfiles
        data: { nombre, apellidos },
      },
    });
    setBusy(false);

    if (error) {
      setError(error.message);
    } else {
      onRegistered();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label-base" htmlFor="reg-nombre">Nombre</label>
          <input
            id="reg-nombre" type="text" autoComplete="given-name" required
            value={nombre} onChange={(e) => setNombre(e.target.value)}
            className="input-base"
          />
        </div>
        <div>
          <label className="label-base" htmlFor="reg-apellidos">Apellidos</label>
          <input
            id="reg-apellidos" type="text" autoComplete="family-name" required
            value={apellidos} onChange={(e) => setApellidos(e.target.value)}
            className="input-base"
          />
        </div>
      </div>

      <div>
        <label className="label-base" htmlFor="reg-email">Email</label>
        <input
          id="reg-email" type="email" autoComplete="email" required
          value={email} onChange={(e) => setEmail(e.target.value)}
          className="input-base"
        />
      </div>

      <div>
        <label className="label-base" htmlFor="reg-password">Contraseña</label>
        <div className="relative">
          <input
            id="reg-password"
            type={showPwd ? "text" : "password"}
            autoComplete="new-password" required minLength={8}
            value={password} onChange={(e) => setPassword(e.target.value)}
            className="input-base pr-10"
          />
          <button
            type="button" onClick={() => setShowPwd(!showPwd)}
            aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <i className={`bi bi-eye${showPwd ? "-slash" : ""}`} />
          </button>
        </div>
        <p className="mt-1 text-xs text-[var(--color-muted)]">Mínimo 8 caracteres</p>
      </div>

      <div>
        <label className="label-base" htmlFor="reg-pwd-confirm">Confirmar contraseña</label>
        <input
          id="reg-pwd-confirm"
          type={showPwd ? "text" : "password"}
          autoComplete="new-password" required
          value={pwdConfirm} onChange={(e) => setPwdConfirm(e.target.value)}
          className="input-base"
        />
      </div>

      {/* Cloudflare Turnstile — clave de test local, reemplazar en GitHub Secrets */}
      <Turnstile
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "1x00000000000000000000AA"}
        onSuccess={setCaptchaToken}
        onError={() => setCaptchaToken("")}
        onExpire={() => setCaptchaToken("")}
      />

      {error && <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <button
        type="submit" disabled={busy || !captchaToken}
        className="w-full rounded-lg bg-[var(--color-primary)] py-2.5 font-semibold text-white transition hover:bg-[var(--color-primary-dark)] disabled:opacity-60"
      >
        {busy ? "Creando cuenta…" : "Crear cuenta"}
      </button>
    </form>
  );
}

// ─── Sección de perfil (usuario autenticado) ──────────────────────────────────

interface ProfileData {
  nombre: string;
  apellidos: string;
  rol: string;
}

function ProfileSection({ userId, email, userMetadata }: {
  userId: string;
  email: string;
  userMetadata: Record<string, string>;
}) {
  const [profile, setProfile] = useState<ProfileData>({ nombre: "", apellidos: "", rol: "socio" });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      const supabase = getBrowserSupabaseClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase.from("socios_perfiles") as any)
        .select("nombre, apellidos, rol")
        .eq("id", userId)
        .maybeSingle();
      setProfile({
        nombre: data?.nombre || userMetadata?.nombre || "",
        apellidos: data?.apellidos || userMetadata?.apellidos || "",
        rol: data?.rol || "socio",
      });
      // Cuenta desactivada por el admin → cerrar sesión automáticamente
      if (data && data.activo === false) {
        const supabase = getBrowserSupabaseClient();
        await supabase.auth.signOut();
        return;
      }
      setLoadingProfile(false);
    }
    fetchProfile();
  }, [userId, userMetadata]);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveMsg(null);
    const supabase = getBrowserSupabaseClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("socios_perfiles") as any)
      .upsert({ id: userId, nombre: profile.nombre, apellidos: profile.apellidos, rol: profile.rol, activo: true });
    setSaving(false);
    setSaveMsg(error
      ? { type: "err", text: "No se pudo guardar. Inténtalo de nuevo." }
      : { type: "ok", text: "Datos actualizados correctamente." }
    );
  }

  async function handleLogout() {
    const supabase = getBrowserSupabaseClient();
    await supabase.auth.signOut();
  }

  const rolLabels: Record<string, string> = { admin: "Administrador", editor: "Editor", socio: "Socio" };

  return (
    <div className="space-y-6">
      {/* Cabecera de bienvenida */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-[var(--color-primary)]">
            <i className="bi bi-person-fill text-xl" />
          </div>
          <div>
            <p className="font-semibold text-[var(--color-primary-dark)]">
              {profile.nombre || email.split("@")[0]}
            </p>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-[var(--color-primary-dark)]">
              {rolLabels[profile.rol] ?? profile.rol}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <a
            href={`/${typeof window !== "undefined" ? (localStorage.getItem("afa-lang") ?? "es") : "es"}/`}
            className="flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50"
          >
            <i className="bi bi-house" />
            <span>Inicio</span>
          </a>
          <button
            type="button" onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50"
          >
            <i className="bi bi-box-arrow-right" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>

      <hr className="border-emerald-100" />

      {/* Formulario de edición de perfil */}
      <div>
        <h2 className="mb-4 text-base font-bold text-[var(--color-primary-dark)]">Mis datos</h2>

        {loadingProfile ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-md bg-emerald-50" />
            ))}
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-base" htmlFor="prof-nombre">Nombre</label>
                <input
                  id="prof-nombre" type="text" autoComplete="given-name"
                  value={profile.nombre}
                  onChange={(e) => setProfile({ ...profile, nombre: e.target.value })}
                  className="input-base"
                />
              </div>
              <div>
                <label className="label-base" htmlFor="prof-apellidos">Apellidos</label>
                <input
                  id="prof-apellidos" type="text" autoComplete="family-name"
                  value={profile.apellidos}
                  onChange={(e) => setProfile({ ...profile, apellidos: e.target.value })}
                  className="input-base"
                />
              </div>
            </div>

            <div>
              <label className="label-base">Email</label>
              <input
                type="email" value={email} disabled
                className="input-base cursor-not-allowed bg-gray-50 text-gray-500"
              />
              <p className="mt-1 text-xs text-[var(--color-muted)]">El email no se puede cambiar desde aquí.</p>
            </div>

            {saveMsg && (
              <p
                role="alert"
                className={`rounded-md px-3 py-2 text-sm ${saveMsg.type === "ok"
                  ? "bg-emerald-50 text-emerald-800"
                  : "bg-red-50 text-red-700"
                }`}
              >
                {saveMsg.text}
              </p>
            )}

            <button
              type="submit" disabled={saving}
              className="rounded-lg bg-[var(--color-primary)] px-5 py-2 font-semibold text-white transition hover:bg-[var(--color-primary-dark)] disabled:opacity-60"
            >
              {saving ? "Guardando…" : "Guardar cambios"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function SociosPage() {
  const { session, loading } = useSupabaseSession();
  const [tab, setTab] = useState<Tab>("login");
  const [justRegistered, setJustRegistered] = useState(false);
  const router = useRouter();

  if (loading) {
    return (
      <main className="container-base py-10">
        <div className="mx-auto h-80 max-w-md animate-pulse rounded-2xl bg-emerald-50" />
      </main>
    );
  }

  return (
    <main className="container-base py-10">
      <section className="mx-auto max-w-md space-y-6 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">

        {session && justRegistered ? (
          <div className="space-y-5 text-center">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-[var(--color-primary)]">
                <i className="bi bi-people-fill text-3xl" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-[var(--color-primary-dark)]">
                ¡Bienvenido/a, {session.user.user_metadata?.nombre || session.user.email?.split("@")[0]}!
              </h1>
              <p className="text-sm text-[var(--color-muted)]">
                Tu cuenta ha sido creada. Ya eres parte de la
                <strong className="text-[var(--color-primary-dark)]"> Asociación de Familias de Remontival</strong>.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => { const lang = localStorage.getItem("afa-lang") ?? "es"; router.push(`/${lang}`); }}
                className="w-full rounded-lg bg-[var(--color-primary)] py-2.5 font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
              >
                <i className="bi bi-house mr-1.5" />Ir al inicio
              </button>
              <button
                type="button"
                onClick={() => setJustRegistered(false)}
                className="w-full rounded-lg border border-emerald-200 py-2.5 text-sm font-semibold text-[var(--color-primary-dark)] transition hover:bg-emerald-50"
              >
                <i className="bi bi-person mr-1.5" />Ver mi perfil
              </button>
            </div>
          </div>
        ) : session ? (
          <>
            <h1 className="section-title">Área de socios</h1>
            <ProfileSection
              userId={session.user.id}
              email={session.user.email ?? ""}
              userMetadata={session.user.user_metadata ?? {}}
            />
          </>
        ) : (
          <>
            <h1 className="section-title">Área de socios</h1>

            {/* Pestañas */}
            <div className="flex gap-1 rounded-lg border border-emerald-200 p-1">
              {(["login", "register"] as Tab[]).map((t) => (
                <button
                  key={t} type="button" onClick={() => setTab(t)}
                  className={[
                    "flex-1 rounded-md py-2 text-sm font-semibold transition",
                    tab === t
                      ? "bg-[var(--color-primary)] text-white shadow-sm"
                      : "text-[var(--color-muted)] hover:bg-emerald-50",
                  ].join(" ")}
                >
                  {t === "login" ? (
                    <><i className="bi bi-person-lock mr-1.5" />Iniciar sesión</>
                  ) : (
                    <><i className="bi bi-person-plus mr-1.5" />Crear cuenta</>
                  )}
                </button>
              ))}
            </div>

            {tab === "login" ? <LoginForm /> : <RegisterForm onRegistered={() => setJustRegistered(true)} />}
          </>
        )}
      </section>
    </main>
  );
}
