/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Kanit_400Regular"],
        kanit: ["Kanit_400Regular"],
        "kanit-medium": ["Kanit_500Medium"],
        "kanit-semibold": ["Kanit_600SemiBold"],
        "kanit-bold": ["Kanit_700Bold"],
      },
    },
  },
  plugins: [],
};