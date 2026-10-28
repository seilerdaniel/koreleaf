// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        eleva: {
          graphite: "#101112", // Fondos oscuros
          slate: "#282B30",    // Tarjetas y superficies
          ivory: "#F7F7F2",    // Textos principales
          lime: "#C5F078",     // Acentos, progreso y victorias
        },
      },
    },
  },
  plugins: [],
};
export default config;