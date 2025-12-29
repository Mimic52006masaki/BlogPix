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
        "punk-black": "#050505",
        "punk-white": "#f0f0f0",
        "punk-accent": "#ff003c",
        "comic-yellow": "#f9d71c",
        "comic-cyan": "#00e0ff",
        "comic-dots": "#e5e5e5",
      },
      fontFamily: {
        "display": ["Bangers", "cursive"],
        "marker": ["Permanent Marker", "cursive"],
        "comic": ["Comic Neue", "cursive"],
        "mono": ["Roboto Mono", "monospace"]
      },
      backgroundImage: {
        'halftone-pattern': "radial-gradient(circle, #333 1px, transparent 1px)",
        'halftone-light': "radial-gradient(circle, #000 1px, transparent 1px)"
      },
      backgroundSize: {
        'halftone': '20px 20px'
      },
      boxShadow: {
        'comic': '4px 4px 0px 0px #000',
        'comic-lg': '8px 8px 0px 0px #000',
        'comic-xl': '12px 12px 0px 0px #000',
      }
    },
  },
  plugins: [],
}