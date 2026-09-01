/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dmrc: {
          red: '#C41230',
          darkRed: '#990E25',
          lightRed: '#FDF2F4',
          blue: '#0F2C59',
          navy: '#051329',
          gold: '#DAA520',
          grayBg: '#F8FAFC',
        }
      }
    },
  },
  plugins: [],
}
