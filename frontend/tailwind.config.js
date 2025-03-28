/** @type {import('tailwindcss').Config} */
export default {
  // content: ["*"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": {opacity: "0", transform: "translateX(50%)"},
          "100%": {opacity: "1", transform: "translateX(0)"},
        },
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
