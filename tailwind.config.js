/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './views/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        zinc: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
        emerald: {
          400: '#34d399',
          900: '#064e3b',
          950: '#022c22',
        },
        amber: {
          400: '#fbbf24',
          900: '#78350f',
          950: '#451a03',
        },
        rose: {
          400: '#fb7185',
          900: '#881337',
          950: '#4c0519',
        },
      },
    },
  },
  plugins: [],
}

