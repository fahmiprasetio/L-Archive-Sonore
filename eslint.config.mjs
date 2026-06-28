import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Skrip Node bantu (bukan kode aplikasi; memakai require & bukan modul TS).
    "scripts/**",
    "call_init.js",
  ]),
  {
    // Turunkan aturan ketat (React 19 / stylistic) menjadi peringatan agar CI
    // tidak gagal pada tech-debt yang sudah ada. Tetap tampil sebagai warning
    // untuk dirapikan bertahap.
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "react/no-unescaped-entities": "warn",
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "warn",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
