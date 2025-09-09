import { useEffect, useState } from "react";

/**
 * Hook que adiciona um delay mínimo antes de mostrar o estado de loading
 * Evita o "piscar" do skeleton em carregamentos muito rápidos
 *
 * @param isLoading - Estado de loading atual
 * @param delay - Delay mínimo em ms antes de mostrar loading (padrão: 200ms)
 * @returns boolean - Se deve mostrar o loading ou não
 */
export function useDelayedLoading(
  isLoading: boolean,
  delay: number = 200,
): boolean {
  const [showLoading, setShowLoading] = useState(false);
  const [delayPassed, setDelayPassed] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isLoading) {
      // Inicia o delay quando loading começa
      timeoutId = setTimeout(() => {
        setDelayPassed(true);
      }, delay);
    } else {
      // Reset quando loading termina
      setDelayPassed(false);
      setShowLoading(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoading, delay]);

  useEffect(() => {
    // Só mostra loading se ainda estiver loading E o delay passou
    setShowLoading(isLoading && delayPassed);
  }, [isLoading, delayPassed]);

  return showLoading;
}







