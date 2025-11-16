/** @type {import('tailwindcss').Config} */
module.exports = {
  // Expand content globs to cover common extensions and nested files.
  content: ["./src/**/*.{js,jsx,ts,tsx,html}", "./public/index.html"],
  theme: { extend: {} },
  // Some classes are used statically in JSX but may still be missed
  // by aggressive scanning in some environments — safelist ensures
  // these appear in the generated CSS until a more targeted fix is applied.
  safelist: [
    "bg-green-100",
    "bg-green-50",
    "bg-yellow-50",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-red-500",
    "p-4",
    "p-8",
    "px-2",
    "py-1",
    "mt-2",
    "mb-4",
    "w-full",
    "h-48",
    "grid",
    "grid-cols-1",
    "sm:grid-cols-2",
    "md:grid-cols-3",
    "flex",
    "items-center",
    "justify-between",
  ],
  plugins: [],
};
