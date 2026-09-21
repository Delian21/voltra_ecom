/**
 * Image-key resolver — maps stable string keys (stored in the DB / seed data)
 * to the bundled StaticImageData imported at build time. The DB never stores
 * binaries; photos ship with the app bundle as today.
 */
import type { StaticImageData } from "next/image";

import pb20k from "./images/pb-20k.jpg";
import pb20k2 from "./images/pb-20k-2.jpg";
import pb20k3 from "./images/pb-20k-3.jpg";
import pb10k from "./images/pb-10k.jpg";
import pb10k2 from "./images/pb-10k-2.jpg";
import pb10k3 from "./images/pb-10k-3.jpg";
import earPro from "./images/ear-pro.jpg";
import earPro2 from "./images/ear-pro-2.jpg";
import earPro3 from "./images/ear-pro-3.jpg";
import earLite from "./images/ear-lite.jpg";
import earLite2 from "./images/ear-lite-2.jpg";
import earLite3 from "./images/ear-lite-3.jpg";
import headset from "./images/headset.jpg";
import headset2 from "./images/headset-2.jpg";
import headset3 from "./images/headset-3.jpg";
import cable from "./images/cable.jpg";
import cable2 from "./images/cable-2.jpg";
import cable3 from "./images/cable-3.jpg";
import adapter from "./images/adapter.jpg";
import adapter2 from "./images/adapter-2.jpg";
import adapter3 from "./images/adapter-3.jpg";
import caseImg from "./images/case.jpg";
import case2 from "./images/case-2.jpg";
import case3 from "./images/case-3.jpg";

const IMAGES: Record<string, StaticImageData> = {
  "pb-20k": pb20k,
  "pb-20k-2": pb20k2,
  "pb-20k-3": pb20k3,
  "pb-10k": pb10k,
  "pb-10k-2": pb10k2,
  "pb-10k-3": pb10k3,
  "ear-pro": earPro,
  "ear-pro-2": earPro2,
  "ear-pro-3": earPro3,
  "ear-lite": earLite,
  "ear-lite-2": earLite2,
  "ear-lite-3": earLite3,
  headset: headset,
  "headset-2": headset2,
  "headset-3": headset3,
  cable: cable,
  "cable-2": cable2,
  "cable-3": cable3,
  adapter: adapter,
  "adapter-2": adapter2,
  "adapter-3": adapter3,
  case: caseImg,
  "case-2": case2,
  "case-3": case3,
};

/** Fallback to the primary image of the same product family if a key is unknown. */
export function resolveImage(key: string): StaticImageData {
  return IMAGES[key] ?? pb20k;
}
