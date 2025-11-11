/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
        "*.{js,ts,jsx,tsx,mdx}"
    ],
    theme: {
      extend: {},
    },
    plugins: [daisyui],
  };
