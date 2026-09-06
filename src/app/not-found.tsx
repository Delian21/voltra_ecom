import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/LogoMark";

export default function NotFound() {
  return (
    <section className="mx-auto flex w-full max-w-[1180px] flex-col items-center px-5 py-28 text-center md:py-36">
      <LogoMark size={44} aria-hidden />
      <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-volt-text">
        Error 404 · dead end
      </p>
      <h1 className="mt-3 max-w-xl font-display text-4xl font-bold tracking-tight text-ink-hi md:text-5xl">
        That page is out of stock.
      </h1>
      <p className="mt-4 max-w-md text-sm leading-6 text-ink-mid">
        The page you&apos;re looking for doesn&apos;t exist — or it ran out
        before you got here. Either way, the catalog is still live.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/shop">Browse the catalog</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </section>
  );
}
