// 🎯 Hook para configurar estratégias de loading
export interface LoadingConfig {
  useRouteSkeleton: boolean;
  useLazyLoading: boolean;
  animationDuration: number;
}

// Configuração padrão - pode ser alterada facilmente
const DEFAULT_CONFIG: LoadingConfig = {
  useRouteSkeleton: false, // 👈 Controla se usa RouteSkeleton
  useLazyLoading: false, // 👈 Controla se usa lazy loading
  animationDuration: 0.4, // Duração das animações
};

export function useLoadingConfig(): LoadingConfig {
  // Aqui você pode adicionar lógica para ler de localStorage,
  // variáveis de ambiente, ou context se precisar
  return DEFAULT_CONFIG;
}

// Função utilitária para atualizar a config globalmente
export function updateLoadingConfig(newConfig: Partial<LoadingConfig>) {
  Object.assign(DEFAULT_CONFIG, newConfig);
}
