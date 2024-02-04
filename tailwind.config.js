/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      //sans - apply for all app fonts
      sans: 'Roboto Mono, monospace',
      robotoMono: 'Roboto Mono, monospace',
    },
    extend: {
      height: {
        //for proper work on mobile device
        screen: '100dvh',
      },
    },
  },
  plugins: [],
};
