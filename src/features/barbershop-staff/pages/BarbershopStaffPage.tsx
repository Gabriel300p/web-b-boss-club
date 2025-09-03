import { Divider } from "@/shared/components/ui";

import { BarbershopStaffPageContent } from "./sections/BarbershopStaffPageContent";
import { BarbershopStaffPageHeader } from "./sections/BarbershopStaffPageHeader";

export function BarbershopStaffPage() {
  return (
    <div className="m-5 flex flex-col gap-5 rounded-xl bg-neutral-900 p-6">
      <BarbershopStaffPageHeader />
      <Divider className="my-1" />
      <BarbershopStaffPageContent />
    </div>
  );
}
