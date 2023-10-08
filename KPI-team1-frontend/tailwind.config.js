/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customBlack: "#202020",
        customWhite: "#F9F9FA",
        customGrey: "#7C7E7E",
        customWhite1: "#D0D8DB",
        customBlack1: "#131313",
        customPurple: "#D1C2ED",
        customYellow: "#FBBB21",
      },
      fontFamily: {
        custom: ["Inter", "sans"],
      },
      backgroundColor: {
        customGrey1: "rgba(208, 216, 219, 0.50)",
        customGrey2: "#F0F0F6",
        customWhite2: "#FFF",
      },
    },
    plugins: [require("flowbite/plugin")],
  },
};
