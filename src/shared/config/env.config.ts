/**
 * 🌐 Configuração de Ambiente
 * Detecta automaticamente se está em desenvolvimento ou produção
 */

export const envConfig = {
  // Detecta se está em desenvolvimento
  isDevelopment: import.meta.env.DEV,

  // Detecta se está em produção
  isProduction: import.meta.env.PROD,

  // Detecta se está rodando localmente
  isLocalhost:
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname.includes("localhost")),

  // URL da API baseada no ambiente
  getApiUrl: () => {
    // Se VITE_API_URL estiver definida, usa ela
    if (import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }

    // Se estiver rodando localmente, usa localhost:3002
    if (envConfig.isLocalhost) {
      console.log(
        "🌐 Ambiente local detectado - usando API local: http://localhost:3002",
      );
      return "http://localhost:3002";
    }

    // Se estiver em produção, usa a URL padrão do Supabase
    console.log("🌐 Ambiente de produção detectado - usando API remota");
    return "https://lhsmivjozemhghmzjxrg.supabase.co";
  },

  // Logs de debug (apenas em desenvolvimento)
  log: (message: string, ...args: unknown[]) => {
    if (envConfig.isDevelopment) {
      console.log(`🔧 [DEV] ${message}`, ...args);
    }
  },

  // Logs de erro (sempre)
  error: (message: string, ...args: unknown[]) => {
    console.error(`❌ [ERROR] ${message}`, ...args);
  },
} as const;
