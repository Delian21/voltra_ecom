"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tiny seeded PRNG (mulberry32). Deterministic per-seed, so the flicker
 * pattern is random-looking without looping a short fixed schedule.
 */
function mulberry32(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type BoltMode = "pulse" | "flicker";

type BoltBehavior = {
  seed: number;
  mode: BoltMode;
  minSteps?: number;
  maxSteps?: number;
  minHold?: number;
  maxHold?: number;
  pulseLow?: number;
  pulseHigh?: number;
  pulseMinHold?: number;
  pulseMaxHold?: number;
};

type BoltState = {
  rng: ReturnType<typeof mulberry32>;
  mode: BoltMode;
  // Common fields used by both modes.
  hold: number;
  count: number;
  targetOpacity: number;
  // Flicker-mode fields.
  flickerTargetOpacity: number;
  flickerTargetSteps: number;
  // Pulse-mode fields.
  pulseLow: number;
  pulseHigh: number;
  pulseMinHold: number;
  pulseMaxHold: number;
  pulsePhase: "up" | "down";
};

/**
 * Irregular flicker — simulates a jagged electric pulse with random-looking
 * opacity jumps rather than a smooth breathing animation.
 *
 * The main bolt typically runs in "pulse" mode (slow, smooth breathing),
 * while the smaller bolts run in "flicker" mode (short, erratic jumps).
 * A single shared RAF clock drives all layers, so they stay coordinated even
 * though their rhythms differ on purpose.
 */
function useElectricFlicker(
  ref: React.RefObject<SVGPathElement | null>,
  behavior: BoltBehavior
) {
  const stateRef = useRef<BoltState>({
    rng: mulberry32(behavior.seed),
    mode: behavior.mode,
    hold: 0,
    count: 0,
    targetOpacity: 1,
    flickerTargetOpacity: 0.2,
    flickerTargetSteps: 1,
    pulseLow: behavior.pulseLow ?? 0.25,
    pulseHigh: behavior.pulseHigh ?? 0.95,
    pulseMinHold: behavior.pulseMinHold ?? 1200,
    pulseMaxHold: behavior.pulseMaxHold ?? 2600,
    pulsePhase: "up",
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const s = stateRef.current;
    s.hold = 0;
    s.count = 0;

    if (s.mode === "pulse") {
      s.pulsePhase = "up";
      el.style.opacity = String(s.pulseLow);
    } else {
      el.style.opacity = "0.2";
    }

    return () => {
      // The owning effect clears the shared RAF, so nothing to tear down here.
    };
  }, [ref]);

  return stateRef;
}

function nextFlicker(
  rng: ReturnType<typeof mulberry32>,
  {
    minSteps,
    maxSteps,
    minHold,
    maxHold,
  }: {
    minSteps: number;
    maxSteps: number;
    minHold: number;
    maxHold: number;
  }
) {
  const hold =
    minHold + rng() * (maxHold - minHold);
  const target =
    minSteps + Math.floor(rng() * (maxSteps - minSteps + 1));
  // Mostly dark with occasional bright spikes — looks like random arcing.
  const opacity = 0.12 + rng() * 0.85;
  return { hold, target, opacity };
}

/** Bolt path used across the site (same shape as the main Hero bolt). */
const BOLT_PATH = "M74 5 L20 180 L52 180 L34 310 L88 140 L54 140 L74 5Z";

/** SVG defs for glow filters + gradient — reused via <defs> in each host SVG. */
const BOLT_DEFS = (
  <defs>
    <linearGradient id="boltGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
      <stop offset="50%" stopColor="rgba(198,255,62,0.7)" />
      <stop offset="100%" stopColor="rgba(198,255,62,0.3)" />
    </linearGradient>
    <filter id="boltGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="10" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="boltSoftGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="20" result="blur" />
      <feFlood floodColor="rgba(198,255,62,0.35)" result="color" />
      <feComposite in="color" in2="blur" operator="in" result="soft" />
      <feMerge>
        <feMergeNode in="soft" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="coronaGlow" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="35" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

type BoltSpec = {
  ref: React.RefObject<SVGPathElement | null>;
  className?: string;
  fill: string;
  stroke: string | undefined;
  strokeWidth: number | undefined;
  filter: string;
  transform?: string;
  opacity?: number;
};

function BoltLayer({
  path,
  glow,
  flickerRef,
}: {
  path: string;
  glow: boolean;
  flickerRef: React.RefObject<SVGPathElement | null>;
}) {
  return (
    <path
      d={path}
      fill={glow ? "rgba(198,255,62,0.15)" : "url(#boltGrad)"}
      stroke={glow ? undefined : "rgba(198,255,62,0.6)"}
      strokeWidth={glow ? undefined : 2}
      strokeLinejoin="round"
      filter={glow ? "url(#boltSoftGlow)" : "url(#boltGlow)"}
      className="pointer-events-none select-none"
      ref={flickerRef}
    />
  );
}

function renderBolt(spec: BoltSpec) {
  return (
    <path
      d={BOLT_PATH}
      fill={spec.fill}
      stroke={spec.stroke}
      strokeWidth={spec.strokeWidth}
      strokeLinejoin="round"
      filter={spec.filter}
      className={spec.className ?? "pointer-events-none select-none"}
      ref={spec.ref}
      opacity={spec.opacity}
    />
  );
}

type LightningBoltProps = {
  /**
   * How the bolt behaves by default.
   *
   * - "erratic" — every layer flickers for a chaotic electric mood (the
   *   current default).
   * - "calm" — every layer breathes slowly for a quieter, charged feel.
   * - "auto" — kept for backward compat; currently behaves like "erratic".
   */
  mode?: "auto" | "calm" | "erratic";
  /**
   * Per-placement tuning when `mode` is `"calm"` or `"erratic"`, or when you
   * want to nudge the default split used by `"auto"`.
   */
  behavior?: Partial<BoltBehavior>;
};

/**
 * Lightning bolt with three layered offsets for depth.
 *
 * By default every layer flickers erratically for a chaotic electric mood.
 * Pass `mode="calm"` for a quieter breathing feel across all layers.
 *
 * The main bolt's live opacity and pulse phase are exported as CSS variables on
 * the main bolt path (`--bolt-opacity`, `--bolt-phase`, `--bolt-core-opacity`),
 * so sibling UI such as glows or badges can subtly breathe in sync with the bolt.
 */
export function LightningBolt({
  mode = "erratic",
  behavior = {},
}: LightningBoltProps = {}) {
  const mainRef = useRef<SVGPathElement | null>(null);
  const offsetRef = useRef<SVGPathElement | null>(null);
  const deepRef = useRef<SVGPathElement | null>(null);
  const coronaRef = useRef<SVGPathElement | null>(null);

  // Motion-sensitive users get a calm, static bolt instead of an intentional
  // flicker.
  const [prefersReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  // Battery guard: the clock only runs while the tab is visible AND the bolt
  // (and therefore the hero) is on screen. Either condition going false
  // cancels the RAF loop entirely instead of leaving it ticking invisibly.
  const [tabVisible, setTabVisible] = useState(true);
  const [inView, setInView] = useState(true);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const clockOn = tabVisible && inView;

  useEffect(() => {
    const sync = () => setTabVisible(!document.hidden);
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setInView(entry.isIntersecting);
      },
      { threshold: 0 },
    );
    io.observe(svg);
    return () => io.disconnect();
  }, []);

  const isCalm =
    mode === "calm"
      ? true
      : mode === "erratic" || mode === "auto"
      ? false
      : behavior.mode === "flicker"
      ? false
      : true;

  // Main bolt: slow, smooth pulse unless overridden to flicker.
  const mainState = useElectricFlicker(mainRef, {
    seed: 7,
    mode: behavior.mode ?? (isCalm ? "pulse" : "flicker"),
    ...behavior,
  });
  // Offset bolt: erratic flicker in auto/erratic, slow pulse in calm.
  const offsetState = useElectricFlicker(offsetRef, {
    seed: 42,
    mode: isCalm ? "pulse" : "flicker",
    ...(behavior.mode === "flicker"
      ? {
          minSteps: behavior.minSteps ?? 2,
          maxSteps: behavior.maxSteps ?? 6,
          minHold: behavior.minHold ?? 40,
          maxHold: behavior.maxHold ?? 160,
        }
      : {}),
    ...(!isCalm && behavior.mode !== "flicker"
      ? {
          minSteps: behavior.minSteps ?? 2,
          maxSteps: behavior.maxSteps ?? 6,
          minHold: behavior.minHold ?? 40,
          maxHold: behavior.maxHold ?? 160,
        }
      : {}),
    ...(isCalm
      ? {
          pulseLow: behavior.pulseLow ?? 0.25,
          pulseHigh: behavior.pulseHigh ?? 0.9,
          pulseMinHold: behavior.pulseMinHold ?? 1400,
          pulseMaxHold: behavior.pulseMaxHold ?? 3000,
        }
      : {}),
  });
  // Deep bolt: erratic flicker in auto/erratic, slow pulse in calm.
  const deepState = useElectricFlicker(deepRef, {
    seed: 123,
    mode: isCalm ? "pulse" : "flicker",
    ...(behavior.mode === "flicker"
      ? {
          minSteps: behavior.minSteps ?? 2,
          maxSteps: behavior.maxSteps ?? 7,
          minHold: behavior.minHold ?? 60,
          maxHold: behavior.maxHold ?? 220,
        }
      : {}),
    ...(!isCalm && behavior.mode !== "flicker"
      ? {
          minSteps: behavior.minSteps ?? 2,
          maxSteps: behavior.maxSteps ?? 7,
          minHold: behavior.minHold ?? 60,
          maxHold: behavior.maxHold ?? 220,
        }
      : {}),
    ...(isCalm
      ? {
          pulseLow: behavior.pulseLow ?? 0.15,
          pulseHigh: behavior.pulseHigh ?? 0.7,
          pulseMinHold: behavior.pulseMinHold ?? 1800,
          pulseMaxHold: behavior.pulseMaxHold ?? 3600,
        }
      : {}),
  });

  // Slow outer corona behind the main bolt — pulses on a slower cycle.
  const coronaState = useElectricFlicker(coronaRef, {
    seed: 99,
    mode: "pulse",
    pulseLow: 0.05,
    pulseHigh: 0.45,
    pulseMinHold: 2400,
    pulseMaxHold: 5200,
  });

  // Single shared clock drives all four layers in lockstep. Runs only while
  // the tab is visible and the bolt is on screen (see clockOn above).
  useEffect(() => {
    if (prefersReducedMotion) {
      // Static presentation: no RAF loop, no flicker. The main bolt sits at a
      // gentle fixed opacity; layered paths defer to their <g> wrappers.
      const staticOpacity: Array<[React.RefObject<SVGPathElement | null>, string]> = [
        [mainRef, "0.85"],
        [offsetRef, "1"],
        [deepRef, "1"],
        [coronaRef, "0.18"],
      ];
      for (const [ref, opacity] of staticOpacity) {
        const el = ref.current;
        if (el) el.style.opacity = opacity;
      }
      // Siblings (hero glow, CTAs) read the root variable — keep them alive.
      document.documentElement.style.setProperty("--bolt-opacity", "0.85");
      return;
    }

    if (!clockOn) return;

    const onFrame = () => {
      for (const { state, ref } of [
        { state: mainState.current, ref: mainRef },
        { state: offsetState.current, ref: offsetRef },
        { state: deepState.current, ref: deepRef },
        { state: coronaState.current, ref: coronaRef },
      ]) {
        const el = ref.current;
        if (!el) continue;

        const s = state;

        if (s.mode === "pulse") {
          if (s.hold <= 0) {
            const hold =
              s.pulseMinHold +
              s.rng() * (s.pulseMaxHold - s.pulseMinHold);
            s.hold = Math.round(hold);
            s.pulsePhase =
              s.pulsePhase === "up" ? "down" : "up";
            s.targetOpacity =
              s.pulsePhase === "up" ? s.pulseLow : s.pulseHigh;
          }

          s.hold -= 16;
          if (s.hold < 0) s.hold = 0;

          // Smooth ease toward the current pulse target.
          const prev =
            parseFloat(el.style.opacity) || s.pulseLow;
          const next = prev + (s.targetOpacity - prev) * 0.06;
          el.style.opacity = String(next);
        } else {
          // Flicker mode: short random jumps with hard resets between.
          if (s.hold <= 0) {
            // Per-bolt budget so each flickering layer feels different.
            const budget =
              ref === offsetRef
                ? {
                    minSteps: s.flickerTargetSteps,
                    maxSteps: s.flickerTargetSteps,
                    minHold: 40,
                    maxHold: 160,
                  }
                : ref === deepRef
                ? {
                    minSteps: s.flickerTargetSteps,
                    maxSteps: s.flickerTargetSteps,
                    minHold: 60,
                    maxHold: 220,
                  }
                : { minSteps: 2, maxSteps: 6, minHold: 40, maxHold: 160 };
            const primed = nextFlicker(s.rng, budget);
            s.hold = Math.round(primed.hold);
            s.count = 0;
            s.flickerTargetSteps = primed.target;
            s.flickerTargetOpacity = primed.opacity;
            el.style.opacity = String(primed.opacity);
            continue;
          }

          s.hold -= 16;
          if (s.hold < 0) s.hold = 0;

          s.count += 1;
          if (s.count >= s.flickerTargetSteps) {
            // Brief blackout between flickers keeps the erratic feel.
            el.style.opacity = "0.04";
            s.hold = 0;
            continue;
          }

          // Hold the flicker target steady for its short lifetime.
          el.style.opacity = String(s.flickerTargetOpacity);
        }
      }

      // Export the main bolt's live state as CSS variables for sibling UI.
      // Root-level copy feeds the hero glow blob and CTA buttons; the
      // path-level copy stays for any consumer scoped to the SVG.
      const mainEl = mainRef.current;
      if (mainEl) {
        const main = mainState.current;
        mainEl.style.setProperty("--bolt-opacity", mainEl.style.opacity);
        document.documentElement.style.setProperty(
          "--bolt-opacity",
          mainEl.style.opacity,
        );
        mainEl.style.setProperty(
          "--bolt-phase",
          main.pulsePhase === "up" ? "rising" : "falling"
        );
        const core = parseFloat(mainEl.style.opacity) || 0;
        mainEl.style.setProperty(
          "--bolt-core-opacity",
          String(Math.min(1, core * 1.1))
        );
      }

      raf = requestAnimationFrame(onFrame);
    };

    let raf: number;
    raf = requestAnimationFrame(onFrame);
    return () => cancelAnimationFrame(raf);
  }, [clockOn, prefersReducedMotion]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 120 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="pointer-events-none"
      style={
        {
          "--bolt-opacity": "0",
          "--bolt-phase": "rising",
          "--bolt-core-opacity": "0",
        } as React.CSSProperties
      }
    >
      {BOLT_DEFS}
      {/* Slow outer corona behind the main bolt for extra depth */}
      <g className="pointer-events-none select-none">
        <path
          ref={coronaRef}
          d={BOLT_PATH}
          fill="rgba(198,255,62,0.18)"
          filter="url(#coronaGlow)"
        />
      </g>
      {/* Deepest (smallest, farthest back) bolt for atmospheric depth */}
      <g transform="translate(22, -10) scale(0.32)" opacity="0.35">
        {renderBolt({
          ref: deepRef,
          fill: "rgba(198,255,62,0.08)",
          stroke: undefined,
          strokeWidth: undefined,
          filter: "url(#boltSoftGlow)",
        })}
      </g>
      {/* Offset (smaller) bolt — offset right and up for layered electric look */}
      <g transform="translate(18, -14) scale(0.55)" opacity="0.5">
        <path
          d={BOLT_PATH}
          fill="rgba(198,255,62,0.1)"
          filter="url(#boltSoftGlow)"
          className="pointer-events-none select-none"
          ref={offsetRef}
        />
        <path
          d={BOLT_PATH}
          fill="url(#boltGrad)"
          stroke="rgba(198,255,62,0.4)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          filter="url(#boltGlow)"
          className="pointer-events-none select-none"
          ref={offsetRef}
        />
      </g>
      {/* Main bolt */}
      <BoltLayer path={BOLT_PATH} glow={false} flickerRef={mainRef} />
      {/* Main bolt outer soft glow (follows the core pulse) */}
      <path
        d={BOLT_PATH}
        fill="rgba(198,255,62,0.15)"
        filter="url(#boltSoftGlow)"
        className="pointer-events-none select-none"
        ref={mainRef}
      />
      {/* Bright core highlight (follows the core pulse) */}
      <path
        d={BOLT_PATH}
        fill="rgba(255,255,255,0.08)"
        className="pointer-events-none select-none"
        ref={mainRef}
      />
    </svg>
  );
}

/** Faint watermark bolt for behind title text — no flicker, very low opacity. */
export function WatermarkBolt() {
  return (
    <svg
      viewBox="0 0 120 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="pointer-events-none"
    >
      <path
        d={BOLT_PATH}
        fill="rgba(198,255,62,0.8)"
        className="pointer-events-none select-none"
      />
    </svg>
  );
}
