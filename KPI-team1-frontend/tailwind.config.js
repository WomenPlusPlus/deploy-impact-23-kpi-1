/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        widescreen: { raw: "(min-aspect-ratio: 3/2)" },
        tallscreen: { raw: "(min-aspect-ratio: 13/20)" },
      },
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
      },
    },
    plugins: [require("flowbite/plugin")],
  },
};
