// The final solution will include a better spread of time across days to ensure all homeworks are done

type Homework = {
  name: string;
  estimatedCompletion: number; // Time in 30-minute blocks
  deadline: string; // ISO date string
};

type Constraint = {
  days: number[]; // Days 0-6 represent Sunday to Saturday
  from: string; // Time in HH:MM format
  to: string; // Time in HH:MM format
};

export type ScheduleItem = {
  name: string;
  from: string; // ISO date string
  to: string; // ISO date string
};

export function spreadSchedule(homeworks: Homework[] = finalHomeworksList, constraints: Constraint[] = Constraints): ScheduleItem[] {
  const schedule: ScheduleItem[] = [];
  const availableSlots: Date[] = [];

  // Create a list of available time slots without conflicts
  for (let day = 0; day < 7; day++) { // Scheduling for the upcoming week
    let time = new Date();
    time.setHours(6, 0, 0, 0);
    time.setDate(time.getDate() + day);

    while (time.getHours() < 22) {
      const eventEnd = new Date(time.getTime() + 30 * 60 * 1000);
      if (!constraints.some((constraint) => checkConflict(time, eventEnd, constraint))) {
        availableSlots.push(new Date(time));
      }
      time.setMinutes(time.getMinutes() + 30);
    }
  }

  // Assign homework times to available slots
  for (const homework of homeworks.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())) {
    let requiredTime = homework.estimatedCompletion * 30; // Time in minutes
    const deadline = new Date(homework.deadline);

    for (const slot of [...availableSlots]) {
      if (requiredTime <= 0) break;
      if (slot < deadline) {
        const endSlot = new Date(slot.getTime() + 30 * 60 * 1000);
        schedule.push({
          name: homework.name,
          from: slot.toISOString(),
          to: endSlot.toISOString(),
        });
        requiredTime -= 30;
        availableSlots.splice(availableSlots.indexOf(slot), 1); // Mark the slot as used
      }
    }
  }

  return schedule;
}

function checkConflict(eventStart: Date, eventEnd: Date, constraint: Constraint): boolean {
  const day = eventStart.getDay();
  if (!constraint.days.includes(day)) {
    return false;
  }

  const [constraintStartHour, constraintStartMinute] = constraint.from.split(":").map(Number);
  const [constraintEndHour, constraintEndMinute] = constraint.to.split(":").map(Number);

  const constraintStart = new Date(eventStart);
  constraintStart.setHours(constraintStartHour, constraintStartMinute, 0, 0);

  const constraintEnd = new Date(eventStart);
  constraintEnd.setHours(constraintEndHour, constraintEndMinute, 0, 0);

  return !(eventEnd <= constraintStart || eventStart >= constraintEnd);
}

// Include mathHomework correctly
const finalHomeworksList: Homework[] = [
  {
    name: "mathHomework",
    estimatedCompletion: 4, // 2 hours (4 x 30-minute blocks)
    deadline: new Date("October 13, 2024").toISOString(),
  },
  {
    name: "sciencehomework",
    estimatedCompletion: 3, // 1.5 hours (3 x 30-minute blocks)
    deadline: new Date("October 17, 2024").toISOString(),
  },
  {
    name: "arthomeowork",
    estimatedCompletion: 4, // 2 hours (4 x 30-minute blocks)
    deadline: new Date("October 16, 2024").toISOString(),
  },
];

// Example constraint
const Constraints: Constraint[] = [
  {
    days: [1, 3, 5], // Monday, Wednesday, Friday
    from: "07:00",
    to: "08:00",
  },
  {
    days: [0, 6], // Sunday, Saturday
    from: "09:00",
    to: "11:00",
  },
  {
    days: [2, 4], // Tuesday, Thursday
    from: "16:00",
    to: "18:00",
  },
];

// Spread the schedule properly across available days
const finalSpreadSchedule = spreadSchedule(finalHomeworksList, Constraints);
console.log(finalSpreadSchedule);