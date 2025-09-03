type Invitee = {
  id: string;
  projectId: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  email?: string | null;
  tag?: string | null;
  token: string;
  rsvpStatus: "PENDING" | "ACCEPTED" | "DECLINED";
  invitationUrl: string;
  createdAt?: string;
};

type CreateInviteeDto = Pick<
  Invitee,
  "projectId" | "firstName" | "lastName" | "phone" | "email" | "tag"
>;
type UpdateInviteeDto = Partial<
  Pick<
    Invitee,
    "firstName" | "lastName" | "phone" | "email" | "tag" | "rsvpStatus"
  >
>;

// core enums
export type RSVP = "ACCEPTED" | "DECLINED" | "PENDING";
export type Gender = "MALE" | "FEMALE" | "OTHER";

// filter enums (extend with sentinel "ANY")
export type RSVPFilter = RSVP | "ANY";
export type GenderFilter = Gender | "ANY";

export type { Invitee, CreateInviteeDto, UpdateInviteeDto };
