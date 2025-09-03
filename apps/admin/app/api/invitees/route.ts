import { NextResponse } from "next/server";
import { prisma } from "@digital-inv/db";
import { v4 as uuidv4 } from "uuid";
import { Gender, Prisma, RsvpStatus } from "@prisma/client";

// Create new invitee
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { projectId, firstName, lastName, email, phone, tag } = body;

    if (!projectId || !firstName || !lastName) {
      return NextResponse.json(
        { error: "projectId, firstName, and lastName are required" },
        { status: 400 },
      );
    }

    // generate random token for invitee
    const token = uuidv4();
    const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${token}`;

    const invitee = await prisma.invitee.create({
      data: {
        projectId,
        firstName,
        lastName,
        email,
        phone,
        tag,
        token,
        invitationUrl,
      },
    });

    return NextResponse.json(invitee, { status: 201 });
  } catch (error) {
    console.error("Error creating invitee:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET ALL invitee

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const projectId = searchParams.get("projectId");
  const q = (searchParams.get("q") || "").trim();

  // normalize to uppercase so `accepted` works too
  const rawStatus = searchParams.get("status")?.toUpperCase() ?? "";
  const rawGender = searchParams.get("gender")?.toUpperCase() ?? "";

  // validate against the Prisma enums
  const status = (Object.values(RsvpStatus) as string[]).includes(rawStatus)
    ? (rawStatus as RsvpStatus)
    : undefined;

  const gender = (Object.values(Gender) as string[]).includes(rawGender)
    ? (rawGender as Gender)
    : undefined;

  // pagination
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const pageSize = Math.max(1, Math.min(100, Number(searchParams.get("pageSize") || 10)));
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  if (!projectId) {
    return NextResponse.json({ error: "projectId is required" }, { status: 400 });
  }

  const where: Prisma.InviteeWhereInput = { projectId };

  if (q) {
    where.OR = [
      { firstName: { contains: q, mode: "insensitive" } },
      { lastName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { phone: { contains: q, mode: "insensitive" } },
      { tag: { contains: q, mode: "insensitive" } },
    ];
  }

  if (status) where.rsvpStatus = status;
  if (gender) where.gender = gender;

  const [items, total] = await Promise.all([
    prisma.invitee.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
    }),
    prisma.invitee.count({ where }),
  ]);

  return NextResponse.json({
    items,
    total,
    page,
    pageSize,
    pageCount: Math.ceil(total / pageSize),
  });
}
