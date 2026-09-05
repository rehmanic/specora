export async function close(prisma) {

  try {
    await prisma.$disconnect();
    console.log("DB DISCONNECTED");
    process.exit(0);
  } catch (err) {
    console.error("DB DISCONNECTION ERROR:", err);
    process.exit(1);
  }

}

export function shutDown(prisma) {
  process.on("SIGINT", () => close(prisma));
  process.on("SIGTERM", () => close(prisma));
}
