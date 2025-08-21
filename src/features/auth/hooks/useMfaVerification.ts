// src/features/auth/hooks/useLogin.ts
import { useToast } from "@/shared/hooks";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { mfaVerificationRequest } from "../services/auth.service";

export function useMfaVerification() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: mfaVerificationRequest,
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access_token);
      navigate({ to: "/auth/login" });
      showToast({
        type: "success",
        title: "Verificação de MFA",
        message: "Código de verificação validado com sucesso!",
        expandable: true,
        duration: 1000,
      });
    },
    onError: (error: Error) => {
      showToast({
        type: "error",
        title: "Erro ao enviar e-mail de recuperação",
        message: `Ocorreu um erro ao tentar enviar o e-mail de recuperação. ${error.message}`,
        expandable: true,
        duration: 10000,
      });
      console.error("Erro ao enviar e-mail de recuperação:", error);
    },
  });
}
