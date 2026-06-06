"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, useRef } from "react";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isRegister = mode === "register";
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        const msg = data.error || "Something went wrong.";
        setError(msg);
        // focus fields based on error content
        if (/username/i.test(msg) && usernameRef.current)
          usernameRef.current.focus();
        else if (/password/i.test(msg) && passwordRef.current)
          passwordRef.current.focus();
        return;
      }
      const next = searchParams.get("next") || "/groups";
      router.push(next);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <div className="w-full rounded-md border border-ink/10 bg-white p-6 shadow-soft dark:border-paper/10 dark:bg-white/10">
        <div className="mb-6">
          <Link href="/" className="text-2xl font-black">
            AnonGroups
          </Link>
          <p className="mt-2 text-sm text-ink/65 dark:text-paper/65">
            {isRegister
              ? "Create a private-by-default username."
              : "Welcome back to the public rooms."}
          </p>
        </div>

        <form onSubmit={submit} className="grid gap-4">
          <label className="grid gap-2 text-sm font-semibold">
            Username
            <input
              ref={usernameRef}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
              minLength={6}
              maxLength={20}
              pattern="[A-Za-z0-9_]{6,20}"
              title="Username must be 6-20 characters and may contain letters, numbers, or underscores."
              className="rounded-md border border-ink/15 bg-paper px-3 py-3 outline-none focus:border-grape focus:ring-2 focus:ring-grape/20 dark:border-paper/15 dark:bg-ink"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            Password
            <input
              ref={passwordRef}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              required
              minLength={6}
              className="rounded-md border border-ink/15 bg-paper px-3 py-3 outline-none focus:border-grape focus:ring-2 focus:ring-grape/20 dark:border-paper/15 dark:bg-ink"
            />
          </label>

          {error && (
            <div className="rounded-md border border-coral bg-coral/20 px-3 py-2 text-sm font-semibold text-ink dark:text-paper">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-ink px-4 py-3 font-black text-paper transition hover:bg-steel disabled:cursor-not-allowed disabled:opacity-60 dark:bg-paper dark:text-ink dark:hover:bg-mint"
          >
            {loading
              ? "Please wait..."
              : isRegister
              ? "Create account"
              : "Login"}
          </button>
        </form>

        <div className="mt-6 text-sm text-ink/65 dark:text-paper/65">
          {isRegister ? "Already registered?" : "Need a username?"}{" "}
          <Link
            className="font-black text-grape"
            href={isRegister ? "/login" : "/register"}
          >
            {isRegister ? "Login" : "Register"}
          </Link>
        </div>
      </div>
    </div>
  );
}
