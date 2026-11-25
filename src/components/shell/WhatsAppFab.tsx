"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";

/** Routes whose sticky mobile bottom bar would collide with the floating button. */
const BOTTOM_BAR_ROUTES = ["/cart", "/checkout"];

export function WhatsAppFab() {
  const pathname = usePathname();
  const hasMobileBottomBar =
    BOTTOM_BAR_ROUTES.includes(pathname) || pathname.startsWith("/shop/");

  return (
    <button
      type="button"
      aria-label="Chat on WhatsApp"
      onClick={() => toast("Would open WhatsApp support chat")}
      className={`${
        hasMobileBottomBar ? "hidden sm:flex" : "flex"
      } fixed bottom-5 right-5 z-60 h-[52px] min-w-[52px] items-center justify-center gap-2 rounded-full bg-whatsapp pl-4 pr-4 text-white shadow-[0_10px_24px_rgba(37,211,102,0.4)] transition-all hover:brightness-105 active:translate-y-px sm:pr-5`}
    >
      <MessageCircle className="size-6 shrink-0" />
      <span className="hidden whitespace-nowrap text-sm font-medium sm:inline">
        Need a hand?
      </span>
    </button>
  );
}
