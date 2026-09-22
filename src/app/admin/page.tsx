/**
 * /admin — catalog editor (stock, price, wholesale) backed by the production
 * Supabase DB via PATCH /api/admin/products. Gated by an admin key stored in
 * sessionStorage — no auth system exists yet, so this is the minimal gate.
 */
"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AdminProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  wholesale: number;
  stock: number;
};

type Editable = {
  price: string;
  wholesale: string;
  stock: string;
};

const KEY_STORAGE = "voltra-admin-key";

function toEditable(p: AdminProduct): Editable {
  return {
    price: String(p.price),
    wholesale: String(p.wholesale),
    stock: String(p.stock),
  };
}

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [keyReady, setKeyReady] = useState(false);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [edits, setEdits] = useState<Record<string, Editable>>({});
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // sessionStorage exists only client-side; hydrate after mount (via rAF so the
  // setState isn't synchronous within the effect) to avoid SSR/hydration drift.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const saved = sessionStorage.getItem(KEY_STORAGE);
      if (saved) setAdminKey(saved);
      setKeyReady(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const authedFetch = useCallback(
    (init?: RequestInit) =>
      fetch("/api/admin/products", {
        ...init,
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey, ...init?.headers },
      }),
    [adminKey],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await authedFetch({ method: "POST", body: JSON.stringify({ op: "list" }) });
      const data = (await res.json()) as { products?: AdminProduct[]; error?: string };
      if (!res.ok) {
        setMessage(data.error ?? "Failed to load catalog");
        setProducts([]);
        return;
      }
      setProducts(data.products ?? []);
      setEdits(Object.fromEntries((data.products ?? []).map((p) => [p.id, toEditable(p)])));
      sessionStorage.setItem(KEY_STORAGE, adminKey);
    } finally {
      setLoading(false);
    }
  }, [authedFetch, adminKey]);

  const save = async (id: string) => {
    const e = edits[id];
    const current = products.find((p) => p.id === id);
    if (!e || !current) return;

    const payload: Record<string, number | string> = { id };
    if (e.price !== String(current.price)) payload.price = Number(e.price);
    if (e.wholesale !== String(current.wholesale)) payload.wholesale = Number(e.wholesale);
    if (e.stock !== String(current.stock)) payload.stock = Number(e.stock);

    if (Object.keys(payload).length === 1) {
      setMessage("No changes to save.");
      return;
    }

    setSavingId(id);
    setMessage(null);
    try {
      const res = await authedFetch({ method: "PATCH", body: JSON.stringify(payload) });
      const data = (await res.json()) as { product?: AdminProduct; error?: string };
      if (!res.ok || !data.product) {
        setMessage(data.error ?? "Save failed");
        return;
      }
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data.product! } : p)));
      setEdits((prev) => ({ ...prev, [id]: toEditable({ ...current, ...data.product! }) }));
      setMessage(`Saved ${current.name}.`);
    } finally {
      setSavingId(null);
    }
  };

  if (!keyReady) return null;

  const unlocked = products.length > 0;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Catalog admin</h1>
      <p className="mt-1 text-sm text-[var(--ink-mid)]">
        Edit stock and prices in the production database. Changes go live immediately.
      </p>

      {!unlocked && (
        <div className="mt-8 flex max-w-sm items-center gap-2">
          <Input
            type="password"
            placeholder="Admin key"
            value={adminKey}
            onChange={(ev) => setAdminKey(ev.target.value)}
            onKeyDown={(ev) => ev.key === "Enter" && void load()}
          />
          <Button onClick={() => void load()} disabled={loading || adminKey.length === 0}>
            {loading ? "Checking…" : "Unlock"}
          </Button>
        </div>
      )}

      {message && (
        <p className={`mt-4 text-sm ${unlocked ? "text-[var(--ink-mid)]" : "text-[var(--bad)]"}`}>
          {message}
        </p>
      )}

      {unlocked && (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--line)] text-left text-xs uppercase tracking-wide text-[var(--ink-low)]">
                <th className="py-2 pr-4 font-medium">Product</th>
                <th className="py-2 pr-4 font-medium">Price (₦)</th>
                <th className="py-2 pr-4 font-medium">Wholesale (₦)</th>
                <th className="py-2 pr-4 font-medium">Stock</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const e = edits[p.id] ?? toEditable(p);
                const dirty =
                  e.price !== String(p.price) ||
                  e.wholesale !== String(p.wholesale) ||
                  e.stock !== String(p.stock);
                return (
                  <tr key={p.id} className="border-b border-[var(--line)] align-middle">
                    <td className="py-3 pr-4">
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-[var(--ink-low)]">{p.category}</div>
                    </td>
                    {(["price", "wholesale", "stock"] as const).map((field) => (
                      <td key={field} className="py-3 pr-4">
                        <Input
                          className="w-24 font-mono"
                          inputMode="numeric"
                          value={e[field]}
                          onChange={(ev) =>
                            setEdits((prev) => ({
                              ...prev,
                              [p.id]: { ...prev[p.id], [field]: ev.target.value },
                            }))
                          }
                        />
                      </td>
                    ))}
                    <td className="py-3">
                      <Button
                        size="sm"
                        disabled={!dirty || savingId === p.id}
                        onClick={() => void save(p.id)}
                      >
                        {savingId === p.id ? "Saving…" : "Save"}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="mt-4 text-xs text-[var(--ink-low)]">
            Every save hits Supabase directly — the storefront reads the new values on its next
            request. No deploy needed.
          </p>
        </div>
      )}
    </main>
  );
}
