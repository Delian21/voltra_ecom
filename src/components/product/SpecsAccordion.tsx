"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface SpecsAccordionProps {
  /** Legacy flat specs list. If present, it is rendered as
   *  keyless rows keyed by index so the accordion still works
   *  before the catalog ships structured specs. */
  specs: string[];
}

export function SpecsAccordion({ specs }: SpecsAccordionProps) {
  const [open, setOpen] = useState(false);
  const [shouldAutoOpen, setShouldAutoOpen] = useState(false);
  const [measuredHeight, setMeasuredHeight] = useState<number | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const measuringRef = useRef<boolean>(false);

  const rows = specs.map((s, i) => ({
    key: s ?? `spec-${i}`,
    label: null,
    value: s,
  }));

  const bodyHeight = measuredHeight ?? 0;

  const measure = useCallback(() => {
    if (measuringRef.current) return;
    measuringRef.current = true;

    requestAnimationFrame(() => {
      measuringRef.current = false;
      const node = bodyRef.current;
      if (!node) return;

      const collapsed = node.getBoundingClientRect().height;
      setMeasuredHeight(collapsed);

      if (!open && collapsed > 0) {
        setShouldAutoOpen(true);
      }
    });
  }, [open]);

  useEffect(() => {
    measure();
  }, [rows, measure]);

  useEffect(() => {
    if (open) {
      const node = bodyRef.current;
      if (!node) return;

      requestAnimationFrame(() => {
        const h = node.getBoundingClientRect().height;
        if (h > 0) setMeasuredHeight(h);
      });
    } else {
      setMeasuredHeight(0);
    }
  }, [open]);

  const isExpanded = open;

  if (rows.length === 0) return null;

  return (
    <div className="mt-9">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isExpanded}
        className="flex w-full items-center justify-between gap-3 border-0 bg-transparent p-0 text-left text-[10px] font-mono uppercase tracking-[0.16em] text-ink-low transition-colors hover:text-ink-mid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt"
        onClick={() => setOpen((v) => !v)}
      >
        <span>Tech specs</span>
        <svg
          aria-hidden
          className="shrink-0 size-3.5 transition-transform duration-200"
          style={{
            transform: isExpanded ? "rotate(180deg)" : undefined,
          }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div
        ref={bodyRef}
        className="overflow-hidden transition-[max-height] duration-200 ease-out"
        style={{
          maxHeight: bodyHeight ? `${bodyHeight}px` : "0px",
        }}
      >
        <div className="mt-3 overflow-hidden rounded-lg border border-line bg-bg2 p-3.5">
          <table className="w-full">
            <tbody>
              {rows.map((row) => (
                <tr key={row.key} className="border-t border-line last:border-t-0">
                  <td className="py-2">
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-low">
                      {row.label ?? "Spec"}
                    </span>
                  </td>
                  <td className="text-right">
                    <span className="font-mono text-[10.5px] text-ink-hi">
                      {row.value}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
