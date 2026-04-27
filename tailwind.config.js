/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: 'class', // ✅ LINHA OBRIGATÓRIA PARA O TOGGLE FUNCIONAR
  theme: { extend: {} },
  plugins: [],
};