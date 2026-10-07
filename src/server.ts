import app from "./app";
import { prisma } from "./lib/prisma";

async function main() {
  try {
    await prisma.$connect();
  } catch (error) {
    console.error("Error connecting to database:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();

export default app;