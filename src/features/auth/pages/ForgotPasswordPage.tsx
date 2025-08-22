import { useTranslation } from "react-i18next";
import { AuthForm, AuthPageWrapper } from "../components/AuthAnimations";
import { ForgotPasswordForm } from "../components/form/ForgotPasswordForm";

export function ForgotPasswordPage() {
  const { t } = useTranslation("auth");

  return (
    <AuthPageWrapper className="bg-neutral-950">
      <AuthForm
        title={t("pages.forgotPassword.title")}
        subtitle={t("pages.forgotPassword.subtitle")}
      >
        <ForgotPasswordForm />
      </AuthForm>
    </AuthPageWrapper>
  );
}
