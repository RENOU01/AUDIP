/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Fondo oscuro del logo / header / hero
        signal: {
          950: '#050810',
          900: '#0A0E1A',
          800: '#0F1626',
          700: '#16203A',
        },
        // Cian del trazo de electrocardiograma del logo
        pulse: {
          400: '#7DEBFB',
          500: '#3ED6EE',
          600: '#1FB8D4',
        },
        // Azul institucional / gubernamental para el contenido claro
        institutional: {
          50: '#F4F7FB',
          100: '#E6EDF6',
          600: '#1B3A6B',
          700: '#152E54',
          800: '#0F2140',
        },
        paper: '#F7F8FA',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        serif: ['"Source Serif 4"', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      backgroundImage: {
        'grid-faint': 'linear-gradient(rgba(62,214,238,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(62,214,238,0.06) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '40px 40px',
      },
    },
  },
  plugins: [],
}
