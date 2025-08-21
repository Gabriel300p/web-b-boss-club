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

// Mock function - replace with actual API call
async function resendMfaCodeRequest(): Promise<void> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // In a real app, this would call your backend API
  // const response = await axios.post('/auth/resend-mfa-code', { email });
  // return response.data;
}

export function useResendMfaCode() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: resendMfaCodeRequest,
    onSuccess: () => {
      showToast({
        type: "success",
        title: "Código reenviado",
        message: "Um novo código de verificação foi enviado para seu email.",
        expandable: false,
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      showToast({
        type: "error",
        title: "Erro ao reenviar código",
        message: `Não foi possível reenviar o código. ${error.message}`,
        expandable: false,
        duration: 5000,
      });
    },
  });
}
