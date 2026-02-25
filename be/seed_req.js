import { PrismaClient } from './prisma/generated/client/index.js';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding requirements...');

    // 1. Fetch the FYP project
    const project = await prisma.project.findFirst({
        where: { name: 'FYP' }
    });

    if (!project) {
        console.error("Project 'FYP' not found. Please run seed.js first.");
        return;
    }

    console.log(`Found project: ${project.name} (${project.id})`);

    // 2. Define Sample Requirements
    const requirementsData = [
        {
            title: "User Authentication",
            description: "The system MUST allow users to log in securely using OAuth 2.0 with their enterprise credentials.",
            priority: "high",
            status: "pending"
        },
        {
            title: "Data Encryption",
            description: "All sensitive user data MUST be encrypted at rest using AES-256 standard.",
            priority: "high",
            status: "approved"
        },
        {
            title: "Data Export",
            description: "Users SHOULD be able to export their health records in CSV and PDF formats.",
            priority: "mid",
            status: "pending"
        },
        {
            title: "Cookie Consent",
            description: "The web application MUST display a cookie consent banner that complies with EU GDPR requirements before setting any non-essential cookies.",
            priority: "high",
            status: "pending"
        },
        {
            title: "Age Verification",
            description: "The system MUST verify that the user is at least 18 years old before allowing access to premium adult content.",
            priority: "high",
            status: "rejected"
        }
    ];

    // 3. Insert or Update Requirements
    let count = 0;
    for (const reqData of requirementsData) {
        // We use title as a unique constraint for the upsert logic if needed, 
        // but since requirement table might not have a unique title constraint,
        // we will check if it exists first.
        const existingReq = await prisma.requirement.findFirst({
            where: {
                title: reqData.title,
                project_id: project.id
            }
        });

        if (!existingReq) {
            await prisma.requirement.create({
                data: {
                    title: reqData.title,
                    description: reqData.description,
                    priority: reqData.priority,
                    status: reqData.status,
                    project_id: project.id
                }
            });
            console.log(`Created Requirement: ${reqData.title}`);
            count++;
        } else {
            console.log(`Requirement already exists: ${reqData.title}`);
        }
    }

    console.log(`Successfully seeded ${count} new requirements.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
