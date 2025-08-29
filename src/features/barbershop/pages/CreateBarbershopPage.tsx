import { AuthPageWrapper } from "@features/auth/components/AuthAnimations";
import { CreateBarbershopForm } from "../components/CreateBarbershopForm";

export function CreateBarbershopPage() {
  return (
    <AuthPageWrapper className="bg-neutral-950">
      <div className="mx-auto w-full max-w-4xl">
        <CreateBarbershopForm />
      </div>
    </AuthPageWrapper>
  );
}
