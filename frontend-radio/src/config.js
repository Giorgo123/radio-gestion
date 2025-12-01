// src/config.js
// Lee la URL de la API desde múltiples convenciones de variables de entorno
// y evita errores cuando `process` o `import.meta` no están disponibles.
const normalize = (value) => {
  if (!value) return value;
  return value.replace(/\/$/, "");
};

// Fallback robusto: ruta relativa. En dev CRA se proxea al backend con package.json "proxy".
const fallbackUrl = "/api";

const envUrl =
  // CRA y bundlers que reemplazan en build-time
  process.env.REACT_APP_API_URL ||
  process.env.REACT_APP_BACKEND_URL ||
  process.env.NX_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.VITE_API_URL ||
  process.env.PUBLIC_API_URL ||
  // Vite/import.meta en dev/build
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    (import.meta.env.VITE_API_URL ||
      import.meta.env.NEXT_PUBLIC_API_URL ||
      import.meta.env.NX_API_URL ||
      import.meta.env.REACT_APP_API_URL)) ||
  // Escape hatch por si inyectan en window
  (typeof window !== "undefined" && window.__API_URL__) ||
  null;

export const API_URL = normalize(envUrl) || fallbackUrl;

const nodeEnv =
  process.env.NODE_ENV ||
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.NODE_ENV) ||
  "";
if (nodeEnv !== "production" && !envUrl) {
  // eslint-disable-next-line no-console
  console.warn(`⚠️  API_URL no está definido. Usando valor por defecto: ${fallbackUrl}`);
}
