"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  className?: string;
  title?: string;
  subtitle?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export function EmptyPurchases({
  className,
  title = "Još nemate kupljene predloške",
  subtitle = "Posjetite trgovinu i odaberite svoj prvi predložak.",
  ctaHref = "/storefront",
  ctaLabel = "Kupi predložak",
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center gap-4 py-16 px-6 rounded-lg border bg-card",
        className,
      )}
    >
      <div className="inline-flex items-center justify-center h-14 w-14 rounded-full border">
        <ShoppingBag className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <Button asChild className="mt-2">
        <Link href={ctaHref}>{ctaLabel}</Link>
      </Button>
    </div>
  );
}
