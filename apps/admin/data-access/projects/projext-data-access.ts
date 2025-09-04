"server-only";
import { prisma } from "@digital-inv/db";

export async function getProjectByUserId(userId: string) {
  try {
    const project = await prisma.invitationProject.findFirst({
      where: { userId },
    });

    if (!project) {
      return null;
    }

    return project;
  } catch (error) {
    console.error("Error fetching project by userId:", error);
    throw new Error("Database error");
  }
}
