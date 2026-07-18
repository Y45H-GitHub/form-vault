/**
 * FormVault design tokens.
 *
 * Every semantic color is an RGB-triple CSS variable defined in
 * src/shared/globals.css, themed automatically via prefers-color-scheme —
 * the app follows the Windows theme with no in-app switch. The function-form
 * values below keep Tailwind's opacity modifiers (e.g. bg-surface/80) working.
 */
const withOpacity = (varName) => ({ opacityValue }) =>
  opacityValue === undefined ? `rgb(var(${varName}))` : `rgb(var(${varName}) / ${opacityValue})`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
  content: ['./src/**/*.{html,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Windows 11 native type. Bundled with the OS — no network fetch,
        // correct rendering offline, and native feel per the design brief.
        sans: ['"Segoe UI Variable Text"', '"Segoe UI"', 'system-ui', 'sans-serif'],
        display: ['"Segoe UI Variable Display"', '"Segoe UI"', 'system-ui', 'sans-serif'],
        mono: ['"Cascadia Mono"', 'Consolas', 'ui-monospace', 'monospace']
      },
      fontSize: {
        // Desktop-density type scale
        caption: ['11px', { lineHeight: '14px' }],
        label: ['12px', { lineHeight: '16px' }],
        body: ['13px', { lineHeight: '18px' }],
        'body-lg': ['14px', { lineHeight: '20px' }],
        heading: ['15px', { lineHeight: '20px', fontWeight: '600', letterSpacing: '-0.01em' }],
        display: ['18px', { lineHeight: '24px', fontWeight: '600', letterSpacing: '-0.02em' }]
      },
      colors: {
        canvas: withOpacity('--fv-canvas'),
        surface: withOpacity('--fv-surface'),
        card: withOpacity('--fv-card'),
        hover: withOpacity('--fv-hover'),
        active: withOpacity('--fv-active'),
        ink: {
          DEFAULT: withOpacity('--fv-ink'),
          secondary: withOpacity('--fv-ink-secondary'),
          muted: withOpacity('--fv-ink-muted')
        },
        stroke: {
          // NOT wrapped in withOpacity/rgb() — these are already full color values (hex in
          // light mode, rgba() in dark mode) so they can be blended over any surface. Nesting
          // rgba() inside rgb() is invalid CSS and silently resolves to currentColor.
          DEFAULT: 'var(--fv-stroke)',
          subtle: 'var(--fv-stroke-subtle)'
        },
        accent: {
          DEFAULT: withOpacity('--fv-accent'),
          hover: withOpacity('--fv-accent-hover'),
          ink: withOpacity('--fv-accent-ink'),
          subtle: 'var(--fv-accent-subtle)' // pre-built rgba — no opacity modifier needed
        },
        success: withOpacity('--fv-success'),
        warning: withOpacity('--fv-warning'),
        danger: withOpacity('--fv-danger'),
        category: {
          personal: '#818cf8',
          financial: '#34d399',
          business: '#fbbf24',
          documents: '#f87171',
          custom: '#c084fc'
        }
      },
      borderRadius: {
        // Radius system: controls 6px, cards 10px, floating surfaces 14px, pills full
        control: '6px',
        card: '10px',
        float: '14px',
        pill: '9999px'
      },
      boxShadow: {
        // Elevation system (shadow color driven by theme variable)
        'elevation-1': '0 1px 2px rgb(var(--fv-shadow) / 0.12), 0 1px 4px rgb(var(--fv-shadow) / 0.08)',
        'elevation-2': '0 4px 16px rgb(var(--fv-shadow) / 0.18), 0 2px 6px rgb(var(--fv-shadow) / 0.10)',
        'elevation-3': '0 16px 48px rgb(var(--fv-shadow) / 0.28), 0 6px 16px rgb(var(--fv-shadow) / 0.16)'
      },
      transitionDuration: {
        DEFAULT: '120ms',
        fast: '80ms',
        slow: '150ms'
      },
      keyframes: {
        'float-in': {
          '0%': { opacity: '0', transform: 'translateY(6px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' }
        },
        'toast-out': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-6px)' }
        },
        'pulse-ring': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgb(var(--fv-accent) / 0.4)' },
          '50%': { boxShadow: '0 0 0 4px rgb(var(--fv-accent) / 0)' }
        }
      },
      animation: {
        'float-in': 'float-in 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fade-in 120ms ease-out',
        'fade-out': 'fade-out 120ms ease-out',
        'toast-in': 'toast-in 120ms cubic-bezier(0.16, 1, 0.3, 1)',
        'toast-out': 'toast-out 120ms ease-out',
        'pulse-ring': 'pulse-ring 1200ms ease-in-out infinite'
      }
    }
  },
  plugins: []
};
