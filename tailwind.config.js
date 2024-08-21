/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.{html,js,ts,jsx,tsx}",    
  ],
  theme: {
    extend: {},
    fontFamily: {
        lilita: ['"Lilita One"', 'sans-serif'],
        titan: ['"Titan One"', 'sans-serif'],
    },
},
  plugins: [],
}