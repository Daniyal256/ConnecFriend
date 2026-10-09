// Local Tailwind build: scan templates and retain dynamically generated avatar sizes.
module.exports = {
  content: ['./*.html', './js/**/*.js'],
  safelist: ["w-[24px]", "h-[24px]", "w-[28px]", "h-[28px]", "w-[30px]", "h-[30px]", "w-[36px]", "h-[36px]", "w-[38px]", "h-[38px]", "w-[40px]", "h-[40px]", "w-[42px]", "h-[42px]", "w-[44px]", "h-[44px]", "w-[48px]", "h-[48px]", "w-[52px]", "h-[52px]", "w-[60px]", "h-[60px]", "w-[68px]", "h-[68px]", "w-[104px]", "h-[104px]"],
  theme: {
    extend: {
      colors: {
        paper: '#f4f1e9',
        ink: '#24322c',
        muted: '#69736b',
        line: '#dcded3',
        sage: '#dce7d5',
        forest: '#355f49',
        gold: '#ebcb75',
        peach: '#f1cbbb',
        lilac: '#ded4eb',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Georgia', 'serif'],
      },
      boxShadow: { soft: '0 8px 30px -18px rgb(36 50 44 / 25%)' },
    },
  },
};
