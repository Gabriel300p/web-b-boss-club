import { useTranslation } from "react-i18next";
import { AuthForm, AuthPageWrapper } from "../components/AuthAnimations";
import { ResetPasswordForm } from "../components/form/ResetPasswordForm";

export function ResetPasswordPage() {
  const { t } = useTranslation("auth");

  return (
    <AuthPageWrapper className="bg-neutral-950">
      <AuthForm
        title={t("pages.resetPassword.title")}
        subtitle={t("pages.resetPassword.subtitle")}
      >
        <ResetPasswordForm />
      </AuthForm>
    </AuthPageWrapper>
  );
}
