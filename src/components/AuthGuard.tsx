"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "./LoadingSpinner";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, router, user]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <LoadingSpinner label="Checking session" />
      </main>
    );
  }

  if (!user) return null;
  return <>{children}</>;
}
