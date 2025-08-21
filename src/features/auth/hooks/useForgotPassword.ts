// src/features/auth/hooks/useLogin.ts
import { useToast } from "@/shared/hooks";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { forgotPasswordRequest } from "../services/auth.service";

export function useForgotPassword() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: forgotPasswordRequest,
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access_token);
      navigate({ to: "/auth/mfa-verification" });
      showToast({
        type: "success",
        title: "E-mail de recuperação enviado",
        message: "Verifique sua caixa de entrada para instruções.",
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
