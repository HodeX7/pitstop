/** @type {import('tailwindcss').Config} */
export default {
  content: ["index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      scrollbar: ["rounded"],
      colors: {
        primaryGreen: "#50A5AF",
        primaryOrange: "#F1610D",
        secondary: "#1A265B",
        accent: "#ECEBF3",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "Arial", "sans-serif"],
      },
      button: {
        base: "py-2 px-4 rounded-md font-medium",
        primaryEnabled:
          "ml-4 my-4 bg-orange-500 hover:bg-orange-400 text-white px-4 py-2 rounded",
        secondary: "bg-gray-300 text-gray-700",
      },
    },
  },
  plugins: [],
};
