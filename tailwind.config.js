/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "light-secondary": "#fdfff5",
        "dark-primary": "#121212",
        "hr-custom": "#323232",
        "blue-custom": "#0077FF",
        "indigo-custom": "#5453E0",
        "green-custom": "#20BD5F",
        "red-custom": "#F44336",
        "pink-custom": "#E91E63",
        "grey-custom": "#DBE5E6",
      },
      fontFamily: {
        nunito: " 'Nunito', sans-serif",
      },
    },
  },
  plugins: [],
};
