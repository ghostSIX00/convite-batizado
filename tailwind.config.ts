import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        nevoa: "#EDF4FB",
        ceu: "#BCD5EC",
        fita: "#6F9BC4",
        marinho: "#33506E",
        ouro: { DEFAULT: "#A97C1F", claro: "#D2AE5A", escuro: "#8A6416" },
        creme: "#FBF8F0",
        tinta: "#2F3B48",
        folha: "#7C9A76",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        script: ["var(--font-script)", "cursive"],
      },
      keyframes: {
        subir: {
          "0%": { transform: "translateY(24px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        surgir: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
      },
      animation: {
        subir: "subir .38s cubic-bezier(.2,.8,.2,1) both",
        surgir: "surgir .25s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
