import { EnumType } from "./commonType";

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
  sessionStatus: EnumType;
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
  id?: string;
  startTime: string;
  endTime: string;
  sessionStatus: number; // 1 = Available, 2 = Booked, 3 = Rescheduled, 4 = Waiting (or whatever your backend uses)
};
