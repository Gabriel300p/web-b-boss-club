import React, { FC } from "react";

interface AuthErrorProps {
  error: {
    name: string;
    message: string;
  };
}

const AuthError: FC<AuthErrorProps> = ({ error }) => {
  return (
    <>
      <div className="rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950">
        <div className="text-sm text-red-800 dark:text-red-200">
          <strong>Erro:</strong>{" "}
          {error.message ||
            "Erro ao enviar email de recuperação. Tente novamente."}
        </div>
      </div>
    </>
  );
};

export default AuthError;
