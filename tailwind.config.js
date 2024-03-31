/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '992px',
      'xl': '1200px',
      '2xl': '1400x',
    },
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        }
      },
      animation: {
        fadeIn: "fadeIn 0.2s ease-out forwards"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
}

