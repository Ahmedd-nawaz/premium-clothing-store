import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <div className="max-w-2xl space-y-6">
        <h1 className="font-display text-5xl font-semibold tracking-tight sm:text-6xl text-primary">
          AURA & CO.
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Modern luxury apparel designed with precision, simplicity, and elegance. Experience timeless fashion built with superior craftsmanship.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Button size="lg" className="rounded-full px-8">
            Explore Collection
          </Button>
          <Button variant="outline" size="lg" className="rounded-full px-8">
            Brand Story
          </Button>
        </div>
      </div>
    </main>
  );
}