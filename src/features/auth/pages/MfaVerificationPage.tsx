import { useTranslation } from "react-i18next";
import { AuthForm, AuthPageWrapper } from "../components/AuthAnimations";
import { MfaVerificationForm } from "../components/form/MfaVerificationForm";
import { useCurrentUserEmail } from "../hooks/useAuth";

export function MfaVerificationPage() {
  const { t } = useTranslation("auth");
  const userEmail = useCurrentUserEmail();
  const maskedEmail = userEmail
    ? `${userEmail.slice(0, 3)}...${userEmail.slice(-10)}`
    : t("forms.mfaVerification.messages.maskedEmailFallback");

  return (
    <AuthPageWrapper className="bg-neutral-950">
      <AuthForm
        title={t("pages.mfaVerification.title")}
        subtitle={t("pages.mfaVerification.subtitle", { email: maskedEmail })}
      >
        <MfaVerificationForm />
      </AuthForm>
    </AuthPageWrapper>
  );
}
