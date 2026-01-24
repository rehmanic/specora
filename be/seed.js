import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // 1. Create Roles
    const rolesData = [
        { name: 'manager' },
        { name: 'client' },
        { name: 'requirements_engineer' },
    ];

    const roles = {};

    for (const roleData of rolesData) {
        const role = await prisma.role.upsert({
            where: { name: roleData.name },
            update: {},
            create: roleData,
        });
        roles[role.name] = role.id;
        console.log(`Role ensured: ${role.name}`);
    }

    // 2. Create Users
    const usersData = [
        {
            username: 'abdurrehman',
            email: 'abdurrehman@gmail.com',
            password: '#abdurrehman123',
            role: 'manager',
        },
        {
            username: 'ayeshanaveed',
            email: 'ayeshanaveed@gmail.com',
            password: '#ayeshanaveed123',
            role: 'client',
        },
        {
            username: 'bilalraza',
            email: 'bilalraza@gmail.com',
            password: '#bilalraza123',
            role: 'requirements_engineer',
        },
    ];

    const createdUsers = [];

    for (const userData of usersData) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(userData.password, salt);

        const user = await prisma.app_user.upsert({
            where: { email: userData.email },
            update: {
                username: userData.username,
                password_hash: passwordHash,
                role_id: roles[userData.role], // Link to role ID
            },
            create: {
                username: userData.username,
                email: userData.email,
                password_hash: passwordHash,
                role_id: roles[userData.role],
            },
        });
        createdUsers.push(user);
        console.log(`User ensured: ${user.username}`);
    }

    // 3. Create Project
    const project = await prisma.project.upsert({
        where: { name: 'FYP' },
        update: {},
        create: {
            name: 'FYP',
            slug: 'fyp',
            status: 'active',
            start_date: new Date(),
            end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year from now
            created_by: createdUsers.find(u => u.username === 'abdurrehman')?.id, // Assign creator if found
        },
    });
    console.log(`Project ensured: ${project.name}`);

    // 4. Add Users to Project
    for (const user of createdUsers) {
        // Check if member exists to avoid duplicates (though strict composite key usually checking is safer)
        // Since project_member has a generated ID, we can't easily upsert based on unique constraint unless there is one.
        // We will check first.
        const existingMember = await prisma.project_member.findFirst({
            where: {
                project_id: project.id,
                member_id: user.id
            }
        });

        if (!existingMember) {
            await prisma.project_member.create({
                data: {
                    project_id: project.id,
                    member_id: user.id
                }
            });
            console.log(`Added ${user.username} to project ${project.name}`);
        } else {
            console.log(`${user.username} is already a member of ${project.name}`);
        }
    }

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
