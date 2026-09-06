import { test, expect, type Page } from "@playwright/test";

/**
 * Shared helpers. The cart persists in localStorage between tests within the
 * same browser context, so every test starts from a clean storage state
 * (Playwright creates a fresh context per test — nothing to reset).
 *
 * The header renders CartSheet twice (desktop nav + mobile header) and CSS
 * hides whichever doesn't apply, so locators must filter to VISIBLE elements.
 */

const PRODUCT_URL = "/shop/voltra-20000mah-power-bank";

/** The visible cart toggle (desktop and mobile both render one). */
function cartButton(page: Page) {
  return page
    .locator('button[aria-label^="Open cart"]')
    .filter({ visible: true });
}

/** The visible cart badge span (only rendered when count > 0). */
function cartBadge(page: Page) {
  return cartButton(page).locator("span");
}

/** The visible "Add to cart" (product page renders mobile + desktop variants). */
function addButtons(page: Page) {
  return page
    .locator("main button", { hasText: /add to cart/i })
    .filter({ visible: true });
}

async function addToCartFromProductPage(page: Page) {
  await page.goto(PRODUCT_URL);
  await addButtons(page).first().click();
  await expect(cartBadge(page)).toHaveText("1");
}

test.describe("Cart badge + add-to-cart", () => {
  test("adding a product updates the badge count", async ({ page }) => {
    await page.goto("/shop");
    await expect(cartButton(page)).toBeVisible();

    await page.goto(PRODUCT_URL);
    await addButtons(page).first().click();

    await expect(cartBadge(page)).toHaveText("1");
  });

  test("adding twice increments the badge", async ({ page }) => {
    await page.goto(PRODUCT_URL);
    const addBtn = addButtons(page).first();
    await addBtn.click();
    await addBtn.click();
    await expect(cartBadge(page)).toHaveText("2");
  });
});

test.describe("Cart sheet interactions", () => {
  test("sheet shows the added item with thumbnail, qty and total", async ({
    page,
  }) => {
    await addToCartFromProductPage(page);

    await cartButton(page).click();
    const dialog = page.locator('aside[aria-label="Your cart"]');
    await expect(dialog).toBeVisible();

    // Regression guard: the sheet must span the viewport, not be clipped to
    // the header strip (the old fixed-inside-backdrop-filter bug).
    const box = await dialog.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y).toBeLessThan(5);
    expect(box!.height).toBeGreaterThan(300);

    // Item line renders with photo thumbnail (regression: items invisible).
    const line = dialog.locator("li").first();
    await expect(line).toContainText("Voltra 20,000mAh Power Bank");
    await expect(line).toContainText("₦26,500");

    // Footer total matches.
    await expect(dialog).toContainText("₦26,500");
  });

  test("quantity stepper updates badge and total", async ({ page }) => {
    await addToCartFromProductPage(page);
    await cartButton(page).click();
    const dialog = page.locator('aside[aria-label="Your cart"]');

    await dialog
      .getByRole("button", { name: /increase quantity/i })
      .first()
      .click();
    await expect(cartBadge(page)).toHaveText("2");
    await expect(dialog).toContainText("₦53,000");

    // Decreasing to 0 removes the line and shows the empty state.
    await dialog
      .getByRole("button", { name: /decrease quantity/i })
      .first()
      .click();
    await dialog
      .getByRole("button", { name: /decrease quantity/i })
      .first()
      .click();
    await expect(dialog).toContainText(/cart is empty/i);
    await expect(cartBadge(page)).toHaveCount(0);
  });

  test("remove button empties the cart", async ({ page }) => {
    await addToCartFromProductPage(page);
    await cartButton(page).click();
    const dialog = page.locator('aside[aria-label="Your cart"]');

    await dialog
      .getByRole("button", { name: /remove voltra/i })
      .first()
      .click();
    await expect(dialog).toContainText(/cart is empty/i);
  });

  test("escape key closes the sheet", async ({ page }) => {
    await addToCartFromProductPage(page);
    await cartButton(page).click();
    const dialog = page.locator('aside[aria-label="Your cart"]');
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("clicking a link inside the sheet navigates and closes it", async ({
    page,
  }) => {
    await addToCartFromProductPage(page);
    await cartButton(page).click();
    const dialog = page.locator('aside[aria-label="Your cart"]');
    await expect(dialog).toBeVisible();

    // Click a cross-sell product link inside the sheet.
    await dialog.locator('a[href^="/shop/"]').first().click();

    await expect(page).toHaveURL(/\/shop\/[a-z0-9-]+$/);
    // Regression guard: the portaled sheet must close after navigation and
    // restore body scrolling.
    await expect(dialog).toBeHidden();
    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).not.toBe("hidden");
  });

  test("checkout button goes to /checkout and order summary shows the item", async ({
    page,
  }) => {
    await addToCartFromProductPage(page);
    await cartButton(page).click();
    await page
      .locator('aside[aria-label="Your cart"] button', {
        hasText: /^Checkout$/,
      })
      .click();

    await expect(page).toHaveURL(/\/checkout/);
    // Regression guard: checkout used to paint blank under an opaque overlay.
    await expect(page.locator("main h1")).toHaveText("Checkout");
    await expect(page.locator("main h1")).toBeVisible();
    await expect(page.locator("main li").first()).toContainText(
      "Voltra 20,000mAh Power Bank",
    );
    await expect(page.locator("main")).toContainText("Total · 1 item");
  });
});

