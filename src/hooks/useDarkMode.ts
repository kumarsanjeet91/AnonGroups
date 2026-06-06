"use client";

import { useEffect, useState } from "react";

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("anon-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const enabled = stored ? stored === "dark" : prefersDark;
    setIsDark(enabled);
    document.documentElement.classList.toggle("dark", enabled);
  }, []);

  function toggleDarkMode() {
    setIsDark((current) => {
      const next = !current;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("anon-theme", next ? "dark" : "light");
      return next;
    });
  }

  return { isDark, toggleDarkMode };
}
