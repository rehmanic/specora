import prisma from "../../../config/db/prismaClient.js";

async function resolveProjectId(projectId) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId);
    if (isUuid) return projectId;

    const project = await prisma.project.findFirst({
        where: { slug: projectId },
        select: { id: true },
    });
    return project?.id ?? null;
}

// CREATE
export const createDoc = async (req, res, next) => {
    try {
        const resolvedId = await resolveProjectId(req.params.projectId);
        if (!resolvedId) {
            return res.status(404).json({ status: "error", message: "Project not found" });
        }

        const { title, content, type } = req.body;

        const doc = await prisma.doc.create({
            data: {
                project_id: resolvedId,
                title,
                content: content || "",
                type: type || "general",
            },
        });

        res.status(201).json({
            status: "success",
            doc,
        });
    } catch (err) {
        next(err);
    }
};

// READ ALL
export const getDocs = async (req, res, next) => {
    try {
        const resolvedId = await resolveProjectId(req.params.projectId);
        if (!resolvedId) {
            return res.status(404).json({ status: "error", message: "Project not found" });
        }

        const docs = await prisma.doc.findMany({
            where: { project_id: resolvedId },
            orderBy: { updated_at: "desc" },
        });

        res.status(200).json({
            status: "success",
            results: docs.length,
            docs,
        });
    } catch (err) {
        next(err);
    }
};

// READ ONE
export const getDocById = async (req, res, next) => {
    try {
        const resolvedId = await resolveProjectId(req.params.projectId);
        if (!resolvedId) {
            return res.status(404).json({ status: "error", message: "Project not found" });
        }

        const { id } = req.params;

        const doc = await prisma.doc.findFirst({
            where: {
                id: id,
                project_id: resolvedId,
            },
        });

        if (!doc) {
            return res.status(404).json({ status: "error", message: "Doc not found" });
        }

        res.status(200).json({
            status: "success",
            doc,
        });
    } catch (err) {
        next(err);
    }
};

// UPDATE
export const updateDoc = async (req, res, next) => {
    try {
        const resolvedId = await resolveProjectId(req.params.projectId);
        if (!resolvedId) {
            return res.status(404).json({ status: "error", message: "Project not found" });
        }

        const { id } = req.params;
        const { title, content, type } = req.body;

        const doc = await prisma.doc.findFirst({
            where: { id: id, project_id: resolvedId },
        });
        if (!doc) {
            return res.status(404).json({ status: "error", message: "Doc not found" });
        }

        const updatedDoc = await prisma.doc.update({
            where: { id: id },
            data: { title, content, type, updated_at: new Date() },
        });

        res.status(200).json({
            status: "success",
            doc: updatedDoc,
        });
    } catch (err) {
        next(err);
    }
};

// DELETE
export const deleteDoc = async (req, res, next) => {
    try {
        const resolvedId = await resolveProjectId(req.params.projectId);
        if (!resolvedId) {
            return res.status(404).json({ status: "error", message: "Project not found" });
        }

        const { id } = req.params;

        const doc = await prisma.doc.findFirst({
            where: { id: id, project_id: resolvedId },
        });
        if (!doc) {
            return res.status(404).json({ status: "error", message: "Doc not found" });
        }

        await prisma.doc.delete({
            where: { id: id },
        });

        res.status(204).json({
            status: "success",
            data: null,
        });
    } catch (err) {
        next(err);
    }
};
