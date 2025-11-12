// types/_purchases.ts
import type { TemplateMetaFE } from "@/constants/template-data";

export type PurchaseLite = {
  id: string;
  templateId: number;
  customData?: Record<string, unknown> | null;
  publicSlug?: string | null;
  previewSlug?: string | null;
};

export type PurchaseWithResolvedTemplate = PurchaseLite & { template: TemplateMetaFE | null };
