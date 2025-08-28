import { useEffect } from "react";
import { envConfig } from "../../config/env.config.js";

/**
 * 🔧 Componente de debug para mostrar configuração de ambiente
 * Só é renderizado em desenvolvimento
 */
export function EnvironmentDebug() {
  useEffect(() => {
    if (envConfig.isDevelopment) {
      console.group("🌐 Configuração de Ambiente");
      console.log("🔧 Modo:", envConfig.isDevelopment ? "Desenvolvimento" : "Produção");
      console.log("🏠 Localhost:", envConfig.isLocalhost ? "Sim" : "Não");
      console.log("🌍 API URL:", envConfig.getApiUrl());
      console.log("📱 User Agent:", navigator.userAgent);
      console.log("🔗 Hostname:", window.location.hostname);
      console.log("📍 Pathname:", window.location.pathname);
      console.groupEnd();
    }
  }, []);

  // Não renderiza nada visualmente
  return null;
}