test.describe("Checkout flow", () => {
  test("empty cart shows the empty state, not a blank page", async ({
    page,
  }) => {
    await page.goto("/checkout");
    await expect(page.locator("main h1")).toHaveText(/Your cart is empty/i);
    await expect(page.locator("main h1")).toBeVisible();
  });

  test("placing an order requires name and phone, then confirms", async ({
    page,
  }) => {
    await addToCartFromProductPage(page);
    await page.goto("/checkout");

    await expect(page.locator("main h1")).toHaveText("Checkout");

    // Clicking without an address keeps you on checkout (toast + no nav).
    const placeOrder = page
      .locator('button:has-text("Place order")')
      .filter({ visible: true })
      .first();
    await placeOrder.click();
    expect(page.url()).toContain("/checkout");

    await page.getByLabel(/full name/i).fill("Ada Obi");
    await page.getByLabel(/phone/i).fill("08030000000");
    await placeOrder.click();

    await expect(page).toHaveURL(/\/checkout\/confirmation/);
  });

  test("payment method selection works", async ({ page }) => {
    await addToCartFromProductPage(page);
    await page.goto("/checkout");

    const flutterwave = page
      .getByRole("button", { name: /flutterwave/i })
      .first();
    await flutterwave.click();
    await expect(flutterwave).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.getByRole("button", { name: /paystack/i }).first(),
    ).toHaveAttribute("aria-pressed", "false");
  });
});

