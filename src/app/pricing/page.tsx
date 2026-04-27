import { PricingTable } from "@clerk/nextjs";

export default function PricingPage() {
  return (
    <div className="py-20 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-center">
        Simple, Transparent Pricing
      </h1>

      <PricingTable for="user" />
    </div>
  );
}
