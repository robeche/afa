"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useSupabaseSession } from "@/hooks/use-supabase-session";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser";

interface UserMenuProps {
  loginLabel: string;
}

export function UserMenu({ loginLabel }: UserMenuProps) {
  const { session, loading } = useSupabaseSession();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleLogout() {
    setSigningOut(true);
    const supabase = getBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.refresh();
    setSigningOut(false);
  }

  // Don't render anything until session state is known (avoids flash)
  if (loading) {
    return (
      <div className="h-9 w-20 animate-pulse rounded-md bg-emerald-100" />
    );
  }

  if (!session) {
    return (
      <Link
        href="/socios"
        className="rounded-md bg-[var(--color-primary)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--color-primary-dark)]"
      >
        <i className="bi bi-person-lock mr-2" />
        <span className="hidden sm:inline">{loginLabel}</span>
      </Link>
    );
  }

  const email = session.user.email ?? "";
  // Show the part before @ truncated to 16 chars
  const shortName = email.split("@")[0].slice(0, 16);

  return (
    <div className="flex items-center gap-2">
      <span className="hidden items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-[var(--color-primary-dark)] sm:flex">
        <i className="bi bi-person-check-fill text-[var(--color-primary)]" />
        {shortName}
      </span>
      <button
        type="button"
        onClick={handleLogout}
        disabled={signingOut}
        title="Cerrar sesión"
        aria-label="Cerrar sesión"
        className="rounded-md border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
      >
        <i className="bi bi-box-arrow-right" />
      </button>
    </div>
  );
}
