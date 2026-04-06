/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        pump: {
          bg: "#050508",
          green: "#00ff88",
          pink: "#ff00aa",
          dim: "#1a1a22",
        },
      },
    },
  },
  plugins: [],
};
