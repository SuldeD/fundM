import { type Config } from "tailwindcss";

export default {
  content: [ "./src/**/*.{js,ts,jsx,tsx}",
  "./pages/**/*.{js,ts,jsx,tsx}",
  "./components/**/*.{js,ts,jsx,tsx}",

  // Or if using `src` directory:
  "./src/**/*.{js,ts,jsx,tsx}",
  "./node_modules/flowbite-react/**/*.js",],
  theme: {
    extend: {
      fontFamily:{
        inter: ['Inter', 'sans-serif'],
      },
      colors:{
        primary:"#0300B4",
        detail:'rgba(26, 33, 85, 0.5)',
      },
      boxShadow:{
        custom: '0px 1px 20px 1px rgba(0, 0, 0, 0.15)',
      },
      screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
   
  },
  },
  plugins: [],
} satisfies Config;
