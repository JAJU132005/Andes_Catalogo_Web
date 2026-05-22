/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      colors: {
        andes: {
          ink: '#0B1F3A',
          deep: '#10294D',
          blue: '#1E5FE8',
          sky: '#36C5F0',
          gold: '#E8A317',
          mist: '#F4F7FC',
        }
      },
      keyframes: {
        'fade-up': { '0%': { opacity: 0, transform: 'translateY(16px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        'pulse-soft': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.5 } },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease forwards',
        'pulse-soft': 'pulse-soft 1.6s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
