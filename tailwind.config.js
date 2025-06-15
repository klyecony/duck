const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: "#e7e2e0",
            foreground: "#4e4e4e",
            content1: {
              DEFAULT: "#e7e2e0",
              foreground: "#4e4e4e",
            },
            primary: {
              DEFAULT: "#0014ff",
              foreground: "#ffffff",
            },
            secondary: {
              DEFAULT: "#ff4d00",
              foreground: "#ffffff",
            },
            focus: "#0014ff",
          },
        },
        dark: {
          colors: {
            background: "#030302",
            foreground: "#c9c9c9",
            primary: {
              DEFAULT: "#0014ff",
              foreground: "#ffffff",
            },
            secondary: {
              DEFAULT: "#ff4d00",
              foreground: "#ffffff",
            },
            focus: "#0014ff",
          },
        },
      },
    }),
  ],
};
