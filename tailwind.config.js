/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'fleet-blue': '#1e3a8a',
        'fleet-dark': '#0f172a',
        'fleet-alert': '#ef4444',
      },
    },
  },
  plugins: [],
}