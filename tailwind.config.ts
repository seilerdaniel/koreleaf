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
        praxis: {
          graphite: "#111311",      // Fondo principal
          surface: "#252A24",       // Tarjetas y paneles (Olive Charcoal)
          text: "#F4F4EE",          // Texto principal (Off-white)
          lime: "#D7F36B",          // Acento (Lime)
          "lime-hover": "#c8e855",
        },
      },
    },
  },
  plugins: [],
};
export default config;