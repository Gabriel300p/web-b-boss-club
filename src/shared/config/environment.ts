/**
 * 🌐 CONFIGURAÇÃO DE AMBIENTE - DETECÇÃO AUTOMÁTICA
 *
 * O ambiente é detectado automaticamente:
 * - Em desenvolvimento: usa localhost:3002
 * - Em produção: usa Supabase
 *
 * Para forçar um ambiente específico, descomente e edite a linha abaixo:
 */

// 🔧 FORÇAR AMBIENTE ESPECÍFICO (opcional):
// export const FORCE_ENVIRONMENT = "local" as const; // "local" ou "production"

// 🚀 Detecção automática de ambiente
const detectEnvironment = (): "local" | "production" => {
  // Detecta automaticamente baseado na URL
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const isLocalhost =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.includes("localhost") ||
      hostname.includes("127.0.0.1");

    return isLocalhost ? "local" : "production";
  }

  // Fallback para produção (mais seguro)
  return "production";
};

export const ENVIRONMENT = detectEnvironment();

// 📍 URLs para cada ambiente
export const API_URLS = {
  local: "http://localhost:3002",
  production: "/api",  // Usa CloudFront como proxy (path relativo)
} as const;

// 🚀 URL atual baseada na escolha
export const CURRENT_API_URL = API_URLS[ENVIRONMENT];

// 📝 Log para confirmar qual ambiente está sendo usado
console.log(`🌐 Ambiente selecionado: ${ENVIRONMENT}`);
console.log(`🔗 API URL: ${CURRENT_API_URL}`);

// ⚠️ Verificação de ambiente
if (ENVIRONMENT === "local") {
  console.log("✅ Usando backend LOCAL (localhost:3002)");
} else {
  console.log("🌍 Usando backend de PRODUÇÃO (Supabase)");
}
