/**
 * Voltra logo mark — "V-leg bolt" (mark D, straight edges, two-tone).
 *
 * Locked spec (PLAN.md §8):
 *   - Left leg  — straight, ink-white #F4F6FA  : "the reliable line"
 *   - Right leg — volt-lime #C6FF3E, single sharp notch : "the current"
 *
 * 24-unit viewBox, stroke-width 2.6, butt caps + miter joins (no rounding).
 *
 * Tones: "two-tone" (default, ink left + lime live leg), "accent" (all lime),
 * "ink" (all ink-hi). Color values match the Volt Dark tokens.
 */
import type { SVGProps } from "react";

const INK = "#F4F6FA";
const LIME = "#C6FF3E";
const STROKE_WIDTH = 2.6;

export type LogoMarkTone = "two-tone" | "accent" | "ink";

export interface LogoMarkProps extends SVGProps<SVGSVGElement> {
  /** Width/height in px. Default 32. */
  size?: number | string;
  /** Color treatment. Default "two-tone". */
  tone?: LogoMarkTone;
}

export function LogoMark({
  size = 32,
  tone = "two-tone",
  ...rest
}: LogoMarkProps) {
  const leftColor = tone === "accent" ? LIME : INK;
  const rightColor = tone === "ink" ? INK : LIME;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...rest}
    >
      {/* Straight leg (reliable line) */}
      <path
        d="M5.2 3.6 L12 19.6"
        stroke={leftColor}
        strokeWidth={STROKE_WIDTH}
      />
      {/* Live leg (current), single sharp notch */}
      <path
        d="M12 19.6 L15.4 12.6 L13.9 12.6 L18.9 3.6"
        stroke={rightColor}
        strokeWidth={STROKE_WIDTH}
      />
    </svg>
  );
}

export default LogoMark;
