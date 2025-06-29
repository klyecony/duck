const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
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
            primary: {
              50: "#f0f9ed",
              100: "#dff2d8",
              200: "#c1e6b4",
              300: "#94d184",
              400: "#65ba4f",
              500: "#16610e",
              600: "#145a0d",
              700: "#12500c",
              800: "#0f420a",
              900: "#0c3408",
              DEFAULT: "#16610E",
              foreground: "#ffffff",
            },
            secondary: {
              50: "#fff1ed",
              100: "#ffe0d6",
              200: "#ffbfa8",
              300: "#ff9370",
              400: "#ff6436",
              500: "#ff4d00",
              600: "#e63900",
              700: "#cc2900",
              800: "#a61e00",
              900: "#801400",
              DEFAULT: "#ff4d00",
              foreground: "#ffffff",
            },
            default: {
              50: "#f8f9fa",
              100: "#f1f3f4",
              200: "#eaecee",
              300: "#e0e5e7",
              400: "#d1d6d9",
              500: "#c2c8cb",
              600: "#aab1b5",
              700: "#8e969b",
              800: "#6f787e",
              900: "#4f5861",
              DEFAULT: "#c2c8cb",
              foreground: "#4e4e4e",
            },
            content1: "#e7e2e0",
            focus: "#ff4d00",
          },
        },
        dark: {
          colors: {
            background: "#030302",
            foreground: "#c9c9c9",
            primary: {
              DEFAULT: "#16610E",
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
