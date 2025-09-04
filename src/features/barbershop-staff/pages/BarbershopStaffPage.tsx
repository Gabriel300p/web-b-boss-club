import { Divider } from "@/shared/components/ui";

import { useBarbershopStaff, useStaffFilters } from "../_index";
import { BarbershopStaffPageContent } from "./sections/BarbershopStaffPageContent";
import { BarbershopStaffPageHeader } from "./sections/BarbershopStaffPageHeader";

export function BarbershopStaffPage() {
  // 🔍 Filters management
  const { filters } = useStaffFilters();

  // 📊 Data fetching
  const { pagination, statistics } = useBarbershopStaff(filters);

  return (
    <div className="m-5 flex flex-col gap-5 rounded-xl bg-neutral-900 p-6">
      <BarbershopStaffPageHeader
        totalCount={pagination?.total || 0}
        statistics={statistics}
        lastUpdated={new Date().toLocaleTimeString("pt-BR")}
      />
      <Divider className="my-1" />
      <BarbershopStaffPageContent />
    </div>
  );
}
