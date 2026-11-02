/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        sanctuary: {
          bg: "#0B0F17",         // Deep midnight atmosphere
          surface: "#141C2E",    // Soft elevated surface
          card: "#1E293B",       // Glass card background
          border: "#334155",     // Subtle non-glare borders
          sage: "#4ADE80",       // Gentle calming green (breathing)
          lavender: "#A78BFA",   // Relaxing muted purple
          textMain: "#F8FAFC",   // Soft white for readability
          textMuted: "#94A3B8",  // Low-intensity secondary text
        }
      }
    },
  },
  plugins: [],
}
