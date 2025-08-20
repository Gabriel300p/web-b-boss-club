export const APP_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || "",
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
  ITEMS_PER_PAGE: 10,
  DEBOUNCE_DELAY: 300,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  COMUNICACOES: "/comunicacoes",
  RELATORIOS: "/relatorios",
  CONFIGURACOES: "/configuracoes",
  USUARIOS: "/usuarios",
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const;

export const ANIMATION_DURATION = {
  FAST: 0.15,
  DEFAULT: 0.2,
  SLOW: 0.3,
} as const;
