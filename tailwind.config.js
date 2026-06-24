/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Bella CRM brand palette — dark base, pink + gold accents
        ink: {
          DEFAULT: '#0f0f0f',
          50: '#1a1a1a',
          100: '#202020',
          200: '#2a2a2a',
          300: '#363636',
        },
        rose: {
          DEFAULT: '#d4a5a5',
          soft: '#e0bcbc',
          deep: '#b98787',
        },
        gold: {
          DEFAULT: '#c9a96e',
          soft: '#dcc39a',
          deep: '#a98c54',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(201,169,110,0.15), 0 8px 30px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
}
