import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.js";

const createAttendance = async (
data: {
registrationId: number;
date: Date;
status: "PRESENT" | "ABSENT" | "LATE";
},
user: { id: number; role: "ADMIN" | "INSTRUCTOR" }
) => {
const { registrationId, date, status } = data;

const registration = await prisma.registration.findUnique({
where: { id: registrationId },
include: {
section: true,
},
});

if (!registration) {
throw new AppError(404, "Registration not found");
}

if (user.role === "INSTRUCTOR") {
const instructor = await prisma.instructor.findUnique({
where: { userId: user.id },
});

if (
  !instructor ||
  registration.section.instructorId !== instructor.id
) {
  throw new AppError(
    403,
    "You can only record attendance for your assigned sections"
  );
}

}

const existingAttendance = await prisma.attendance.findUnique({
where: {
registrationId_date: {
registrationId,
date,
},
},
});

if (existingAttendance) {
throw new AppError(409, "Attendance already recorded for this date");
}

return prisma.attendance.create({
data: {
registrationId,
date,
status,
},
});
};

const getAttendanceSummary = async (registrationId: number) => {
  const registration = await prisma.registration.findUnique({
    where: { id: registrationId },
  });

  if (!registration) {
    throw new Error("Registration not found");
  }

  const attendances = await prisma.attendance.findMany({
    where: { registrationId },
    orderBy: { date: "asc" },
  });

  const totalClasses = attendances.length;

  const presentCount = attendances.filter(
    (attendance) => attendance.status === "PRESENT"
  ).length;

  const lateCount = attendances.filter(
    (attendance) => attendance.status === "LATE"
  ).length;

  const absentCount = attendances.filter(
    (attendance) => attendance.status === "ABSENT"
  ).length;

  const attendancePercentage =
    totalClasses === 0
      ? 0
      : Number(
          (((presentCount + lateCount) / totalClasses) * 100).toFixed(2)
        );

  return {
    registrationId,
    totalClasses,
    presentCount,
    lateCount,
    absentCount,
    attendancePercentage,
    attendances,
  };
};

const getSectionStudents = async (
  sectionId: number,
  user: { id: number; role: "ADMIN" | "INSTRUCTOR" }
) => {
  const section = await prisma.section.findUnique({
    where: { id: sectionId },
    include: {
      course: true,
    },
  });

  if (!section) {
    throw new AppError(404, "Section not found");
  }

  if (user.role === "INSTRUCTOR") {
    const instructor = await prisma.instructor.findUnique({
      where: { userId: user.id },
    });

    if (!instructor || section.instructorId !== instructor.id) {
      throw new AppError(
        403,
        "You can only view students in your assigned sections"
      );
    }
  }

  const registrations = await prisma.registration.findMany({
    where: { sectionId },
    include: {
      student: {
        include: {
          user: true,
          program: true,
        },
      },
    },
    orderBy: {
      registeredAt: "asc",
    },
  });

  return {
    section: {
      id: section.id,
      course: section.course,
    },
    students: registrations,
  };
};

export const attendanceService = {
  createAttendance,getAttendanceSummary,getSectionStudents
};