/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        midnight: '#000000', // Apple deep black
        glass: 'rgba(255, 255, 255, 0.1)',
        glassActive: 'rgba(255, 255, 255, 0.2)',
        gold: '#F5D0A9', // Subtle elegant gold
        subtle: '#8E8E93', // Apple gray
      },
      fontFamily: {
        thin: ['System'], // will rely on weight customization
      }
    },
  },
  plugins: [],
}
