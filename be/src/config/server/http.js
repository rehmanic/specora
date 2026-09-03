import http from "http";
import app from "../../../app.js";

/**
 * Creates Node HTTP server instance wrapping Express app.
 * @returns {import("http").Server} Node HTTP server instance
 */
export function createServer() {
  return http.createServer(app);
}
