import { loadEnv } from "./src/config/server/env.js";
import { connectDatabase } from "./src/config/server/database.js";
import { createServer } from "./src/config/server/http.js";
import { attachWebSockets } from "./src/config/socket.js";
import { startServer } from "./src/config/server/runner.js";
import { setupGracefulShutdown } from "./src/config/server/shutdown.js";

const env = loadEnv();
const prisma = await connectDatabase();
const server = createServer();
attachWebSockets(server);
await startServer(server, env.PORT, env.NODE_ENV);
setupGracefulShutdown(server, prisma);