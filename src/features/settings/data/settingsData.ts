import type {
  BarbershopProfile,
  SettingsTabConfig,
} from "../types/settings.types";

export const mockBarbershopProfile: BarbershopProfile = {
  id: "1",
  name: "Ohanna Barber Shop",
  email: "contato@ohannabarbersho.com",
  phone: "(11) 96581-5200",
  bookingLink: "https://linkdeatendimento.com.br",
  websiteUrl: "https://ohannabarbershop.com.br",
  description:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  startDate: "17/08/2025",
  totalAppointments: 523,
  totalBarbers: 4,
  isOpen: true,
  avatar: undefined,
};

export const settingsTabs: SettingsTabConfig[] = [
  {
    id: "profile",
    label: "Perfil da Barbearia",
    icon: "🏪",
    available: true,
  },
  {
    id: "system",
    label: "Definições do sistema",
    icon: "⚙️",
    available: false,
  },
  {
    id: "notifications",
    label: "Notificações",
    icon: "🔔",
    available: false,
  },
  {
    id: "templates",
    label: "Templates",
    icon: "📄",
    available: false,
  },
  {
    id: "payments",
    label: "Pagamentos",
    icon: "💳",
    available: false,
  },
];
