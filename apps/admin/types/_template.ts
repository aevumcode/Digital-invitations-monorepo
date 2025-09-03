import type { InvitationProject } from "./_project";
import type { Order } from "./_order";

export interface InvitationTemplate {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  isActive: boolean;
  schemaJson: Record<string, unknown>; // replace 'any' with 'unknown' for stricter type checking
  previewUrl: string;
  createdAt?: string;
  updatedAt?: string;

  // relations
  projects?: InvitationProject[];
  orders?: Order[];
}
