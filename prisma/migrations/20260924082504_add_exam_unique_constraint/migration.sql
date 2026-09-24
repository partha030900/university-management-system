/*
  Warnings:

  - A unique constraint covering the columns `[sectionId,type]` on the table `exams` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "exams_sectionId_type_key" ON "exams"("sectionId", "type");
