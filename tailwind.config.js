/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
      screens: {
        'tablet': '500px',
        // => @media (min-width: 640px) { ... }
  
        'laptop': '768px',
        // => @media (min-width: 1024px) { ... }
  
        'desktop': '1280px',
        // => @media (min-width: 1280px) { ... }
      }, 
    extend: {},
  },
  plugins: [],
}