import { Button } from "@/shared/components/ui";
import { PlusCircleIcon } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

export function BarbershopStaffPageHeader() {
  const { t } = useTranslation("records");
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <h1 className="text-2xl leading-tight font-semibold text-neutral-100">
          Barbeiros
        </h1>
        <p className="text-base font-normal text-neutral-400">
          <strong className="font-semibold text-neutral-100">4</strong> total,
          atualizado às{" "}
          <strong className="font-semibold text-neutral-100">11:42:34</strong>
        </p>
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
  );
}
