/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
    
        ink: {
          900: "#14120F", 
          800: "#1C1A16", 
          700: "#272420", 
        },
        // One light scale.
        paper: {
          0: "#FFFFFF",
          50: "#F7F6F2", 
          100: "#ECEAE3", 
        },
        
        accent: {
          100: "#FDECD2", 
          400: "#F0A63D", 
          500: "#E8890C", 
          600: "#C97207", 
          900: "#4A2E05", 
        },
      },
      borderRadius: {
        card: "16px",
      },
    },
  },
  plugins: [],
};