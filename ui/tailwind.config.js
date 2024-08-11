export default {
  content: [
    // ... your project files, eg.:
    // './index.html',
    // './src/**/*.{vue,js,ts,jsx,tsx}',
    "./vueform.config.js",
    "./node_modules/@vueform/vueform/themes/tailwind/**/*.vue",
    "./node_modules/@vueform/vueform/themes/tailwind/**/*.js",
  ],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [require("@vueform/vueform/tailwind")],
};
