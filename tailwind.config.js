/** @type {import('tailwindcss').Config} */
export default {
  // Scope every utility with `lb-` so classes can never collide with the
  // surrounding Shopify theme (e.g. `lb-grid`, `lb-p-6`).
  prefix: "lb-",
  content: ["./src/**/*.{ts,tsx}"],
  // Disable Tailwind's global reset so it doesn't restyle the host theme.
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
