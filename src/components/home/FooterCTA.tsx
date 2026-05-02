import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FooterCTA() {
  return (
    <footer className="w-full py-24 border-t border-border/40 text-center">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
          Ready to{" "}
          <span className="text-primary italic underline decoration-accent/50 underline-offset-8">
            test
          </span>{" "}
          your edge?
        </h2>
        <Button
          size="lg"
          nativeButton={false}
          render={<Link href="/trade" />}
          className="h-20 px-16 rounded-full text-2xl font-black bg-foreground text-background hover:scale-105 transition-transform"
        >
          Enter Simulation
        </Button>
      </div>
    </footer>
  );
}
