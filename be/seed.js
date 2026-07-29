import { PrismaClient } from './prisma/generated/client/index.js';
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

    // 1.5 Create Permissions
    const frontendPermissions = [
      "add_project_member",
      "add_project_tag",
      "add_user",
      "comment_on_requirements",
      "create_feedback_form",
      "create_meeting",
      "create_project",
      "create_requirement",
      "create_specbot_chat",
      "delete_feedback_form",
      "delete_meeting",
      "delete_project",
      "delete_requirement",
      "download_specbot_chat_messages",
      "export_requirement",
      "extract_requirements_from_meeting",
      "extract_requirements_from_specbot_chat",
      "generate_meeting_transcript",
      "import_requirement",
      "join_meeting",
      "manage_requirement_dependencies",
      "project_settings",
      "record_meeting",
      "remove_project_member",
      "remove_project_tag",
      "send_specbot_chat_message",
      "submit_feedback_response",
      "summarize_specbot_chat",
      "update_feedback_form",
      "update_meeting",
      "update_project",
      "update_requirement",
      "update_user",
      "view_chat",
      "view_diagrams",
      "view_docs",
      "view_documents",
      "view_feasibility_studies",
      "view_feedback_form_responses",
      "view_feedback_forms",
      "view_group_chat_messages",
      "view_meeting_details",
      "view_meeting_recording",
      "view_meetings",
      "view_own_feedback_response",
      "view_project_members",
      "view_project_tags",
      "view_prototypes",
      "view_requirement_comments",
      "view_requirement_graph",
      "view_requirement_history",
      "view_requirements",
      "view_roles",
      "view_specbot_chat",
      "view_technical_feasibility",
      "view_users",
      "view_verification_results",
      "view_specbot_chat_messages",
      "create_prototype",
      "create_diagram",
      "create_document"
    ];

    const dbPermissions = {};
    for (const permName of frontendPermissions) {
        // convert snake_case to Title Case
        const label = permName.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const p = await prisma.permission.upsert({
            where: { name: permName },
            update: { label: label, description: `Permission for ${label}`, module: 'general' },
            create: { name: permName, label: label, description: `Permission for ${label}`, module: 'general' }
        });
        dbPermissions[p.name] = p.id;
    }
    console.log(`Ensured ${frontendPermissions.length} permissions`);

    // Assign them all to manager
    const managerRoleId = roles['manager'];
    for (const permName of Object.keys(dbPermissions)) {
        const permId = dbPermissions[permName];
        const existingRp = await prisma.role_permission.findFirst({
            where: { role_id: managerRoleId, permission_id: permId }
        });
        if (!existingRp) {
            await prisma.role_permission.create({
                data: { role_id: managerRoleId, permission_id: permId }
            });
        }
    }
    console.log("Assigned all permissions to manager role");

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
