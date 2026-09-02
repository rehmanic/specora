import prisma from "../../../config/db/prismaClient.js";

// ─── Helpers ──────────────────────────────────────────────

export async function findProjectByIdOrSlug(identifier) {
    return await prisma.project.findFirst({
        where: {
            OR: [
                { id: identifier.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i) ? identifier : undefined },
                { slug: identifier }
            ]
        }
    });
}

export async function findProjectMember(projectId, memberId) {
    return await prisma.project_member.findFirst({
        where: { project_id: projectId, member_id: memberId }
    });
}

// ─── Feedbacks ────────────────────────────────────────────

export async function createFeedbackRecord(data) {
    return await prisma.feedback.create({ data });
}

export async function findFeedbacksByProject(projectId) {
    return await prisma.feedback.findMany({
        where: { project_id: projectId },
        orderBy: { created_at: 'desc' },
        include: { _count: { select: { feedback_response: true } } }
    });
}

export async function findFeedbackById(feedbackId) {
    return await prisma.feedback.findUnique({
        where: { id: feedbackId },
        include: { project: true }
    });
}

export async function updateFeedbackRecord(feedbackId, data) {
    return await prisma.feedback.update({
        where: { id: feedbackId },
        data
    });
}

export async function deleteFeedbackRecord(feedbackId) {
    return await prisma.feedback.delete({ where: { id: feedbackId } });
}

// ─── Feedback Responses ───────────────────────────────────

export async function findFeedbackResponse(feedbackId, respondentId) {
    return await prisma.feedback_response.findFirst({
        where: { feedback_id: feedbackId, respondent_id: respondentId }
    });
}

export async function updateFeedbackResponse(responseId, responseData) {
    return await prisma.feedback_response.update({
        where: { id: responseId },
        data: { response: responseData, updated_at: new Date() }
    });
}

export async function createFeedbackResponse(data) {
    return await prisma.feedback_response.create({ data });
}

export async function findResponsesByFeedback(feedbackId) {
    return await prisma.feedback_response.findMany({
        where: { feedback_id: feedbackId },
        orderBy: { created_at: 'desc' },
        include: {
            app_user: {
                select: {
                    id: true,
                    username: true,
                    display_name: true,
                    role: { select: { name: true } }
                }
            }
        }
    });
}

export async function findResponseById(responseId) {
    return await prisma.feedback_response.findUnique({
        where: { id: responseId }
    });
}

export async function deleteResponseRecord(responseId) {
    return await prisma.feedback_response.delete({
        where: { id: responseId }
    });
}
