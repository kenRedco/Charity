export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Optional: tweak these to match your brand palette
        primary: {
          light: "#6ee7b7",
          DEFAULT: "#10b981", // green-500
          dark: "#047857",    // green-700
        },
      },
      keyframes: {
        blob: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
        },
      },
      animation: {
        blob: "blob 8s infinite",
      },
    },
  },
  plugins: [
    // Add if you want Tailwind's animate utilities (optional)
    // require("tailwindcss-animate"),
  ],
};
