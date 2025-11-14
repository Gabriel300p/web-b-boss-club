export interface BarbershopProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  bookingLink: string;
  websiteUrl: string;
  description: string;
  startDate: string;
  totalAppointments: number;
  totalBarbers: number;
  isOpen: boolean;
  avatar?: string;
}

export type SettingsTab =
  | "profile"
  | "system"
  | "notifications"
  | "templates"
  | "payments";

export interface SettingsTabConfig {
  id: SettingsTab;
  label: string;
  icon: string;
  available: boolean;
}
