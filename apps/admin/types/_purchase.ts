import { TemplateForUI } from "@/components/template-card";

export type PurchaseForGrid = {
  id: string;
  template: TemplateForUI;
  customData?: Record<string, unknown> | null;
};

export type PurchaseUI = PurchaseForGrid & {
  publicSlug?: string | null;
  previewSlug?: string | null;
  // add other keys if you’ll use them later:
  userTemplateKey?: string | null;
  isActive?: boolean | null;
  numberOfGuests?: number | null;
};
