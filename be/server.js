import { loadEnv } from "./src/config/server/env.js";
import { connectDB } from "./src/config/server/db.js";
import { createServer } from "./src/config/server/http.js";
import { attachWebSockets } from "./src/config/socket.js";
import { startServer } from "./src/config/server/runner.js";
import { shutDown } from "./src/config/server/shutdown.js";

const env = loadEnv();
const prisma = await connectDB();
const server = createServer();
attachWebSockets(server, env.CORS_ORIGIN);
await startServer(server, env.PORT, env.NODE_ENV);
shutDown(prisma);