import type { InvitationProject } from "./_project";
import type { Order } from "./_order";

export type UserRole = "ADMIN" | "CUSTOMER";

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string | null;

  // relations
  projects?: InvitationProject;
  orders?: Order[];
}
