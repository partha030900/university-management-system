/*
  Warnings:

  - A unique constraint covering the columns `[name,courseId,semesterId]` on the table `sections` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "sections_name_courseId_semesterId_key" ON "sections"("name", "courseId", "semesterId");
