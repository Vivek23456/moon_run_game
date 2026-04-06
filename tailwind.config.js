/** @type {import('tailwindcss').Config} */
export default {
  // System light/dark via prefers-color-scheme (default in Tailwind v3)
  darkMode: "media",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
