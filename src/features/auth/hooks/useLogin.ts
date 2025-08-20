// src/features/auth/hooks/useLogin.ts
import { useToast } from "@/shared/hooks";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { loginRequest } from "../services/auth.service";

export function useLogin() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access_token);
      navigate({ to: "/comunicacoes" });
      showToast({
        type: "success",
        title: "Login realizado com sucesso",
        message: "Você foi autenticado com sucesso.",
        expandable: true,
        duration: 1000,
      });
    },
    onError: (error: Error) => {
      showToast({
        type: "error",
        title: "Erro ao autenticar",
        message: `Ocorreu um erro ao tentar realizar o login. Verifique suas credenciais e tente novamente. ${error.message}`,
        expandable: true,
        duration: 10000,
      });
      console.error("Erro ao autenticar:", error);
    },
  });
}