test.describe("Active nav highlighting", () => {
  // Exact accessible names: the header also contains a "Retailer status"
  // chip link to /retailer that must not be confused with the nav link.
  const shopLink = (page: Page) =>
    page.getByRole("link", { name: "Shop", exact: true });
  const retailersLink = (page: Page) =>
    page.getByRole("link", { name: "Retailers", exact: true });

  test("shop route highlights the Shop link", async ({ page }) => {
    await page.goto("/shop");
    await expect(shopLink(page)).toHaveAttribute("aria-current", "page");
    await expect(retailersLink(page)).not.toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  test("retailer subroutes keep Retailers highlighted (section match)", async ({
    page,
  }) => {
    await page.goto("/retailer/bulk");
    await expect(retailersLink(page)).toHaveAttribute("aria-current", "page");
    await expect(shopLink(page)).not.toHaveAttribute("aria-current", "page");
  });

  test("unrelated routes highlight nothing", async ({ page }) => {
    await page.goto("/settings");
    await expect(shopLink(page)).not.toHaveAttribute("aria-current", "page");
    await expect(retailersLink(page)).not.toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});

test.describe("Retailer RFQ flow", () => {
  /** The console is gated; walk the demo application to unlock it. */
  async function unlockConsole(page: Page) {
    await page.goto("/retailer");
    await page.getByLabel("Shop name").fill("Ada Gadgets");
    await page.getByLabel("WhatsApp number").fill("08030000000");
    await page
      .getByRole("button", { name: /apply for wholesale access/i })
      .click();
    await page
      .getByRole("button", { name: /approve application/i })
      .click();
    await expect(page.getByRole("link", { name: "Request quote" })).toBeVisible();
  }

  test("validates, submits, and shows a success screen", async ({ page }) => {
    await unlockConsole(page);
    await page.getByRole("link", { name: "Request quote" }).click();
    await expect(page.locator("main h1")).toHaveText(/build your wholesale quote/i);

    // Submitting with nothing filled shows inline validation errors.
    await page.getByRole("button", { name: /send quote request/i }).click();
    await expect(page.getByText(/add your business name/i)).toBeVisible();
    await expect(page.getByText(/add at least one product/i)).toBeVisible();

    // Itemize a line: +10 on the first product.
    await page
      .getByRole("button", { name: /add ten .* to quote/i })
      .first()
      .click();
    await expect(page.locator("main")).toContainText(/1 SKU · 10 units/);

    await page.getByLabel("Business name").fill("Ada Gadgets");
    await page.getByLabel("WhatsApp number").fill("08030000000");
    await page.getByRole("button", { name: /send quote request/i }).click();

    const success = page.getByText(/quote request received/i);
    await expect(success).toBeVisible();
    await expect(page.locator("main")).toContainText(/QR-[A-Z0-9]+/);
    await expect(
      page.getByRole("link", { name: /continue on whatsapp/i }),
    ).toBeVisible();

    // Draft was cleared; reloading keeps the submitted state (persisted).
    await page.reload();
    await expect(success).toBeVisible();
  });

  test("WhatsApp deep-link prefills the itemized list", async ({ page, context }) => {
    await unlockConsole(page);
    await page.getByRole("link", { name: "Request quote" }).click();

    // The hand-off is disabled until at least one line exists.
    const waButton = page.getByRole("button", { name: /continue on whatsapp/i });
    await expect(waButton).toBeDisabled();

    await page
      .getByRole("button", { name: /add ten .* to quote/i })
      .first()
      .click();
    await expect(waButton).toBeEnabled();

    const popupPromise = context.waitForEvent("page");
    await waButton.click();
    const popup = await popupPromise;
    const url = popup.url();
    // wa.me redirects to api.whatsapp.com/send before we can read it, and
    // the redirector re-encodes spaces as '+', which decodeURIComponent does
    // not restore — normalize first. Assert on the prefilled message, the
    // actual contract.
    const decoded = decodeURIComponent(url.replace(/\+/g, " "));
    expect(decoded).toContain("Hello Voltra");
    expect(decoded).toContain("Voltra 20,000mAh Power Bank × 10");
    await popup.close();
  });
});

test.describe("Shop filters (URL-synced)", () => {
  test("search and category chip sync into the URL", async ({ page }) => {
    await page.goto("/shop");

    await page.getByLabel("Search products").fill("power");
    await expect(page.locator("main")).toContainText("2 products");
    await expect(page).toHaveURL(/\/shop\?q=power$/);

    // Category chip combines with the query.
    await page.getByRole("button", { name: "Earphones", exact: true }).click();
    await expect(page.locator("main")).toContainText("0 products");
    await expect(page).toHaveURL(/q=power&category=Earphones/);

    // Clearing everything returns to the clean URL.
    await page.getByRole("button", { name: "Clear filters" }).first().click();
    await expect(page).toHaveURL(/\/shop$/);
  });

  test("sort selection syncs into the URL", async ({ page }) => {
    await page.goto("/shop");
    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: /price: low to high/i }).click();
    await expect(page).toHaveURL(/\/shop\?sort=price-asc$/);
  });

  test("filters restore from the URL on load", async ({ page }) => {
    await page.goto("/shop?q=power&category=Power+Banks&sort=price-asc");

    await expect(page.getByLabel("Search products")).toHaveValue("power");
    await expect(page.locator("main")).toContainText("2 products");
    // First card is the cheaper power bank (10,000mAh at ₦15,800).
    await expect(
      page.locator('main a[href^="/shop/"]').first(),
    ).toContainText("10,000mAh");
  });
});

test.describe("Product images", () => {
  test("shop grid renders optimized next/image photos", async ({ page }) => {
    await page.goto("/shop");
    // next/image serves via /_next/image?url=<encoded media path>; product
    // filenames survive URL encoding, so match on those.
    const images = page.locator('main a[href^="/shop/"] img[src*="pb-20k"]');
    await expect(images.first()).toBeVisible();
    const imgs = page.locator('main img[src*="/_next/image"]');
    expect(await imgs.count()).toBeGreaterThanOrEqual(8);
  });

  test("all catalog images actually load (blur placeholders wired)", async ({
    page,
  }) => {
    await page.goto("/shop");
    const imgs = page.locator('main img[src*="/_next/image"]');
    const count = await imgs.count();
    expect(count).toBeGreaterThanOrEqual(8);
    for (let i = 0; i < count; i++) {
      const ok = await imgs
        .nth(i)
        .evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0);
      expect(ok, `image ${i} should load`).toBe(true);
    }
  });

  test("cart line thumbnail uses the optimized image", async ({ page }) => {
    await page.goto(PRODUCT_URL);
    await addButtons(page).first().click();
    await expect(cartBadge(page)).toHaveText("1");

    await cartButton(page).click();
    const line = page.locator('aside[aria-label="Your cart"] li').first();
    await expect(line.locator("img")).toHaveAttribute(
      "src",
      /pb-20k/,
    );
  });

  test("product gallery switches angles via thumbnails", async ({ page }) => {
    await page.goto(PRODUCT_URL);

    const tabs = page.getByRole("tab", { name: /view photo/i });
    await expect(tabs).toHaveCount(3);

    // Main image starts on view 1, then swaps to view 3 on thumbnail click.
    const mainImg = page.locator('main img[alt*="view"]');
    await expect(mainImg).toHaveAttribute("alt", /view 1 of 3/);
    await tabs.nth(2).click();
    await expect(mainImg).toHaveAttribute("alt", /view 3 of 3/);
    await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
  });

  test("product gallery navigates with arrow keys", async ({ page }) => {
    await page.goto(PRODUCT_URL);
    const mainImg = page.locator('main img[alt*="view"]');
    await expect(mainImg).toHaveAttribute("alt", /view 1 of 3/);

    // Focus the gallery frame itself, then arrow through the angles.
    await page.locator('main [role="group"][aria-label*="gallery"]').focus();
    await page.keyboard.press("ArrowRight");
    await expect(mainImg).toHaveAttribute("alt", /view 2 of 3/);
    await page.keyboard.press("ArrowRight");
    await expect(mainImg).toHaveAttribute("alt", /view 3 of 3/);
    // Clamped at the last angle.
    await page.keyboard.press("ArrowRight");
    await expect(mainImg).toHaveAttribute("alt", /view 3 of 3/);
    await page.keyboard.press("ArrowLeft");
    await expect(mainImg).toHaveAttribute("alt", /view 2 of 3/);
  });

  test("product gallery responds to touch swipes", async ({ browser }) => {
    // Touch events need a touch-enabled context.
    const context = await browser.newContext({
      hasTouch: true,
      viewport: { width: 390, height: 844 },
    });
    const page = await context.newPage();
    await page.goto(PRODUCT_URL);
    const mainImg = page.locator('main img[alt*="view"]');
    await expect(mainImg).toHaveAttribute("alt", /view 1 of 3/);

    // Synthesize a leftward swipe on the main image (next photo).
    const frame = page.locator("main .touch-pan-y").first();
    const box = await frame.boundingBox();
    expect(box).not.toBeNull();
    const y = box!.y + box!.height / 2;
    await frame.dispatchEvent("touchstart", {
      touches: [{ identifier: 1, clientX: box!.x + box!.width - 20, clientY: y }],
    });
    await frame.dispatchEvent("touchend", {
      changedTouches: [{ identifier: 1, clientX: box!.x + 20, clientY: y }],
    });
    await expect(mainImg).toHaveAttribute("alt", /view 2 of 3/);

    // Swipe back right (previous photo).
    await frame.dispatchEvent("touchstart", {
      touches: [{ identifier: 1, clientX: box!.x + 20, clientY: y }],
    });
    await frame.dispatchEvent("touchend", {
      changedTouches: [{ identifier: 1, clientX: box!.x + box!.width - 20, clientY: y }],
    });
    await expect(mainImg).toHaveAttribute("alt", /view 1 of 3/);
    await context.close();
  });
});
