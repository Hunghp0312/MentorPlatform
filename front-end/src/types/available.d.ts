export type WeeklySchedule = {
  weekStartDate: string;
  weekEndDate: string;
  mentorId: string;
  days: DaySchedule[];
};

export type DaySchedule = {
  date: string;
  dayName:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  workStartTime: string | null;
  workEndTime: string | null;
  sessionDurationMinutes: number | null;
  bufferMinutes: number | null;
  timeBlocks: TimeBlock[];
};

export type TimeBlock = {
  id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
};

export type UpdateAvailabilityRequest = {
  days: UpdateDaySchedule[];
};

export type UpdateDaySchedule = {
  date: string;
  workStartTime: string;
  workEndTime: string;
  sessionDurationMinutes: number;
  bufferMinutes: number;
  timeBlocks: UpdateTimeBlock[];
};

export type UpdateTimeBlock = {
  startTime: string;
  endTime: string;
  sessionStatus: number; // 0 = Available, 1 = Unavailable, 2 = Booked (or whatever your backend uses)
};
