"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LogOut, User, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/store/auth";
import { useCart } from "@/lib/store/cart";

const FIELD =
  "h-10 w-full rounded-lg border border-line-strong bg-bg2 px-3 text-sm text-ink-hi outline-none transition-colors placeholder:text-ink-low focus-visible:border-volt focus-visible:ring-3 focus-visible:ring-volt/50";

export function AccountMenu() {
  const user = useAuth((s) => s.user);
  const signIn = useAuth((s) => s.signIn);
  const signOut = useAuth((s) => s.signOut);
  const mergeGuestIntoAccount = useCart((s) => s.mergeGuestIntoAccount);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const doSignIn = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast("Enter your name to sign in");
      return;
    }
    const moved = Object.keys(useCart.getState().guest).length;
    signIn(trimmed);
    mergeGuestIntoAccount();
    setOpen(false);
    setName("");
    toast.success(
      moved > 0
        ? `Signed in as ${trimmed} — ${moved} product${moved === 1 ? "" : "s"} moved from your guest cart`
        : `Signed in as ${trimmed}`,
    );
  };

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden items-center gap-1.5 rounded-full border border-line-strong bg-bg1 px-2.5 py-1 font-mono text-[10.5px] font-medium text-ink-mid sm:flex">
          <User className="size-3 text-volt-text" />
          {user}
        </span>
        <button
          type="button"
          aria-label={`Sign out ${user}`}
          onClick={signOut}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-line-strong bg-bg1 text-ink-low transition-colors hover:border-bad/60 hover:text-bad"
        >
          <LogOut className="size-3" />
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm text-ink-mid transition-colors hover:text-ink-hi"
      >
        Sign in
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
              aria-hidden
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in-0 duration-200"
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Sign in"
              className="relative w-full max-w-sm rounded-xl border border-line bg-bg1 p-6 shadow-2xl animate-in fade-in-0 zoom-in-95 ease-out duration-200"
            >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-volt-text">
                  Account
                </p>
                <h2 className="mt-1 font-display text-xl font-bold tracking-tight text-ink-hi">
                  Sign in to Voltra
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close sign in"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-ink-low transition-colors hover:bg-bg2 hover:text-ink-hi"
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="mt-2 text-[13px] leading-5 text-ink-mid">
              Mock sign-in — no real accounts yet. Anything in your guest cart
              moves into this account when you sign in.
            </p>
            <label
              htmlFor="am-name"
              className="mb-1.5 mt-5 block font-mono text-[10px] uppercase tracking-[0.12em] text-ink-low"
            >
              Your name
            </label>
            <input
              id="am-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") doSignIn();
              }}
              placeholder="e.g. Chidi Okafor"
              className={FIELD}
            />
            <Button className="mt-4 w-full" onClick={doSignIn}>
              Sign in (demo)
            </Button>
          </div>
          </div>,
          document.body,
        )}
    </>
  );
}