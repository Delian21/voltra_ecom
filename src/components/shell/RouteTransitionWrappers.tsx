"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function RouteTransitionWrappers() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof document === "undefined") return;

    let nav: HTMLElement | null = document.querySelector<HTMLElement>("nav");
    let media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const entering = () => {
      if (!nav) return;

      if (!media.matches) {
        nav.style.transition = "none";
        nav.style.transform = "translateY(8px)";
        nav.style.opacity = "0";
      }

      if (typeof requestAnimationFrame === "function") {
        requestAnimationFrame(() => {
          if (!nav) return;
          nav.style.transition = media.matches
            ? "none"
            : "transform 180ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms cubic-bezier(0.22, 1, 0.36, 1)";
          nav.style.transform = "translateY(0px)";
          nav.style.opacity = "1";
          nav.dataset.transition = "entered";
        });
      } else {
        nav.style.transition = "none";
        nav.style.transform = "translateY(0px)";
        nav.style.opacity = "1";
        nav.dataset.transition = "entered";
      }
    };

    const handle = () => {
      if (media.matches) {
        if (nav) {
          nav.style.transition = "none";
          nav.style.transform = "";
          nav.style.opacity = "";
          nav.dataset.transition = "";
        }
        return;
      }

      if (nav) {
        nav.style.transition = "none";
        nav.style.transform = "translateY(8px)";
        nav.style.opacity = "0";
      }

      if (typeof requestAnimationFrame === "function") {
        requestAnimationFrame(() => {
          if (!nav) return;
          nav.style.transition =
            "transform 180ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms cubic-bezier(0.22, 1, 0.36, 1)";
          nav.style.transform = "translateY(0px)";
          nav.style.opacity = "1";
          nav.dataset.transition = "entered";
        });
      } else {
        if (nav) {
          nav.style.transition =
            "transform 180ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms cubic-bezier(0.22, 1, 0.36, 1)";
          nav.style.transform = "translateY(0px)";
          nav.style.opacity = "1";
          nav.dataset.transition = "entered";
        }
      }
    };

    const onPathnameChange = () => {
      entering();
    };

    pathname;

    window.addEventListener("pageshow", onPathnameChange);
    if (pathname) {
      handle();
    }

    return () => {
      window.removeEventListener("pageshow", onPathnameChange);
      if (nav) {
        nav.style.transition = "";
        nav.style.transform = "";
        nav.style.opacity = "";
        nav.dataset.transition = "";
      }
    };
  }, [pathname]);

  return null;
}
