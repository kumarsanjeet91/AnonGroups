"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { DarkModeToggle } from "./DarkModeToggle";

export function Navbar({
  username,
  centerLabel,
  connectionStatus,
  onMenuClick,
  showMobileMenu,
}: {
  username?: string;
  centerLabel?: string;
  connectionStatus?: "connecting" | "connected" | "disconnected";
  onMenuClick?: () => void;
  showMobileMenu?: boolean;
}) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur dark:border-white/[0.08] dark:bg-[#0F172A]/95">
      <div className="grid h-16 grid-cols-[auto_1fr_auto] items-center gap-3 px-3 sm:px-4">
        <div className="col-start-1 flex min-w-0 items-center gap-2">
          {showMobileMenu && (
            <button
              type="button"
              onClick={onMenuClick}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-lg font-black text-slate-700 shadow-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/40 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100 md:hidden"
              aria-label="Open groups"
            >
              =
            </button>
          )}

          <Link
            href="/groups"
            className={`truncate text-lg font-black tracking-normal text-slate-950 dark:text-slate-50 sm:text-xl ${
              showMobileMenu ? "hidden md:inline" : ""
            }`}
          >
            AnonGroups
          </Link>
        </div>

        <div className="col-start-2 hidden min-w-0 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-black text-slate-700 shadow-sm dark:border-white/[0.08] dark:bg-[#111827] dark:text-slate-100 sm:block">
          <span className="block max-w-[34vw] truncate">
            {centerLabel || "Public Groups"}
          </span>
        </div>

        {/* mobile center label (placed in middle grid column so right-side controls aren't pushed) */}
        {showMobileMenu && centerLabel && (
          <div className="md:hidden col-start-2 text-center">
            <span className="min-w-0 truncate text-base font-black text-slate-950 dark:text-slate-50">
              {centerLabel}
            </span>
          </div>
        )}

        <div className="col-start-3 flex min-w-0 items-center justify-end gap-2">
          {connectionStatus && (
            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold capitalize text-slate-600 dark:border-white/[0.08] dark:bg-[#111827] dark:text-[#94A3B8] lg:flex">
              <span
                className={`h-2 w-2 rounded-full ${
                  connectionStatus === "connected"
                    ? "bg-emerald-400"
                    : "bg-orange-400"
                }`}
              />
              {connectionStatus}
            </div>
          )}
          {username ? (
            <>
              <button
                type="button"
                onClick={logout}
                className="hidden rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500/30 dark:border-white/10 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-rose-500/10 dark:hover:text-rose-200 sm:inline-flex"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              className="rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950"
              href="/login"
            >
              Login
            </Link>
          )}
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}
