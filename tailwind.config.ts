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
        kore: {
          charcoal: "#171B18",   // Fondo principal oscuro[cite: 7]
          forest: "#243B2F",     // Superficies / tarjetas oscuras[cite: 7]
          sage: "#9EAF91",       // Acentos, progreso y victorias[cite: 7]
          cream: "#E6E9D8",      // Texto principal / Fondos claros[cite: 7]
          sand: "#C7AE8A",       // Detalles cálidos y badges[cite: 7]
        },
      },
    },
  },
  plugins: [],
};
export default config;