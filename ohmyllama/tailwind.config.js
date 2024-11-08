import defaultTheme from 'tailwindcss/defaultTheme'

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        promptRegular: ['prompt-regular', ...defaultTheme.fontFamily.sans],
        promptBold: ['prompt-bold', ...defaultTheme.fontFamily.sans],
        promptLight: ['prompt-light', ...defaultTheme.fontFamily.sans],
        promptMedium: ['prompt-medium', ...defaultTheme.fontFamily.sans],
      }
    },
  },
  plugins: [],
};
