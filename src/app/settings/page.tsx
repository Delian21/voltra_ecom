import type { Metadata } from "next";
import { SettingsPage } from "@/components/settings/SettingsPage";

export const metadata: Metadata = {
  title: "Settings",
  description: "Notification preferences and payment methods.",
};

export default function SettingsRoute() {
  return <SettingsPage />;
}