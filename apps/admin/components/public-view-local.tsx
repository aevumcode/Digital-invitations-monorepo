"use client";

import { useEffect } from "react";
import { incrementPublicView } from "@/data-access/actions/public-view";

export default function PublicViewLocal({ publicSlug }: { publicSlug: string }) {
  useEffect(() => {
    const key = `viewed-${publicSlug}`;

    // ako je već pogledano, ne šaljemo ništa
    if (localStorage.getItem(key)) {
      return;
    }

    // označi kao pogledano
    localStorage.setItem(key, "1");

    // pozovi server action
    incrementPublicView(publicSlug);
  }, [publicSlug]);

  return null;
}
