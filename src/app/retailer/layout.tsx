import { RetailerGate } from "@/components/retailer/RetailerGate";
import { RetailerNav } from "@/components/retailer/RetailerNav";

export default function RetailerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-[1180px] px-5 py-10">
      <RetailerGate>
        <RetailerNav />
        <div className="mt-8">{children}</div>
      </RetailerGate>
    </div>
  );
}