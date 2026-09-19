/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FAF8F5',
          100: '#F5F2EC',
          200: '#EBE5D8',
          300: '#DFD6C3',
          400: '#CFC2A7',
        },
        charcoal: {
          800: '#262320',
          900: '#1C1917',
          950: '#12100E',
        },
        forest: {
          700: '#234433',
          800: '#1B3628',
          900: '#13281D',
        },
        saffron: {
          400: '#E29742',
          500: '#C8782A',
          600: '#A9601D',
        },
        terracotta: {
          500: '#B8502A',
          600: '#9B3F1D',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', '"Manrope"', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(28, 25, 23, 0.05), 0 1px 2px rgba(28, 25, 23, 0.03)',
        'card': '0 4px 16px -2px rgba(28, 25, 23, 0.06)',
        'elevated': '0 12px 28px -4px rgba(28, 25, 23, 0.09)',
      }
    },
  },
  plugins: [],
}

