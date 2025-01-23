/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          deep: '#060818',      // Negro base
          midnight: '#0A0E24',   // Negro medianoche ligeramente más claro
          nebula: '#0D1229',    // Negro nebuloso con toque azulado
          cosmic: '#111633',    // Negro cósmico con más azul
          card: '#0C1225',      // Color para cards
          cardHover: '#0F1A33', // Color hover para cards
          silver: '#C4CED4',    // Plateado (mantenido)
          lunar: '#F0F4F8',     // Blanco lunar (mantenido)
          accent: '#1A2642',    // Color de acento para detalles
        },
      },
      fontFamily: {
        'space': ['Space Grotesk', 'sans-serif'],
        'saira': ['Saira', 'sans-serif'],
        'noto': ['Noto Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
