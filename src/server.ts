import express, { type Request, type Response } from "express";
import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT;

async function main(){
  try {
    await prisma.$connect();
  app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
  
} catch (error) {
  console.log("Error starting server");
  await prisma.$disconnect();
  process.exit(1);
  
}

}
main();
