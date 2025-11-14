/**
 * 🪝 useReloadData Hook
 * Hook reutilizável para funcionalidade de reload com animação, toast e cooldown
 */
import { useToast } from "@shared/hooks";
import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface UseReloadDataOptions {
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult>;
  resetFilters?: () => void;
  namespace?: string;
  cooldownMs?: number;
}

interface UseReloadDataReturn {
  isReloading: boolean;
  isButtonDisabled: boolean;
  countdown: number;
  handleReload: () => Promise<void>;
  reloadButtonProps: {
    label: string;
    disabledLabel: string;
    onClick: () => void;
    isDisabled: boolean;
  };
}

export function useReloadData({
  refetch,
  resetFilters,
  namespace = "common",
  cooldownMs = 10000,
}: UseReloadDataOptions): UseReloadDataReturn {
  const { success, error } = useToast();
  const { t } = useTranslation(namespace);

  // 🎯 Estados para controle do reload
  const [isReloading, setIsReloading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 🎯 Função de reload com animação, toast e cooldown
  const handleReload = useCallback(async () => {
    if (isButtonDisabled || isReloading) return;

    try {
      setIsReloading(true);
      setIsButtonDisabled(true);

      // Resetar filtros se fornecido
      if (resetFilters) {
        resetFilters();
      }

      // Recarregar dados
      await refetch();

      // Toast de sucesso
      success(
        t("toasts.success.reloadTitle"),
        t("toasts.success.reloadMessage"),
        t("toasts.success.reloadDescription"),
      );
    } catch {
      // Toast de erro
      error(
        t("toasts.errors.titles.reloadError"),
        t("toasts.errors.messages.reloadFailed"),
      );
    } finally {
      setIsReloading(false);

      // Cooldown configurável com countdown
      const cooldownSeconds = Math.ceil(cooldownMs / 1000);
      setCountdown(cooldownSeconds);
      setIsButtonDisabled(true);

      // Limpar interval anterior se existir
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }

      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
              countdownIntervalRef.current = null;
            }
            setIsButtonDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [
    isButtonDisabled,
    isReloading,
    resetFilters,
    refetch,
    success,
    error,
    t,
    cooldownMs,
  ]);

  // 🧹 Cleanup do interval quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, []);

  // 🎯 Props do botão para facilitar o uso
  const reloadButtonProps = {
    label: t("empty.noData.action"),
    disabledLabel: t("empty.noData.actionDisabled"),
    onClick: handleReload,
    isDisabled: isButtonDisabled || isReloading,
  };

  return {
    isReloading,
    isButtonDisabled,
    countdown,
    handleReload,
    reloadButtonProps,
  };
}
