import type { Invitee } from "./_invitee";
import type { InvitationTemplate } from "./_template";

export type ProjectStatus = "DRAFT" | "READY" | "SENT";

export interface InvitationProject {
  id: string;
  userId: string;
  templateId: string;
  title: string;
  configJson: Record<string, unknown>; // or make this stricter if you know schema shape
  status: ProjectStatus;
  createdAt?: string;
  updatedAt?: string;

  // relations
  template?: InvitationTemplate;
  guests?: Invitee[];
}
