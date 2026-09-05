import http from "http";
import app from "../../../app.js";

export function createServer() {
  return http.createServer(app);
}
