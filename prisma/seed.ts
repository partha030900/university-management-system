import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Seeding database...");

  const hashedPassword = await bcrypt.hash("password123", 10);
  
  const user = await prisma.user.upsert({
  where: {
    email: "student@example.com",
  },
  update: {password: hashedPassword},
  create: {
    email: "student@example.com",
    password: hashedPassword,
    role: "STUDENT",
  },
});

  const department = await prisma.department.upsert({
  where: {
    code: "CSE",
  },
  update: {},
  create: {
    name: "Computer Science and Engineering",
    code: "CSE",
  },
});


  const program = await prisma.program.upsert({
  where: {
    code: "BSC-CSE",
  },
  update: {},
  create: {
    name: "B.Sc. in Computer Science and Engineering",
    code: "BSC-CSE",
    duration: 4,
    departmentId: department.id,
  },
});

  const student = await prisma.student.upsert({
  where: {
    studentId: "STU001",
  },
  update: {},
  create: {
    userId: user.id,
    studentId: "STU001",
    name: "John Doe",
    programId: program.id,
  },
});

  // Create instructor user
 const instructorUser = await prisma.user.upsert({
  where: {
    email: "instructor@example.com",
  },
  update: {password: hashedPassword},
  create: {
    email: "instructor@example.com",
    password: hashedPassword,
    role: "INSTRUCTOR",
  },
});

  // Create instructor
  const instructor = await prisma.instructor.upsert({
  where: {
    employeeId: "INS001",
  },
  update: {},
  create: {
    userId: instructorUser.id,
    employeeId: "INS001",
    name: "Dr. Roy",
    departmentId: department.id,
    designation: "Lecturer",
  },
});

  // Create course
  const course = await prisma.course.upsert({
  where: {
    code: "CSE101",
  },
  update: {},
  create: {
    code: "CSE101",
    title: "Introduction to Computer Science",
    description: "Fundamentals of computer science",
    credits: 3,
  },
});

const advancedCourse = await prisma.course.upsert({
  where: {
    code: "CSE201",
  },
  update: {},
  create: {
    code: "CSE201",
    title: "Advanced Computer Science",
    description: "Advanced concepts in computer science",
    credits: 3,
    prerequisites: {
      connect: {
        id: course.id,
      },
    },
  },
});

  // Create semester
  const semester = await prisma.semester.upsert({
  where: {
    name_year: {
      name: "FIRST",
      year: 2026,
    },
  },
  update: {},
  create: {
    name: "FIRST",
    year: 2026,
    startDate: new Date("2026-01-01"),
    endDate: new Date("2026-06-30"),
  },
});

  // Create section
  const section = await prisma.section.upsert({
  where: {
    name_courseId_semesterId: {
      name: "A",
      courseId: course.id,
      semesterId: semester.id,
    },
  },
  update: {},
  create: {
    name: "A",
    capacity: 30,
    courseId: course.id,
    semesterId: semester.id,
    instructorId: instructor.id,
  },
});

  const advancedSection = await prisma.section.upsert({
  where: {
    name_courseId_semesterId: {
      name: "A",
      courseId: advancedCourse.id,
      semesterId: semester.id,
    },
  },
  update: {},
  create: {
    name: "A",
    capacity: 30,
    courseId: advancedCourse.id,
    semesterId: semester.id,
    instructorId: instructor.id,
  },
});

  const checkCourse = await prisma.course.findUnique({
  where: {
    code: "CSE201",
  },
  include: {
    prerequisites: true,
  },
});

  console.log("CSE201 prerequisites:", checkCourse?.prerequisites);


  console.log("Seed completed!");

 console.log({
  userId: user.id,
  programId: program.id,
  studentId: student.id,
  instructorId: instructor.id,
  courseId: course.id,
  advancedCourseId: advancedCourse.id,
  semesterId: semester.id,
  sectionId: section.id,
  advancedSectionId: advancedSection.id,
});
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  
  