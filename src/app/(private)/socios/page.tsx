"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { useSupabaseSession } from "@/hooks/use-supabase-session";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser";

export default function SociosPage() {
  const router = useRouter();
  const { session, loading } = useSupabaseSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const supabase = getBrowserSupabaseClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Mensaje generico para no revelar si el email existe o no (previene enumeracion de usuarios)
      setMessage("Email o contrasena incorrectos. Por favor, intentalo de nuevo.");
    } else {
      const savedLang = typeof window !== "undefined"
        ? (localStorage.getItem("afa-lang") ?? "es")
        : "es";
      router.push(`/${savedLang}`);
    }
  };

  const handleLogout = async () => {
    const supabase = getBrowserSupabaseClient();
    await supabase.auth.signOut();
    setMessage("Sesion cerrada.");
  };

  return (
    <main className="container-base py-10">
      <section className="mx-auto max-w-xl space-y-5 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
        <h1 className="section-title">Area privada de socios</h1>

        {loading ? <p>Cargando sesion...</p> : null}

        {!loading && session ? (
          <div className="space-y-4">
            <p className="text-[var(--color-muted)]">Has iniciado sesion como {session.user.email}.</p>
            <button
              type="button"
              className="rounded-md bg-[var(--color-primary)] px-4 py-2 font-semibold text-white"
              onClick={handleLogout}
            >
              Cerrar sesion
            </button>
          </div>
        ) : null}

        {!loading && !session ? (
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="mb-1 block text-sm font-semibold" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-md border border-emerald-200 px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold" htmlFor="password">
                Contrasena
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="current-password"
                className="w-full rounded-md border border-emerald-200 px-3 py-2"
              />
            </div>

            <button
              type="submit"
              className="rounded-md bg-[var(--color-primary)] px-4 py-2 font-semibold text-white"
            >
              Iniciar sesion
            </button>
          </form>
        ) : null}

        {message ? <p className="text-sm text-[var(--color-primary-dark)]">{message}</p> : null}
      </section>
    </main>
  );
}
