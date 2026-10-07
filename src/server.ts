import app from "./app.js";
import { prisma } from "./lib/prisma.js";

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