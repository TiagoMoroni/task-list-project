/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        highlight: '#223C6C',
        details: '#82B3F3',
        section: '#CBCBCB'
      },
      spacing: {
        center_container: "85%",
        nav: 'var(--header-height)',
        complementary: 'calc(100vh - var(--header-height))'
      },
    },
  },
  plugins: [],
}

