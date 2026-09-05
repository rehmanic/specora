
export function startServer(server, port, envMode) {

  return new Promise((resolve) => {

    server.on("error", (error) => {
      console.error("SERVER STARTUP FAILED:", error);
      process.exit(1);
    });

    server.listen(port, () => {
      console.log(`SERVER UP ON PORT ${port} (${envMode}) `);
      resolve();
    });

  });

}
