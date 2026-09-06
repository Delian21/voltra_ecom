"use client";

import { useEffect } from "react";

export function useBrowserTransition() {
  useEffect(() => {
    if (typeof document === "undefined") return;

    let nav: HTMLElement | null = null;
    let media: MediaQueryList;

    const resolveNav = () => {
      if (!nav) {
        nav = document.querySelector<HTMLElement>("nav");
      }
      return nav;
    };

    media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const entered = () => {
      const node = resolveNav();
      if (!node) return;

      if (!media.matches) {
        node.style.transition =
          "transform 180ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms cubic-bezier(0.22, 1, 0.36, 1)";
        node.style.transform = "translateY(0px)";
        node.style.opacity = "1";
        node.dataset.transition = "entered";
      } else {
        node.style.transition = "none";
        node.style.transform = "translateY(0px)";
        node.style.opacity = "1";
        node.dataset.transition = "entered";
      }
    };

    const entering = () => {
      const node = resolveNav();
      if (!node) return;

      if (!media.matches) {
        node.style.transition = "none";
        node.style.transform = "translateY(8px)";
        node.style.opacity = "0";
      }

      if (typeof requestAnimationFrame === "function") {
        requestAnimationFrame(entered);
      } else {
        entered();
      }
    };

    document.addEventListener("pageshow", entering);

    return () => {
      document.removeEventListener("pageshow", entering);
      const node = resolveNav();
      if (node) {
        node.style.transition = "";
        node.style.transform = "";
        node.style.opacity = "";
        node.dataset.transition = "";
      }
      nav = null;
    };
  }, []);
}
