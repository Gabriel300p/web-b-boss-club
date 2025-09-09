import { CheckIcon, XIcon } from "@phosphor-icons/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface PasswordRule {
  key: string;
  test: (password: string) => boolean;
  label: string;
}

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export function PasswordStrengthIndicator({
  password,
  className = "",
}: PasswordStrengthIndicatorProps) {
  const { t } = useTranslation("auth");

  const rules: PasswordRule[] = useMemo(
    () => [
      {
        key: "minLength",
        test: (pwd) => pwd.length >= 8,
        label: t("forms.resetPassword.validation.minLength"),
      },
      {
        key: "uppercase",
        test: (pwd) => /[A-Z]/.test(pwd),
        label: t("forms.resetPassword.validation.uppercase"),
      },
      {
        key: "lowercase",
        test: (pwd) => /[a-z]/.test(pwd),
        label: t("forms.resetPassword.validation.lowercase"),
      },
      {
        key: "number",
        test: (pwd) => /[0-9]/.test(pwd),
        label: t("forms.resetPassword.validation.number"),
      },
      {
        key: "special",
        test: (pwd) => /[^A-Za-z0-9]/.test(pwd),
        label: t("forms.resetPassword.validation.special"),
      },
    ],
    [t],
  );

  const ruleResults = useMemo(
    () => rules.map((rule) => ({ ...rule, passed: rule.test(password) })),
    [rules, password],
  );

  const allPassed = ruleResults.every((rule) => rule.passed);
  const passedCount = ruleResults.filter((rule) => rule.passed).length;

  if (!password) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {t("forms.resetPassword.validation.title")}
        </span>
        <span className="text-xs text-neutral-500">
          {passedCount}/{rules.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
        <div
          className={`h-full transition-all duration-300 ${
            allPassed
              ? "bg-green-500"
              : passedCount >= 3
                ? "bg-yellow-500"
                : "bg-red-500"
          }`}
          style={{ width: `${(passedCount / rules.length) * 100}%` }}
        />
      </div>

      {/* Rules list */}
      <div className="space-y-2">
        {ruleResults.map((rule) => (
          <div key={rule.key} className="flex items-center space-x-2">
            <div
              className={`flex h-4 w-4 items-center justify-center rounded-full transition-colors ${
                rule.passed
                  ? "bg-green-500 text-white"
                  : "bg-neutral-300 text-neutral-600 dark:bg-neutral-600 dark:text-neutral-400"
              }`}
            >
              {rule.passed ? (
                <CheckIcon className="h-3 w-3" weight="bold" />
              ) : (
                <XIcon className="h-3 w-3" weight="bold" />
              )}
            </div>
            <span
              className={`text-sm transition-colors ${
                rule.passed
                  ? "text-green-600 dark:text-green-400"
                  : "text-neutral-600 dark:text-neutral-400"
              }`}
            >
              {rule.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
