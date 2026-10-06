/**
 * Pure order-validation tests — no database required.
 * Run with: npx tsx --test src/lib/data/order-validation.test.ts
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import { mergeLines, normalisePhone, validateOrderInput } from "./order-validation";

const VALID = {
  buyerName: "Ada Obi",
  buyerPhone: "08030000000",
  deliveryAddress: "12 Marina Street, Lagos",
};

test("normalisePhone accepts local and international Nigerian formats", () => {
  assert.equal(normalisePhone("08030000000"), "08030000000");
  assert.equal(normalisePhone("+2348030000000"), "08030000000");
  assert.equal(normalisePhone(" 08030000000 "), "08030000000");
  assert.equal(normalisePhone("0803000000"), null, "too short");
  assert.equal(normalisePhone("12345678901"), null, "wrong prefix");
  assert.equal(normalisePhone("+234 803 000 0000"), null, "spaces are not accepted");
});

test("mergeLines sums duplicate ids in first-seen order", () => {
  assert.deepEqual(
    mergeLines([
      { productId: "a", qty: 2 },
      { productId: "b", qty: 1 },
      { productId: "a", qty: 3 },
    ]),
    [
      { productId: "a", qty: 5 },
      { productId: "b", qty: 1 },
    ],
  );
});

test("validateOrderInput enforces field and quantity bounds", () => {
  assert.equal(validateOrderInput({ ...VALID, lines: [{ productId: "pb-20k", qty: 1 }] }).ok, true);
  assert.equal(validateOrderInput({ ...VALID, buyerName: "A", lines: [{ productId: "pb-20k", qty: 1 }] }).ok, false);
  assert.equal(validateOrderInput({ ...VALID, deliveryAddress: "no", lines: [{ productId: "pb-20k", qty: 1 }] }).ok, false);
  assert.equal(validateOrderInput({ ...VALID, lines: [] }).ok, false);
  assert.equal(validateOrderInput({ ...VALID, lines: [{ productId: "pb-20k", qty: 0 }] }).ok, false);
  assert.equal(validateOrderInput({ ...VALID, lines: [{ productId: "pb-20k", qty: 51 }] }).ok, false);
  assert.equal(validateOrderInput({ ...VALID, lines: [{ productId: "pb-20k", qty: 1.5 }] }).ok, false);
  assert.equal(validateOrderInput({ ...VALID, lines: [{ productId: "", qty: 1 }] }).ok, false);
  assert.equal(validateOrderInput(null).ok, false);
  assert.equal(validateOrderInput({ ...VALID, lines: "nope" }).ok, false);
});

test("validateOrderInput trims, normalises and merges", () => {
  const result = validateOrderInput({
    buyerName: "  Ada Obi  ",
    buyerPhone: "+2348030000000",
    deliveryAddress: "  12 Marina Street, Lagos  ",
    lines: [
      { productId: " pb-20k ", qty: 2 },
      { productId: "pb-20k", qty: 3 },
    ],
  });
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.value.buyerName, "Ada Obi");
  assert.equal(result.value.buyerPhone, "08030000000");
  assert.equal(result.value.deliveryAddress, "12 Marina Street, Lagos");
  assert.deepEqual(result.value.lines, [{ productId: "pb-20k", qty: 5 }]);
});
