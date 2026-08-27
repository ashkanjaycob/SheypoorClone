/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'mobile': '0px',
      'tablet': '640px',
      'laptop': '768px',
      'desktop': '980px',
      'sdesktop': '1200px',
    },
    extend: {
      colors: {
        main: {
          DEFAULT: '#3E7BFA',
          lighter: '#6698FA',
          darker: '#004FC4',
        },
        dark: {
          0: '#1C1C28',
          1: '#28293D',
          2: '#555770',
          3: '#8F90A6',
          4: '#C7C9D9',
        },
        light: {
          0: '#E4E4EB',
          1: '#EBEBF0',
          2: '#F2F2F5',
          3: '#FAFAFC',
          4: '#FFFFFF',
          special: '#F5F9FF',
        },
        // Dark theme specific tokens
        night: {
          bg: '#0A0A0E',
          surface: '#121218',
          card: '#161622',
          border: '#242436',
          muted: '#8E8EA8',
          text: '#F5F5FA',
        },
        accent: {
          red: '#FF3B3B',
          'red-bg': '#FFE6E6',
          teal: '#00B7C4',
          'teal-bg': '#E5FFFF',
          green: '#06C270',
          'green-bg': '#E3FFF1',
          orange: '#FF8800',
          'orange-bg': '#FFF8E5',
        },
      },
      fontFamily: {
        vazir: ['Vazir', 'Vazirmatn', 'system-ui', 'sans-serif'],
        latin: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'heading-1': ['2.1875rem', { lineHeight: '1.3', fontWeight: '700' }],
        'heading-2': ['1.75rem', { lineHeight: '1.3', fontWeight: '700' }],
        'heading-3': ['1.4375rem', { lineHeight: '1.4', fontWeight: '600' }],
        'heading-4': ['1.1875rem', { lineHeight: '1.4', fontWeight: '600' }],
        'heading-5': ['0.9375rem', { lineHeight: '1.5', fontWeight: '600' }],
        'heading-6': ['0.8125rem', { lineHeight: '1.5', fontWeight: '600' }],
        'body-1': ['1.0625rem', { lineHeight: '1.6' }],
        'body-2': ['0.9375rem', { lineHeight: '1.6' }],
        'body-3': ['0.8125rem', { lineHeight: '1.5' }],
        'body-4': ['0.6875rem', { lineHeight: '1.5' }],
      },
      width: {
        'container-width': '1200px',
      },
      maxWidth: {
        'container': '1200px',
      },
      height: {
        'header-desktop': '97px',
        'header-mobile': '56px',
        'mobile-navbar': '64px',
      },
      borderRadius: {
        'sheypoor': '12px',
        'sheypoor-lg': '16px',
        'sheypoor-xl': '20px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'card-dark': '0 2px 8px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'card-hover-dark': '0 6px 16px rgba(0, 0, 0, 0.6)',
        'header': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'header-dark': '0 2px 8px rgba(0, 0, 0, 0.5)',
        'bottom-nav': '0 -2px 10px rgba(0, 0, 0, 0.08)',
        'bottom-nav-dark': '0 -2px 10px rgba(0, 0, 0, 0.5)',
        'modal': '0 8px 32px rgba(0, 0, 0, 0.15)',
        'modal-dark': '0 8px 32px rgba(0, 0, 0, 0.7)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}