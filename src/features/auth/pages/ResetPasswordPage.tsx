import { useTranslation } from "react-i18next";
import { AuthForm, AuthPageWrapper } from "../components/AuthAnimations";
import { ResetPasswordForm } from "../components/form/ResetPasswordForm";

export function ResetPasswordPage() {
  const { t } = useTranslation("auth");

  // Detectar se é primeiro login baseado na URL
  const isFirstLogin =
    window.location.pathname === "/auth/first-login" ||
    window.location.search.includes("firstLogin=true");

  return (
    <AuthPageWrapper className="bg-neutral-950">
      <AuthForm
        title={
          isFirstLogin ? "Definir Nova Senha" : t("pages.resetPassword.title")
        }
        subtitle={
          isFirstLogin
            ? "Como é seu primeiro acesso, defina uma nova senha para sua conta"
            : t("pages.resetPassword.subtitle")
        }
      >
        <ResetPasswordForm />
      </AuthForm>
    </AuthPageWrapper>
  );
}
