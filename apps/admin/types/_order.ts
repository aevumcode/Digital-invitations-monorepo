import type { User } from "./_user";
import type { InvitationTemplate } from "./_template";

export type OrderStatus = "PAID" | "FAILED" | "PENDING";

export interface Order {
  id: string;
  userId: string;
  templateId: string;
  status: OrderStatus;
  stripeId?: string | null;
  createdAt: string;

  // relations
  user?: User;
  template?: InvitationTemplate;
}
