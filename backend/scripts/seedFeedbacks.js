import prisma from '../prisma/prismaClient.js';

async function seed() {
    console.log('🌱 Seeding dummy feedbacks...');

    const dummyFeedbacks = [
        {
            title: "Mobile App Crash on Login",
            status: "open",
            form_structure: {
                title: "Bug Report",
                pages: [
                    {
                        name: "page1",
                        elements: [
                            { type: "text", name: "device", title: "Device Model" },
                            { type: "comment", name: "description", title: "Describe the crash" }
                        ]
                    }
                ]
            }
        },
        {
            title: "Feature Request: Dark Mode",
            status: "in progress",
            form_structure: {
                title: "Feature Request",
                pages: [
                    {
                        name: "page1",
                        elements: [
                            { type: "rating", name: "priority", title: "Priority Level" },
                            { type: "text", name: "feature", title: "Feature Name" }
                        ]
                    }
                ]
            }
        },
        {
            title: "Dashboard Loading Speed",
            status: "closed",
            form_structure: {
                title: "Performance Issue",
                pages: [
                    {
                        name: "page1",
                        elements: [
                            { type: "text", name: "load_time", title: "Approximate Load Time" },
                            { type: "text", name: "browser", title: "Browser Version" }
                        ]
                    }
                ]
            }
        }
    ];

    try {
        for (const fb of dummyFeedbacks) {
            await prisma.feedbacks.create({
                data: fb
            });
        }
        console.log('✅ Dummy feedbacks added successfully!');
    } catch (error) {
        console.error('❌ Error seeding feedbacks:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
