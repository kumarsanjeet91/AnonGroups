"use client";

import { useEffect, useState } from "react";
import { CurrentUser } from "@/types/chat";

export function useAuth() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetch("/api/auth/me", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return null;
        const data = await response.json();
        return data.user as CurrentUser;
      })
      .then((currentUser) => {
        if (mounted) setUser(currentUser);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { user, loading };
}
