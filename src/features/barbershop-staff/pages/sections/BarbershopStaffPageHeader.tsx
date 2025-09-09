import { Button } from "@/shared/components/ui";
import { PlusCircleIcon } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import type { StaffListResponse } from "../../schemas/barbershop-staff.schemas";

interface BarbershopStaffPageHeaderProps {
  isLoading?: boolean;
  totalCount?: number;
  statistics?: StaffListResponse["statistics"];
  lastUpdated?: string;
}

export function BarbershopStaffPageHeader({
  totalCount = 0,
  statistics,
  lastUpdated = new Date().toLocaleTimeString("pt-BR"),
}: BarbershopStaffPageHeaderProps) {
  const { t } = useTranslation("barbershop-staff");

  return (
    <div className="space-y-6">
      {/* Header com título e botão */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl leading-tight font-semibold text-neutral-100">
              {t("pages.staff.title")}
            </h1>
            <p className="text-base font-normal text-neutral-400">
              <strong className="font-semibold text-neutral-100">
                {totalCount}
              </strong>{" "}
              {t("statistics.total")}, {t("statistics.updatedAt")}{" "}
              <strong className="font-semibold text-neutral-100">
                {lastUpdated}
              </strong>
            </p>
          </div>
          {statistics && (
            <>
              <div className="h-16 w-px border border-neutral-800" />
              <div className="flex flex-col items-center gap-2 px-2">
                <p className="text-3xl font-bold text-neutral-200">
                  {statistics.total_active ?? 0}
                </p>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-lg bg-emerald-700" />
                  <span className="text-sm font-medium text-neutral-400">
                    {t("statistics.active")}
                  </span>
                </div>
              </div>
              <div className="h-16 w-px border border-neutral-800" />
              <div className="flex flex-col items-center gap-2 px-2">
                <p className="text-3xl font-bold text-neutral-200">
                  {statistics.total_inactive ?? 0}
                </p>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-lg bg-red-700" />
                  <span className="text-sm font-medium text-neutral-400">
                    {t("statistics.inactive")}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        <Button
          onClick={() => {}}
          size="default"
          className="flex items-center gap-1.5 rounded-md px-3.5 py-3 transition-opacity duration-300 hover:opacity-80"
        >
          <PlusCircleIcon weight="fill" className="size-5" />
          <span className="hidden sm:block">{t("actions.new")}</span>
        </Button>
      </div>
    </div>
  );
}
