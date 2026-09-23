-- CreateEnum
CREATE TYPE "Grade" AS ENUM ('A_PLUS', 'A', 'A_MINUS', 'B_PLUS', 'B', 'B_MINUS', 'C_PLUS', 'C', 'D', 'F');

-- CreateTable
CREATE TABLE "results" (
    "id" SERIAL NOT NULL,
    "registrationId" INTEGER NOT NULL,
    "examId" INTEGER NOT NULL,
    "marks" DOUBLE PRECISION NOT NULL,
    "grade" "Grade" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "results_registrationId_examId_key" ON "results"("registrationId", "examId");

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "registrations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
