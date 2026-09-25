import { prisma } from "../../lib/prisma.js";

const createAttendance = async (data: {
  registrationId: number;
  date: Date;
  status: "PRESENT" | "ABSENT" | "LATE";
}) => {
  const { registrationId, date, status } = data;

  const registration = await prisma.registration.findUnique({
    where: { id: registrationId },
  });

  if (!registration) {
    throw new Error("Registration not found");
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
    throw new Error("Attendance already recorded for this date");
  }

  const attendance = await prisma.attendance.create({
    data: {
      registrationId,
      date,
      status,
    },
  });

  return attendance;
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

export const attendanceService = {
  createAttendance,getAttendanceSummary
};