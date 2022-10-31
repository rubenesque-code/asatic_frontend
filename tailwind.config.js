/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false,
  theme: {
    fontFamily: {
      date: ['Montserrat', 'sans-serif'],
      documentTitle: ['Nanum Myeongjo', 'serif'],
    },
    extend: {
      spacing: {
        xxxs: '.1rem',
        xxs: '.25rem',
        xs: '.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '6rem',
        '2.5xl': '7.5rem',
        '3xl': '9rem',
      },
      typography: {
        DEFAULT: {
          css: {
            width: '65ch',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
