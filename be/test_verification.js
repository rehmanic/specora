import prisma from './config/db/prismaClient.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
    console.log("Starting verification module tests...");

    // 1. Get a user to sign the token for
    const user = await prisma.app_user.findFirst();
    if (!user) {
        console.error("❌ No users found in database to generate an auth token!");
        process.exit(1);
    }

    // Use container's actual env secret to sign the token
    const secret = process.env.JWT_SECRET || "your_jwt_secret";

    const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        secret,
        { expiresIn: "1h" }
    );
    console.log(`✅ Generated test token for user ${user.email} using example secret`);

    // 2. Find a project with requirements
    const requirement = await prisma.requirement.findFirst({
        include: { project: true }
    });

    if (!requirement) {
        console.error("❌ No requirements found in the database!");
        process.exit(1);
    }

    const projectId = requirement.project_id;
    console.log(`✅ Found project ${projectId} with requirements.`);

    // 3. Test Specora ARM endpoint
    console.log("\n--- Testing Specora ARM Verification ---");
    try {
        const armRes = await fetch(`http://localhost:5000/api/verification/arm/${projectId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const armData = await armRes.json();
        console.log(`Status Code: ${armRes.status}`);

        if (armRes.ok) {
            console.log(`✅ ARM Metrics Summary:`, armData.metrics);
            if (armData.results && armData.results.length > 0) {
                console.log(`✅ Sample ARM Analysis (Req ${armData.results[0].requirement_id}):`, armData.results[0].analysis);
            }
        } else {
            console.error(`❌ ARM Request Failed:`, armData);
        }
    } catch (e) {
        console.error("❌ ARM Test Exception:", e);
    }

    // 4. Test AI endpoint
    console.log("\n--- Testing IEEE AI Verification ---");
    try {
        const aiRes = await fetch(`http://localhost:5000/api/verification/ai/${projectId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const aiData = await aiRes.json();
        console.log(`Status Code: ${aiRes.status}`);

        if (aiRes.ok) {
            if (aiData.results && aiData.results.length > 0) {
                console.log(`✅ Sample AI Result (Req ${aiData.results[0].requirement_id}):`);
                const analysis = aiData.results[0].analysis;
                console.log(analysis);
            } else {
                console.log("⚠️ No AI results structured output returned.");
            }
            console.log("✅ AI Verification successful.");
        } else {
            console.error(`❌ AI Request Failed:`, aiData);
        }
    } catch (e) {
        console.error("❌ AI Test Exception:", e);
    }

    process.exit(0);
}

run();
