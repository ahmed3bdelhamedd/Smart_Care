module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        surface: 'var(--surface)',
        ink: 'var(--ink)',
        hero: 'var(--hero)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        soft: 'var(--soft)',
        brand: 'var(--brand)',
        'brand-dark': 'var(--brand-dark)',
      },
      boxShadow: {
        card: '0 16px 50px rgba(22, 49, 44, 0.08)',
      },
    },
  },
  plugins: [],
};
