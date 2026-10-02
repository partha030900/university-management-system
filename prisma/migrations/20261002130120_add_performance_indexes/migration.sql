-- CreateIndex
CREATE INDEX "Instructor_departmentId_idx" ON "Instructor"("departmentId");

-- CreateIndex
CREATE INDEX "Payment_registrationId_idx" ON "Payment"("registrationId");

-- CreateIndex
CREATE INDEX "Student_programId_idx" ON "Student"("programId");

-- CreateIndex
CREATE INDEX "attendances_registrationId_idx" ON "attendances"("registrationId");

-- CreateIndex
CREATE INDEX "exams_sectionId_idx" ON "exams"("sectionId");

-- CreateIndex
CREATE INDEX "programs_departmentId_idx" ON "programs"("departmentId");

-- CreateIndex
CREATE INDEX "registrations_studentId_idx" ON "registrations"("studentId");

-- CreateIndex
CREATE INDEX "registrations_sectionId_idx" ON "registrations"("sectionId");

-- CreateIndex
CREATE INDEX "results_registrationId_idx" ON "results"("registrationId");

-- CreateIndex
CREATE INDEX "results_examId_idx" ON "results"("examId");

-- CreateIndex
CREATE INDEX "sections_courseId_idx" ON "sections"("courseId");

-- CreateIndex
CREATE INDEX "sections_semesterId_idx" ON "sections"("semesterId");

-- CreateIndex
CREATE INDEX "sections_instructorId_idx" ON "sections"("instructorId");
