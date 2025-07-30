/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        title: ['var(--title-font)'],
        body: ['var(--body-font)'],
        ui: ['var(--ui-font)'],
      },
    },
  },
  plugins: [],
}

