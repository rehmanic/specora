import prisma from "../../../config/db/prismaClient.js";

export const createSpecbotChat = async (req, res) => {
    try {
        const { title, user_id, project_id } = req.body;

        // Check if project exists
        const project = await prisma.projects.findUnique({
            where: { id: project_id },
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Check if user exists
        const user = await prisma.users.findUnique({
            where: { id: user_id },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create Specbot Chat
        const newChat = await prisma.specbot_chats.create({
            data: {
                title,
                user_id,
                project_id,
            },
        });

        res.status(201).json({
            message: "Specbot Chat created successfully",
            chat: newChat,
        });
    } catch (error) {
        console.error("Error creating Specbot Chat:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
