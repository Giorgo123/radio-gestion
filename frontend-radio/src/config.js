// src/config.js
// Lee la URL de la API desde múltiples convenciones de variables de entorno
// y evita errores cuando `process` o `import.meta` no están disponibles.
const normalize = (value) => {
  if (!value) return value;
  return value.replace(/\/$/, "");
};

// Fallback robusto: ruta relativa. En dev CRA se proxea al backend con package.json "proxy".
const fallbackUrl = "/api";

function readEnvUrl() {
  // 1) Vite-style (import.meta.env)
  try {
    // Algunos bundlers no soportan import.meta; por eso el try/catch.
    if (typeof import.meta !== "undefined" && import.meta.env) {
      const e = import.meta.env;
      return (
        e.VITE_API_URL ||
        e.NEXT_PUBLIC_API_URL ||
        e.NX_API_URL ||
        e.REACT_APP_API_URL ||
        null
      );
    }
  } catch (_) {
    // ignorar
  }

  // 2) CRA/Next/Nx vía process.env (reemplazado en build cuando aplica)
  const env = typeof process !== "undefined" && process && process.env ? process.env : {};
  return (
    env.REACT_APP_API_URL ||
    env.REACT_APP_BACKEND_URL ||
    env.NX_API_URL ||
    env.NEXT_PUBLIC_API_URL ||
    env.VITE_API_URL || // por compatibilidad si quedó configurado
    env.PUBLIC_API_URL ||
    null
  );
}

const envUrl = readEnvUrl();
export const API_URL = normalize(envUrl) || fallbackUrl;

const nodeEnv = (typeof process !== "undefined" && process && process.env && process.env.NODE_ENV) || "";
if (nodeEnv !== "production" && !envUrl) {
  // eslint-disable-next-line no-console
  console.warn(`⚠️  API_URL no está definido. Usando valor por defecto: ${fallbackUrl}`);
}
