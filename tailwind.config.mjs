/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        terracotta: '#C2522D',
        salvia: '#3F6B4E',
        inchiostro: '#1F2A44',
        carta: '#FBF6EE',
        ocra: '#E0A526',
        bordo: '#EADFCD',
        pill: '#D9CBB3',
        muted: '#5A6275',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['"Atkinson Hyperlegible"', 'sans-serif'],
        dsa: ['OpenDyslexic', 'sans-serif'],
      },
    },
  },
};
