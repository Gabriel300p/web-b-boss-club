import { Button } from "@/shared/components/ui";
import { PlusCircleIcon } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import type { StaffListResponse } from "../../schemas/barbershop-staff.schemas";

interface BarbershopStaffPageHeaderProps {
  isLoading?: boolean;
  totalCount?: number;
  statistics?: StaffListResponse["statistics"];
  lastUpdated?: string;
  onCreateClick?: () => void;
}

export function BarbershopStaffPageHeader({
  totalCount = 0,
  statistics,
  lastUpdated = new Date().toLocaleTimeString("pt-BR"),
  onCreateClick,
}: BarbershopStaffPageHeaderProps) {
  const { t } = useTranslation("barbershop-staff");

  return (
    <div className="space-y-6">
      {/* Header com título e botão */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-fit space-y-2">
            <h1 className="text-2xl leading-tight font-semibold text-neutral-100">
              {t("pages.staff.title")}
            </h1>
            <p className="text-base font-normal text-neutral-400">
              <strong className="font-semibold text-neutral-100">
                {totalCount}
              </strong>{" "}
              {t("statistics.total")},{" "}
              <span className="hidden md:inline">
                {t("statistics.updatedAt")}{" "}
              </span>
              <strong className="font-semibold text-neutral-100">
                {lastUpdated}
              </strong>
            </p>
          </div>
          {statistics && (
            <div className="flex items-center gap-x-2 md:gap-x-6">
              <div className="hidden h-16 w-px border border-neutral-800 md:block" />
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
            </div>
          )}
        </div>

        <Button
          onClick={onCreateClick}
          size="default"
          className="flex flex-1 items-center gap-1.5 rounded-md px-3.5 py-3 font-semibold transition-opacity duration-300 hover:opacity-80"
        >
          <PlusCircleIcon weight="fill" className="size-5" />
          <span className="hidden md:block">{t("actions.addNew")}</span>
        </Button>
      </div>
    </div>
  );
}
