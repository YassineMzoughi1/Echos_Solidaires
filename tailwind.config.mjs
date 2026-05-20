/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}'],
  theme: {
    // Replace default colors entirely — only brand tokens leak through.
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      cream: '#F9F1E4',
      sable: '#E8DBB7',
      indigo: '#1A2639',
      argile: '#C84B31',
      oasis: '#99C78C',
      ocre: '#DDA13E',
      info: '#3B82F6',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      'ink-900': '#0F1419',
      'ink-700': '#2A2F3A',
      'ink-500': '#6B7280',
      'ink-300': '#C8C2B6'
    },
    fontFamily: {
      display: ['"Cormorant Garamond Variable"', 'Cormorant Garamond', 'Georgia', 'serif'],
      sans: ['"Inter Variable"', 'Inter', 'system-ui', '-apple-system', 'sans-serif']
    },
    fontSize: {
      'caption': ['12px', { lineHeight: '1.4', letterSpacing: '0.08em' }],
      'eyebrow': ['13px', { lineHeight: '1', letterSpacing: '0.15em' }],
      'body-sm': ['14px', { lineHeight: '1.5' }],
      'body': ['16px', { lineHeight: '1.6' }],
      'body-lg': ['18px', { lineHeight: '1.6' }],
      'h3': ['20px', { lineHeight: '1.4' }],
      'h2': ['24px', { lineHeight: '1.3' }],
      'h1': ['32px', { lineHeight: '1.25' }],
      'display-sm': ['40px', { lineHeight: '1.2' }],
      'display-md': ['56px', { lineHeight: '1.15' }],
      'display-lg': ['72px', { lineHeight: '1.1' }],
      'display-xl': ['96px', { lineHeight: '1.05' }]
    },
    borderRadius: {
      none: '0',
      sm: '4px',
      DEFAULT: '8px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      '2xl': '20px',
      '3xl': '24px',
      full: '9999px'
    },
    extend: {
      maxWidth: { content: '1280px' },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
        30: '7.5rem',
        34: '8.5rem',
        38: '9.5rem',
        42: '10.5rem',
        50: '12.5rem'
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)'
      },
      transitionDuration: {
        400: '400ms',
        600: '600ms',
        800: '800ms',
        1200: '1200ms'
      }
    }
  },
  plugins: []
};
