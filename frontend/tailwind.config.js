module.exports = {
  mode: 'jit',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4a9eff',
        secondary: '#1a1a1a',
      },
    },
  },
  plugins: [],
}
