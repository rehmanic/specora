/**
 * Vitest Global Test Setup
 * Mocks external dependencies: Prisma, bcrypt, jwt, Gemini API
 */

import { vi } from 'vitest';

// Mock environment variables
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_EXPIRES_IN = '1h';
process.env.GEMINI_API_KEY = 'test-gemini-api-key';

// Mock Prisma client
vi.mock('../config/db/prismaClient.js', () => {
    const createCrud = () => ({
        create: vi.fn(),
        createMany: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        deleteMany: vi.fn(),
        count: vi.fn(),
        updateMany: vi.fn(),
        upsert: vi.fn(),
        aggregate: vi.fn(),
    });

    const appUser = createCrud();
    const project = createCrud();
    const specbotChat = createCrud();
    const specbotMessage = createCrud();
    const groupChat = createCrud();
    const groupMessage = createCrud();
    const projectMember = createCrud();

    const prismaMock = {
        // Current Prisma model names
        app_user: appUser,
        project,
        specbot_chat: specbotChat,
        specbot_message: specbotMessage,
        group_chat: groupChat,
        group_message: groupMessage,
        project_member: projectMember,
        role: createCrud(),
        permission: createCrud(),
        role_permission: createCrud(),
        doc: createCrud(),
        requirement: createCrud(),
        doc_requirement: createCrud(),
        requirement_history: createCrud(),
        requirement_comment: createCrud(),
        traceability_link: createCrud(),
        diagram: createCrud(),
        diagram_requirement: createCrud(),
        economic_config: createCrud(),
        economic_estimate: createCrud(),
        feedback: createCrud(),
        feedback_response: createCrud(),
        prototype: createCrud(),
        prototype_screen: createCrud(),
        screen_requirement: createCrud(),
        meeting: createCrud(),
        meeting_attendee: createCrud(),
        meeting_transcript: createCrud(),

        // Backward-compatible aliases for older tests
        users: appUser,
        projects: project,
        specbot_chats: specbotChat,
        messages: specbotMessage,
        group_chats: groupChat,
    };

    prismaMock.$transaction = vi.fn(async (arg) => {
        if (typeof arg === 'function') {
            return arg(prismaMock);
        }
        return arg;
    });

    return {
        default: prismaMock,
    };
});

// Mock bcrypt
vi.mock('bcrypt', () => ({
    default: {
        hash: vi.fn().mockResolvedValue('hashed_password'),
        compare: vi.fn().mockResolvedValue(true),
    },
}));

// Mock jsonwebtoken
vi.mock('jsonwebtoken', () => ({
    default: {
        sign: vi.fn().mockReturnValue('mock-jwt-token'),
        verify: vi.fn((token, secret, callback) => {
            if (token === 'valid-token') {
                callback(null, { userId: 'user-123', username: 'testuser', role: 'manager' });
            } else if (token === 'expired-token') {
                callback(new Error('Token expired'), null);
            } else {
                callback(new Error('Invalid token'), null);
            }
        }),
    },
}));

// Mock Gemini utilities
vi.mock('../src/utils/gemini.js', () => ({
    generateGeminiResponse: vi.fn().mockResolvedValue('AI response'),
    generateStatelessResponse: vi.fn().mockResolvedValue('Stateless AI response'),
    clearChatSession: vi.fn().mockReturnValue(true),
    clearAllChatSessions: vi.fn(),
}));

// Mock fs module for specbot controller
vi.mock('fs', () => ({
    default: {
        existsSync: vi.fn().mockReturnValue(true),
        mkdirSync: vi.fn(),
        writeFileSync: vi.fn(),
        readFileSync: vi.fn().mockReturnValue('{}'),
        unlinkSync: vi.fn(),
        rmSync: vi.fn(),
        constants: { F_OK: 0 },
        promises: {
            mkdir: vi.fn().mockResolvedValue(undefined),
            writeFile: vi.fn().mockResolvedValue(undefined),
            readFile: vi.fn().mockResolvedValue('{"messages":[]}'),
            access: vi.fn().mockResolvedValue(undefined),
            unlink: vi.fn().mockResolvedValue(undefined),
        },
    },
    existsSync: vi.fn().mockReturnValue(true),
    mkdirSync: vi.fn(),
    writeFileSync: vi.fn(),
    readFileSync: vi.fn().mockReturnValue('{}'),
    unlinkSync: vi.fn(),
    rmSync: vi.fn(),
    constants: { F_OK: 0 },
    promises: {
        mkdir: vi.fn().mockResolvedValue(undefined),
        writeFile: vi.fn().mockResolvedValue(undefined),
        readFile: vi.fn().mockResolvedValue('{"messages":[]}'),
        access: vi.fn().mockResolvedValue(undefined),
        unlink: vi.fn().mockResolvedValue(undefined),
    },
}));

// Helper to create mock request object
export function createMockRequest(overrides = {}) {
    return {
        body: {},
        params: {},
        query: {},
        headers: {},
        user: null,
        ...overrides,
    };
}

// Helper to create mock response object
export function createMockResponse() {
    const res = {
        statusCode: 200,
        jsonData: null,
        status: vi.fn().mockImplementation(function (code) {
            this.statusCode = code;
            return this;
        }),
        json: vi.fn().mockImplementation(function (data) {
            this.jsonData = data;
            return this;
        }),
        send: vi.fn().mockImplementation(function (data) {
            this.jsonData = data;
            return this;
        }),
        setHeader: vi.fn().mockReturnThis(),
        sendFile: vi.fn(),
    };
    return res;
}

// Helper to create mock next function
export function createMockNext() {
    return vi.fn();
}
