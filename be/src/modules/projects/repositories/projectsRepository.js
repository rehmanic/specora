import prisma from "../../../config/db/prismaClient.js";

// ─── Project CRUD ─────────────────────────────────────────

export const PROJECT_INCLUDES = {
    project_member: {
        include: {
            app_user: {
                select: { id: true, username: true, display_name: true, profile_pic_url: true }
            }
        }
    },
    app_user: {
        select: { id: true, username: true, display_name: true, profile_pic_url: true }
    },
    _count: {
        select: { requirement: true, diagrams: true, docs: true, feedback: true, meetings: true }
    }
};

export async function findProjectsByUser(userId) {
    return await prisma.project.findMany({
        where: {
            OR: [
                { created_by: userId },
                { project_member: { some: { member_id: userId } } }
            ]
        },
        include: PROJECT_INCLUDES,
        orderBy: { updated_at: 'desc' }
    });
}

export async function createProjectTransaction(data) {
    const { name, slug, description, start_date, end_date, created_by, additionalMembers } = data;

    return await prisma.$transaction(async (tx) => {
        const project = await tx.project.create({
            data: {
                name: name.trim(),
                slug,
                description: description || null,
                start_date: start_date ? new Date(start_date) : null,
                end_date: end_date ? new Date(end_date) : null,
                created_by,
            },
        });

        const memberData = [{ project_id: project.id, member_id: created_by }];
        
        if (additionalMembers && additionalMembers.length > 0) {
            const users = await tx.app_user.findMany({
                where: { id: { in: additionalMembers } },
                select: { id: true }
            });
            const validUserIds = users.map(u => u.id).filter(id => id !== created_by);
            memberData.push(...validUserIds.map(id => ({ project_id: project.id, member_id: id })));
        }

        await tx.project_member.createMany({
            data: memberData,
            skipDuplicates: true,
        });

        return await tx.project.findUnique({
            where: { id: project.id },
            include: PROJECT_INCLUDES
        });
    });
}

export async function findProjectByIdOrSlug(identifier) {
    return await prisma.project.findFirst({
        where: {
            OR: [
                { id: identifier.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i) ? identifier : undefined },
                { slug: identifier }
            ]
        },
        include: PROJECT_INCLUDES
    });
}

export async function updateProjectRecord(projectId, data) {
    return await prisma.project.update({
        where: { id: projectId },
        data: { ...data, updated_at: new Date() },
        include: PROJECT_INCLUDES
    });
}

export async function deleteProjectRecord(projectId) {
    return await prisma.project.delete({
        where: { id: projectId }
    });
}

// ─── Memberships ──────────────────────────────────────────

export async function findProjectMember(projectId, userId) {
    return await prisma.project_member.findFirst({
        where: { project_id: projectId, member_id: userId }
    });
}

export async function updateProjectMembersTransaction(projectId, newMemberIds) {
    return await prisma.$transaction(async (tx) => {
        const project = await tx.project.findUnique({ where: { id: projectId } });
        if (!project) throw new Error("Project not found");

        const currentMembers = await tx.project_member.findMany({
            where: { project_id: projectId },
            select: { member_id: true }
        });
        const currentMemberIds = currentMembers.map(m => m.member_id);

        const idsToRemove = currentMemberIds.filter(id => id !== project.created_by && !newMemberIds.includes(id));
        if (idsToRemove.length > 0) {
            await tx.project_member.deleteMany({
                where: { project_id: projectId, member_id: { in: idsToRemove } }
            });
        }

        const idsToAdd = newMemberIds.filter(id => id !== project.created_by && !currentMemberIds.includes(id));
        if (idsToAdd.length > 0) {
            await tx.project_member.createMany({
                data: idsToAdd.map(id => ({ project_id: projectId, member_id: id })),
                skipDuplicates: true
            });
        }

        return await tx.project.findUnique({
            where: { id: projectId },
            include: PROJECT_INCLUDES
        });
    });
}

export async function deleteProjectMember(projectId, memberId) {
    return await prisma.project_member.deleteMany({
        where: { project_id: projectId, member_id: memberId }
    });
}

// ─── Settings / Validation ────────────────────────────────

export async function findProjectBySlug(slug) {
    return await prisma.project.findUnique({
        where: { slug }
    });
}

export async function findProjectByName(name) {
    return await prisma.project.findFirst({
        where: { name }
    });
}

export async function findAllProjects() {
    return await prisma.project.findMany({
        include: PROJECT_INCLUDES
    });
}

export async function findProjectById(id) {
    return await prisma.project.findUnique({
        where: { id }
    });
}

export async function updateProjectTransaction(projectId, projectData, members) {
    return await prisma.$transaction(async (tx) => {
        await tx.project.update({ where: { id: projectId }, data: projectData });

        if (members && Array.isArray(members)) {
            await tx.project_member.deleteMany({ where: { project_id: projectId } });
            if (members.length > 0) {
                await tx.project_member.createMany({
                    data: members.map((memberId) => ({ project_id: projectId, member_id: memberId })),
                });
            }
        }

        return tx.project.findUnique({
            where: { id: projectId },
            include: { project_member: true },
        });
    });
}

export async function findProjectMembers(projectId) {
    return await prisma.project_member.findMany({
        where: { project_id: projectId },
        include: {
            app_user: {
                select: { id: true, display_name: true, username: true, email: true, profile_pic_url: true },
            },
        },
    });
}

export async function addProjectMember(projectId, memberId) {
    return await prisma.project_member.create({
        data: { project_id: projectId, member_id: memberId },
    });
}

export async function addTag(projectId, tag) {
    const updated = await prisma.project.update({
        where: { id: projectId },
        data: { tags: { push: tag } },
        select: { tags: true },
    });
    return updated.tags;
}

export async function removeTagTransaction(projectId, newTags) {
    const updated = await prisma.project.update({
        where: { id: projectId },
        data: { tags: { set: newTags } },
        select: { tags: true },
    });
    return updated.tags;
}
