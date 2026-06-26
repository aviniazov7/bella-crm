/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0a0a0a',
          50: '#141414',
          100: '#1a1a1a',
          200: '#242424',
          300: '#2e2e2e',
          400: '#3a3a3a',
        },
        surface: '#0f0f0f',
        line: '#1f1f1f',
        muted: '#a0a0a0',
        rose: { DEFAULT: '#d4a5a5', soft: '#f3e4e4', deep: '#b98787' },
        gold: { DEFAULT: '#c08497', soft: '#e8c5cf', deep: '#4a2f35', fg: '#2a1419' },
        cream: '#faf0f2',
        positive: '#7fb88a',
        negative: '#cf8b8b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Arial', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 1px 0 rgba(255,255,255,0.02), 0 12px 40px rgba(0,0,0,0.45)',
        'soft-lg': '0 1px 0 rgba(255,255,255,0.03), 0 28px 70px rgba(0,0,0,0.55)',
        glow: '0 1px 2px rgba(0,0,0,0.3)',
        gold: '0 1px 2px rgba(0,0,0,0.3)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #e8c5cf 0%, #c08497 55%, #4a2f35 100%)',
        'rose-gradient': 'linear-gradient(135deg, #f3e4e4 0%, #d4a5a5 50%, #b98787 100%)',
        'champagne-text': 'linear-gradient(100deg, #e8c5cf 0%, #c08497 50%, #e8c5cf 100%)',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        shimmer: 'shimmer 1.6s infinite',
        float: 'float 9s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
