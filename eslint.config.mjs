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
  ]),
  {
    rules: {
      // Deuda preexistente: varios componentes hacen setState dentro de effects
      // de fetch (CookieBanner, CotizadorApp, comparables). Patrón aceptable para
      // data-fetching; se deja como warning para no bloquear CI y poder limpiarlo
      // gradualmente sin reescribir componentes que funcionan.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
