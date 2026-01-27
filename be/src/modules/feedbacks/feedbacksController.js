import prisma from "../../../config/db/prismaClient.js";

// ======================
// CREATE FEEDBACK FORM
// ======================
export const createFeedback = async (req, res) => {
    try {
        const { projectId, title, description, formStructure, status } = req.body;
        const userId = req.user.userId;

        // Resolve Project ID
        let project = await prisma.project.findFirst({
            where: {
                OR: [
                    { id: projectId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i) ? projectId : undefined },
                    { slug: projectId }
                ]
            }
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const resolvedProjectId = project.id;

        // 1. Check if project exists and user is a member
        const projectMember = await prisma.project_member.findFirst({
            where: {
                project_id: resolvedProjectId,
                member_id: userId
            }
        });

        if (!projectMember && project.created_by !== userId) {
            return res.status(403).json({ message: "Access denied. You are not a member of this project." });
        }

        // 2. Create Feedback
        const feedback = await prisma.feedback.create({
            data: {
                title,
                description,
                form_structure: formStructure,
                status: status || 'created',
                project_id: resolvedProjectId,
            }
        });

        res.status(201).json({
            message: "Feedback form created successfully",
            feedback
        });

    } catch (error) {
        console.error("Create feedback error:", error);
        if (error.code === 'P2002') {
            return res.status(409).json({ message: "A feedback with this title already exists." });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};

// ======================
// GET PROJECT FEEDBACKS
// ======================
export const getProjectFeedbacks = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user.userId;

        // Resolve Project ID (Handle Slug vs UUID)
        let project = await prisma.project.findFirst({
            where: {
                OR: [
                    { id: projectId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i) ? projectId : undefined },
                    { slug: projectId }
                ]
            }
        });

        if (!project) return res.status(404).json({ message: "Project not found" });

        const resolvedProjectId = project.id;

        // Check membership
        const projectMember = await prisma.project_member.findFirst({
            where: { project_id: resolvedProjectId, member_id: userId }
        });

        if (!projectMember && project.created_by !== userId) {
            return res.status(403).json({ message: "Access denied" });
        }

        const feedbacks = await prisma.feedback.findMany({
            where: { project_id: resolvedProjectId },
            orderBy: { created_at: 'desc' },
            include: {
                _count: {
                    select: { feedback_response: true }
                }
            }
        });

        res.status(200).json({
            message: "Feedbacks fetched successfully",
            feedbacks
        });

    } catch (error) {
        console.error("Get project feedbacks error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ======================
// GET SINGLE FEEDBACK
// ======================
export const getFeedback = async (req, res) => {
    try {
        const { feedbackId } = req.params;
        const userId = req.user.userId;

        const feedback = await prisma.feedback.findUnique({
            where: { id: feedbackId },
            include: { project: true }
        });

        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        // Check project membership
        const projectMember = await prisma.project_member.findFirst({
            where: { project_id: feedback.project_id, member_id: userId }
        });
        if (!projectMember && feedback.project.created_by !== userId) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.status(200).json({
            message: "Feedback fetched successfully",
            feedback
        });

    } catch (error) {
        console.error("Get feedback error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ======================
// SUBMIT RESPONSE (Create or Update)
// ======================
export const submitResponse = async (req, res) => {
    try {
        const { feedbackId } = req.params;
        const { response } = req.body;
        const userId = req.user.userId;

        // Check availability and permissions
        const feedback = await prisma.feedback.findUnique({
            where: { id: feedbackId },
            include: { project: true }
        });

        if (!feedback) return res.status(404).json({ message: "Feedback not found" });

        // Check membership
        const projectMember = await prisma.project_member.findFirst({
            where: { project_id: feedback.project_id, member_id: userId }
        });
        if (!projectMember && feedback.project.created_by !== userId) {
            return res.status(403).json({ message: "Access denied" });
        }

        // Check if response already exists for this user and feedback
        const existingResponse = await prisma.feedback_response.findFirst({
            where: {
                feedback_id: feedbackId,
                respondent_id: userId
            }
        });

        let finalResponse;
        if (existingResponse) {
            // Update existing response
            finalResponse = await prisma.feedback_response.update({
                where: { id: existingResponse.id },
                data: {
                    response: response,
                    updated_at: new Date()
                }
            });
        } else {
            // Create new response
            finalResponse = await prisma.feedback_response.create({
                data: {
                    feedback_id: feedbackId,
                    response: response,
                    respondent_id: userId
                }
            });
        }

        res.status(existingResponse ? 200 : 201).json({
            message: existingResponse ? "Response updated successfully" : "Response submitted successfully",
            response: finalResponse
        });

    } catch (error) {
        console.error("Submit response error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ======================
// GET USER RESPONSE
// ======================
export const getUserResponse = async (req, res) => {
    try {
        const { feedbackId } = req.params;
        const userId = req.user.userId;

        const response = await prisma.feedback_response.findFirst({
            where: {
                feedback_id: feedbackId,
                respondent_id: userId
            }
        });

        res.status(200).json({
            message: "User response fetched",
            response
        });

    } catch (error) {
        console.error("Get user response error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ======================
// GET RESPONSES (Manager/Req Eng)
// ======================
export const getResponses = async (req, res) => {
    try {
        const { feedbackId } = req.params;

        const feedback = await prisma.feedback.findUnique({
            where: { id: feedbackId }
        });

        if (!feedback) return res.status(404).json({ message: "Feedback not found" });

        const responses = await prisma.feedback_response.findMany({
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

        res.status(200).json({
            message: "Responses fetched successfully",
            responses
        });

    } catch (error) {
        console.error("Get responses error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ======================
// UPDATE FEEDBACK
// ======================
export const updateFeedback = async (req, res) => {
    try {
        const { feedbackId } = req.params;
        const { formStructure, ...otherData } = req.body;

        const updatedFeedback = await prisma.feedback.update({
            where: { id: feedbackId },
            data: {
                ...otherData,
                form_structure: formStructure,
                updated_at: new Date()
            }
        });

        res.status(200).json({
            message: "Feedback updated successfully",
            feedback: updatedFeedback
        });

    } catch (error) {
        console.error("Update feedback error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ======================
// DELETE FEEDBACK
// ======================
export const deleteFeedback = async (req, res) => {
    try {
        const { feedbackId } = req.params;

        // Prisma relation with OnDelete: Cascade handles responses deletion if configured?
        // Our schema update had onDelete: Cascade for feedback_id relation! 
        // So deleting feedback deletes responses automatically.

        await prisma.feedback.delete({
            where: { id: feedbackId }
        });

        res.status(200).json({ message: "Feedback deleted successfully" });

    } catch (error) {
        console.error("Delete feedback error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ======================
// DELETE RESPONSE
// ======================
export const deleteResponse = async (req, res) => {
    try {
        const { responseId } = req.params;
        const userId = req.user.userId;
        const userRole = req.user.role;

        const response = await prisma.feedback_response.findUnique({
            where: { id: responseId }
        });

        if (!response) {
            return res.status(404).json({ message: "Response not found" });
        }

        // Allow delete if:
        // 1. Manager/ReqEngineer
        // 2. The respondent themselves
        const isManager = ["manager", "requirements_engineer"].includes(userRole);
        const isOwner = response.respondent_id === userId;

        if (!isManager && !isOwner) {
            return res.status(403).json({ message: "Access denied" });
        }

        await prisma.feedback_response.delete({
            where: { id: responseId }
        });

        res.status(200).json({ message: "Response deleted successfully" });

    } catch (error) {
        console.error("Delete response error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
