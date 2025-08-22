import { useTranslation } from "react-i18next";
import { AuthForm, AuthPageWrapper } from "../components/AuthAnimations";
import { LoginForm } from "../components/form/LoginForm";

export function LoginPage() {
  const { t } = useTranslation("auth");

  return (
    <AuthPageWrapper className="bg-neutral-950">
      <AuthForm
        title={t("pages.login.title")}
        subtitle={t("pages.login.subtitle")}
      >
        <LoginForm />
      </AuthForm>
    </AuthPageWrapper>
  );
}
