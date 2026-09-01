import prisma from "../../config/db/prismaClient.js";

/**
 * UUID v4 pattern used to distinguish UUIDs from slugs.
 */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Resolve a project identifier that may be either a UUID or a slug.
 *
 * @param {string} projectId  UUID or slug string.
 * @returns {Promise<string|null>}  The project UUID, or null if not found.
 */
export async function resolveProjectId(projectId) {
  if (UUID_RE.test(projectId)) return projectId;

  const project = await prisma.project.findFirst({
    where: { slug: projectId },
    select: { id: true },
  });
  return project?.id ?? null;
}
