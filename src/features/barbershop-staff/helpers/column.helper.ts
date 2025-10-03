import type i18n from "@/app/i18n/init";

// 🏷️ Badge Helpers
type BadgeConfig = {
  variant:
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "neutral"
    | "purple"
    | "cyan"
    | "default";
  label: string;
  withDot?: boolean;
};

const getStatusBadge = (status: string, t: typeof i18n.t): BadgeConfig => {
  const statusMap: Record<string, BadgeConfig> = {
    ACTIVE: {
      variant: "success",
      label: t("status.active", { defaultValue: "Ativo" }),
      withDot: true,
    },
    INACTIVE: {
      variant: "neutral",
      label: t("status.inactive", { defaultValue: "Inativo" }),
      withDot: true,
    },
    SUSPENDED: {
      variant: "warning",
      label: t("status.suspended", { defaultValue: "Suspenso" }),
      withDot: true,
    },
    TERMINATED: {
      variant: "danger",
      label: t("status.terminated", { defaultValue: "Demitido" }),
      withDot: true,
    },
  };

  return (
    statusMap[status] || { variant: "default", label: status, withDot: false }
  );
};

const getRoleBadge = (role: string, t: typeof i18n.t): BadgeConfig => {
  const roleMap: Record<string, BadgeConfig> = {
    BARBER: {
      variant: "info",
      label: t("roles.barber", { defaultValue: "Barbeiro" }),
    },
    BARBERSHOP_OWNER: {
      variant: "purple",
      label: t("roles.owner", { defaultValue: "Proprietário" }),
    },
    SUPER_ADMIN: {
      variant: "danger",
      label: t("roles.superAdmin", { defaultValue: "Super Admin" }),
    },
    CLIENT: {
      variant: "success",
      label: t("roles.client", { defaultValue: "Cliente" }),
    },
    PENDING: {
      variant: "warning",
      label: t("roles.pending", { defaultValue: "Pendente" }),
    },
  };

  return roleMap[role] || { variant: "default", label: role };
};

const getAvailabilityBadge = (
  isAvailable: boolean,
  t: typeof i18n.t,
): BadgeConfig => {
  return isAvailable
    ? {
        variant: "success",
        label: t("availability.available", { defaultValue: "Disponível" }),
        withDot: true,
      }
    : {
        variant: "danger",
        label: t("availability.unavailable", { defaultValue: "Indisponível" }),
        withDot: true,
      };
};

export { getAvailabilityBadge, getRoleBadge, getStatusBadge };
