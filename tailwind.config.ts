import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#2D5016',
          light: '#3D6B20',
          dark: '#1E3610',
        },
        olive: {
          DEFAULT: '#6B7C3A',
          light: '#8A9E52',
          muted: '#C4CC9A',
        },
        sand: {
          DEFAULT: '#E8DCC8',
          light: '#F5F0E8',
          dark: '#D4C5A9',
        },
        clay: {
          DEFAULT: '#A0522D',
          light: '#C46D3E',
          dark: '#7A3D1F',
        },
        earth: {
          DEFAULT: '#5C3D2E',
          muted: '#8B6558',
        },
        risk: {
          low: '#3A7D44',
          'low-bg': '#EAF4EC',
          medium: '#C68B2F',
          'medium-bg': '#FDF3E3',
          high: '#B53D3D',
          'high-bg': '#FAE8E8',
          critical: '#7B1D1D',
          'critical-bg': '#F5D5D5',
        },
        status: {
          success: '#3A7D44',
          'success-bg': '#EAF4EC',
          warning: '#C68B2F',
          'warning-bg': '#FDF3E3',
          error: '#B53D3D',
          'error-bg': '#FAE8E8',
          info: '#2D6A8F',
          'info-bg': '#E5F0F7',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      spacing: {
        '4.5': '1.125rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        card: '0 2px 8px rgba(28, 22, 14, 0.08)',
        'card-hover': '0 4px 16px rgba(28, 22, 14, 0.12)',
        md: '0 4px 12px rgba(28, 22, 14, 0.10), 0 2px 4px rgba(28, 22, 14, 0.06)',
        lg: '0 10px 28px rgba(28, 22, 14, 0.12), 0 4px 8px rgba(28, 22, 14, 0.08)',
        modal: '0 20px 60px rgba(28, 22, 14, 0.20), 0 8px 20px rgba(28, 22, 14, 0.12)',
      },
      screens: {
        xs: '480px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}

export default config
