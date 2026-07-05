/** @type {import('tailwindcss').Config} */
const withOpacity = (varName) => ({ opacityValue }) =>
  opacityValue === undefined ? `rgb(var(${varName}))` : `rgb(var(${varName}) / ${opacityValue})`;

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        bg: {
          primary: withOpacity('--fv-bg-primary'),
          secondary: withOpacity('--fv-bg-secondary'),
          card: withOpacity('--fv-bg-card'),
          hover: withOpacity('--fv-bg-hover')
        },
        accent: {
          DEFAULT: '#6366f1',
          hover: '#4f46e5'
        },
        text: {
          primary: withOpacity('--fv-text-primary'),
          secondary: withOpacity('--fv-text-secondary'),
          muted: withOpacity('--fv-text-muted')
        },
        border: {
          DEFAULT: withOpacity('--fv-border')
        },
        success: '#22c55e',
        category: {
          personal: '#6366f1',
          financial: '#10b981',
          business: '#f59e0b',
          documents: '#ef4444',
          custom: '#8b5cf6'
        }
      },
      keyframes: {
        'slide-fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'flash-success': {
          '0%': { backgroundColor: 'rgba(34, 197, 94, 0.25)' },
          '100%': { backgroundColor: 'transparent' }
        }
      },
      animation: {
        'slide-fade-in': 'slide-fade-in 150ms ease-out',
        'flash-success': 'flash-success 1.5s ease-out'
      }
    }
  },
  plugins: []
};
