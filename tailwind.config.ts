import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        fslabs: {
          bg: "#050505",
          "bg-2": "#0a0a0a",
          gold: "#C9A84C",
          "gold-light": "#F0C040",
          "gold-dark": "#8B6914",
          "gold-glow": "rgba(201,168,76,0.25)",
          text: "#F5F0E8",
          muted: "rgba(245,240,232,0.4)",
          border: "rgba(201,168,76,0.12)",
        },
      },
      animation: {
        reveal: "reveal 0.6s ease-out",
        glow: "glow 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        reveal: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(201,168,76,0.25)" },
          "50%": { boxShadow: "0 0 20px rgba(201,168,76,0.5)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
