"use client";

import type { Product } from "@/lib/types";

const BOX_CONTENT: Record<string, string[]> = {
  "pb-20k": [
    "Voltra 20,000mAh Power Bank",
    "USB-C to USB-C charging cable (1.2m)",
    "Travel pouch",
    "Quick-start card",
  ],
  "pb-10k": [
    "Voltra 10,000mAh Power Bank",
    "USB-C to USB-C charging cable (1m)",
    "Quick-start card",
  ],
  "ear-pro": [
    "Voltra Earbuds Pro",
    "USB-C charging case",
    "USB-C to USB-C charging cable (0.8m)",
    "Earbud tips: S / M / L",
    "Quick-start card",
  ],
  "ear-lite": [
    "Voltra Earbuds Lite",
    "USB-C charging case",
    "USB-C to USB-C charging cable (0.8m)",
    "Quick-start card",
  ],
  "headset-1": [
    "Voltra Over-Ear Headset",
    "USB-C to USB-C charging cable (1.2m)",
    "3.5mm audio cable (detachable)",
    "Quick-start card",
  ],
  "cable-3": [
    "USB-C to USB-C cable (1.2m)",
    "Lightning to USB-C cable (1.2m)",
    "Micro-USB to USB-C cable (1.2m)",
    "Rewind tie ×3",
  ],
  "adapter-1": [
    "65W GaN Fast Charger",
    "USB-C to USB-C cable (1.2m)",
    "Travel plug adapter",
    "Quick-start card",
  ],
  "case-1": [
    "Shockproof Phone Case",
    "Anti-yellow back cover insert",
    "Quick-start card",
  ],
};

function boxContentsFor(product: Product): string[] {
  return BOX_CONTENT[product.id] ?? [
    product.name,
    "Quick-start card",
    "Warranty card",
  ];
}

export function InTheBox({ product }: { product: Product }) {
  const contents = boxContentsFor(product);

  return (
    <div className="mt-5 rounded-xl border border-line bg-bg2 p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low">
        What&apos;s in the box
      </p>
      <ul className="mt-2.5 flex flex-col gap-1.5 text-sm text-ink-mid">
        {contents.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 rounded-md py-1 leading-relaxed">
            <svg
              className="mt-0.5 shrink-0 size-3.5 text-volt"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
