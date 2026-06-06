import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101418",
        paper: "#f7f8f4",
        mint: "#cdebd7",
        coral: "#ffb4a2",
        grape: "#7c5cff",
        steel: "#406170"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(16, 20, 24, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
