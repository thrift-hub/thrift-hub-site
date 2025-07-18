import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf8f4',
          100: '#f9eee5',
          200: '#f2dcc7',
          300: '#e8c4a0',
          400: '#dba678',
          500: '#ce8b5b',
          600: '#c17849',
          700: '#a1613e',
          800: '#815037',
          900: '#6a422f',
        },
        earth: {
          sage: {
            50: '#f6f8f6',
            100: '#e9efea',
            200: '#d4e0d6',
            300: '#b3c7b8',
            400: '#8da895',
            500: '#6d8c76',
            600: '#56715f',
            700: '#465a4d',
            800: '#3a4a40',
            900: '#313d36',
          },
          terracotta: {
            50: '#fdf6f4',
            100: '#fae8e4',
            200: '#f4d6cd',
            300: '#ebbaa8',
            400: '#de9578',
            500: '#d47759',
            600: '#c25a3f',
            700: '#a1472f',
            800: '#853d2b',
            900: '#6f362a',
          },
          cream: {
            50: '#fefdf9',
            100: '#fefbf0',
            200: '#fdf4e0',
            300: '#fbeac4',
            400: '#f7da9e',
            500: '#f2c574',
            600: '#e5a647',
            700: '#d18c2a',
            800: '#ae7025',
            900: '#8d5c24',
          },
          stone: {
            50: '#fafaf9',
            100: '#f4f4f2',
            200: '#e8e7e3',
            300: '#d6d4ce',
            400: '#bfbcb4',
            500: '#a8a49a',
            600: '#8f8a7e',
            700: '#777169',
            800: '#625d55',
            900: '#524e47',
          },
        },
        thrift: {
          green: '#6d8c76',
          rust: '#d47759',
          cream: '#fdf4e0',
          charcoal: '#524e47',
          sage: '#8da895',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-lora)', 'Georgia', 'serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#524e47',
            a: {
              color: '#ce8b5b',
              '&:hover': {
                color: '#c17849',
              },
            },
            h1: {
              fontFamily: 'var(--font-playfair)',
              color: '#313d36',
            },
            h2: {
              fontFamily: 'var(--font-playfair)',
              color: '#313d36',
            },
            h3: {
              fontFamily: 'var(--font-playfair)',
              color: '#313d36',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config