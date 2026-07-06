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
        heading: ['15px', { lineHeight: '20px', fontWeight: '600' }],
        display: ['18px', { lineHeight: '24px', fontWeight: '600' }]
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
          DEFAULT: withOpacity('--fv-stroke'),
          subtle: withOpacity('--fv-stroke-subtle')
        },
        accent: {
          DEFAULT: withOpacity('--fv-accent'),
          hover: withOpacity('--fv-accent-hover'),
          ink: withOpacity('--fv-accent-ink')
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
        // Radius system: controls 6px, cards 10px, floating surfaces 14px
        control: '6px',
        card: '10px',
        float: '14px'
      },
      boxShadow: {
        // Elevation system (shadow color driven by theme variable)
        'elevation-1': '0 1px 2px rgb(var(--fv-shadow) / 0.10), 0 1px 3px rgb(var(--fv-shadow) / 0.08)',
        'elevation-2': '0 4px 12px rgb(var(--fv-shadow) / 0.14), 0 2px 4px rgb(var(--fv-shadow) / 0.10)',
        'elevation-3': '0 12px 32px rgb(var(--fv-shadow) / 0.22), 0 4px 12px rgb(var(--fv-shadow) / 0.14)'
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
        }
      },
      animation: {
        'float-in': 'float-in 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fade-in 120ms ease-out'
      }
    }
  },
  plugins: []
};
