import { useTranslation } from "react-i18next";
import { AuthForm, AuthPageWrapper } from "../components/AuthAnimations";
import { ResetPasswordForm } from "../components/form/ResetPasswordForm";

export function ResetPasswordPage() {
  const { t } = useTranslation("auth");

  // Detectar contexto baseado em query params
  const urlParams = new URLSearchParams(window.location.search);
  const context = urlParams.get("context");
  const isFirstLogin = context === "first-login";

  return (
    <AuthPageWrapper className="bg-neutral-950">
      <AuthForm
        title={
          isFirstLogin
            ? t("pages.resetPassword.firstLoginTitle")
            : t("pages.resetPassword.title")
        }
        subtitle={
          isFirstLogin
            ? t("pages.resetPassword.firstLoginSubtitle")
            : t("pages.resetPassword.subtitle")
        }
      >
        <ResetPasswordForm />
      </AuthForm>
    </AuthPageWrapper>
  );
}
