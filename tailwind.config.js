/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false,
  theme: {
    fontFamily: {
      "serif-primary": ["Nanum Myeongjo", "serif"],
      "serif-secondary": ["Bitter", "serif"],
      "sans-primary": ["Lato", "sans-serif"],
      "sans-document": ["Montserrat", "sans-serif"],
      "serif-primary-tamil": ["Arima Madurai", "serif"],
      "sans-primary-tamil": ["Anek Tamil", "sans-serif"],
      "sans-document-tamil": ["Catamaran", "sans-serif"],
    },
    extend: {
      screens: {
        xs: "500px",
      },
      colors: {
        "overlay-mid": "rgba(237, 242, 247, 0.6)",
      },
      spacing: {
        xxxs: ".1rem",
        xxs: ".25rem",
        xs: ".5rem",
        sm: "1rem",
        md: "1.5rem",
        lg: "2rem",
        xl: "3rem",
        "2xl": "6rem",
        "2.5xl": "7.5rem",
        "3xl": "9rem",
      },
      transitionProperty: {
        "max-height": "max-height",
      },
      typography: {
        DEFAULT: {
          css: {
            width: "65ch",
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
