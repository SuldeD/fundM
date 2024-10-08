import { type Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/**/*.js",
  ],
  theme: {
    extend: {
      animation: {
        fade: "fadeIn 1000s ease-out",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        lato: ["Lato", "sans-serif"],
        raleway: ["Raleway", "sans-serif"],
        beau: ["PF BeauSans Pro"],
        tahoma: ["Tahoma"],
      },
      colors: {
        primary: "#0300B4",
        detail: "rgba(26, 33, 85, 0.5)",
        bank: "rgba(40, 82, 164, 0.05)",
        sub: "rgba(0, 0, 0, 0.5)",
      },
      boxShadow: {
        custom: "0px 1px 20px 1px rgba(0, 0, 0, 0.15)",
      },
      screens: {
        sm: "480px",
        md: "768px",
        lg: "976px",
        xl: "1440px",
      },
    },
  },
  plugins: [],
} satisfies Config;
