"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useSupabaseSession } from "@/hooks/use-supabase-session";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser";

interface SocioPerfil {
  id: string;
  nombre: string;
  apellidos: string;
  rol: string;
  activo: boolean;
}

export default function AdminPage() {
  const { session, loading } = useSupabaseSession();
  const router = useRouter();

  const [usuarios, setUsuarios] = useState<SocioPerfil[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const isAdmin = session?.user.app_metadata?.role === "admin";

  // Redirigir si no es admin
  useEffect(() => {
    if (!loading && (!session || !isAdmin)) {
      router.replace("/socios");
    }
  }, [loading, session, isAdmin, router]);

  useEffect(() => {
    if (!isAdmin) return;

    async function fetchUsuarios() {
      const supabase = getBrowserSupabaseClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase.from("socios_perfiles") as any)
        .select("id, nombre, apellidos, rol, activo")
        .order("apellidos", { ascending: true });

      if (error) {
        setErrorMsg("Error al cargar los usuarios.");
      } else {
        setUsuarios((data as SocioPerfil[]) ?? []);
      }
      setLoadingUsers(false);
    }

    fetchUsuarios();
  }, [isAdmin]);

  async function handleDelete(id: string) {
    setDeletingId(id);
    setErrorMsg("");
    const supabase = getBrowserSupabaseClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("socios_perfiles") as any)
      .delete()
      .eq("id", id);

    if (error) {
      setErrorMsg("No se pudo eliminar el usuario. Asegúrate de haber ejecutado 0002_cleanup.sql en Supabase.");
    } else {
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    }
    setDeletingId(null);
    setConfirmId(null);
  }

  const rolLabels: Record<string, string> = { admin: "Administrador", editor: "Editor", socio: "Socio" };
  const rolColors: Record<string, string> = {
    admin: "bg-purple-100 text-purple-800",
    editor: "bg-blue-100 text-blue-800",
    socio: "bg-emerald-100 text-emerald-800",
  };

  if (loading || (!session && !loading)) {
    return (
      <main className="container-base py-10">
        <div className="mx-auto h-80 max-w-4xl animate-pulse rounded-2xl bg-emerald-50" />
      </main>
    );
  }

  if (!isAdmin) return null;

  return (
    <main className="container-base py-10">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* Cabecera */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="section-title">Panel de administración</h1>
            <p className="text-sm text-[var(--color-muted)]">Gestión de socios registrados</p>
          </div>
          <a
            href={`/${typeof window !== "undefined" ? (localStorage.getItem("afa-lang") ?? "es") : "es"}/`}
            className="flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50"
          >
            <i className="bi bi-house" />
            <span>Inicio</span>
          </a>
        </div>

        {/* Tabla de usuarios */}
        <div className="rounded-2xl border border-emerald-100 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-emerald-100 px-5 py-3 flex items-center justify-between">
            <h2 className="font-bold text-[var(--color-primary-dark)]">
              <i className="bi bi-people-fill mr-2" />
              Socios registrados
            </h2>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-[var(--color-primary-dark)]">
              {usuarios.length}
            </span>
          </div>

          {errorMsg && (
            <div className="m-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
              <i className="bi bi-exclamation-triangle mr-1.5" />{errorMsg}
            </div>
          )}

          {loadingUsers ? (
            <div className="space-y-3 p-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 animate-pulse rounded-md bg-emerald-50" />
              ))}
            </div>
          ) : usuarios.length === 0 ? (
            <p className="p-5 text-center text-[var(--color-muted)]">No hay socios registrados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-emerald-50 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                    <th className="px-5 py-3">Nombre</th>
                    <th className="px-5 py-3">Apellidos</th>
                    <th className="px-5 py-3">Rol</th>
                    <th className="px-5 py-3">Estado</th>
                    <th className="px-5 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-50">
                  {usuarios.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 font-medium text-[var(--color-primary-dark)]">
                        {u.nombre || <span className="italic text-[var(--color-muted)]">—</span>}
                      </td>
                      <td className="px-5 py-3 text-gray-700">
                        {u.apellidos || <span className="italic text-[var(--color-muted)]">—</span>}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${rolColors[u.rol] ?? "bg-gray-100 text-gray-700"}`}>
                          {rolLabels[u.rol] ?? u.rol}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {u.activo
                          ? <span className="flex items-center gap-1 text-emerald-700"><i className="bi bi-check-circle-fill" />Activo</span>
                          : <span className="flex items-center gap-1 text-gray-400"><i className="bi bi-x-circle" />Inactivo</span>
                        }
                      </td>
                      <td className="px-5 py-3 text-right">
                        {/* Evitar que el admin se elimine a sí mismo */}
                        {u.id === session?.user.id ? (
                          <span className="text-xs text-[var(--color-muted)] italic">Tu cuenta</span>
                        ) : confirmId === u.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-xs text-red-600">¿Confirmar?</span>
                            <button
                              type="button"
                              onClick={() => handleDelete(u.id)}
                              disabled={deletingId === u.id}
                              className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                            >
                              {deletingId === u.id ? "…" : "Sí, eliminar"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmId(null)}
                              className="rounded-md border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmId(u.id)}
                            className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                          >
                            <i className="bi bi-trash mr-1" />Eliminar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-xs text-[var(--color-muted)]">
          <i className="bi bi-info-circle mr-1" />
          Eliminar un socio borra su perfil de la aplicación. La cuenta de acceso en Supabase Auth permanece; para eliminarla definitivamente usa el panel de Supabase → Authentication → Users.
        </p>
      </div>
    </main>
  );
}
