import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { availabilityService } from "../../services/availability.service";
import { getUserFromToken } from "../../utils/auth";
import {
  DaySchedule,
  TimeBlock,
  UpdateAvailabilityRequest,
  UpdateTimeBlock,
  WeeklySchedule,
} from "../../types/available";
import LoadingOverlay from "../../components/loading/LoadingOverlay";
import { endTimeOptions, startTimeOptions } from "../../constants/timeOptions";

const AvailabilityManager = () => {
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    getLastSunday()
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasBookedSlots, setHasBookedSlots] = useState<boolean>(false);

  // State for schedule and settings
  const [weekAvailability, setWeekAvailability] =
    useState<WeeklySchedule | null>(null);
  const [slotAvailability, setSlotAvailability] = useState<
    Record<string, Record<string, boolean>>
  >({});
  const [workHours, setWorkHours] = useState({ start: "09:00", end: "17:00" });
  const [sessionDuration, setSessionDuration] = useState<number>(60);
  const [bufferTime, setBufferTime] = useState<number>(15);

  // Utility functions
  function formatDateYYYYMMDD(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  function formatDateMonthDay(date: Date): string {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  function getLastSunday(date = new Date()): Date {
    // Create a new date object and adjust for GMT+7 timezone
    const gmtPlus7Date = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    const lastSunday = new Date(gmtPlus7Date);
    const day = lastSunday.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
    lastSunday.setDate(lastSunday.getDate() - day);
    // Reset to midnight for consistency
    lastSunday.setHours(7, 0, 0, 0);
    return lastSunday;
  }

  function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  function parseTimeToDate(time: string): Date {
    const [hours, minutes] = time.split(":").map(Number);
    const now = new Date();
    now.setHours(hours, minutes, 0, 0);
    return now;
  }

  function formatDateToTimeString(date: Date): string {
    return date.toTimeString().slice(0, 5); // "HH:MM"
  }

  function getTimeSlots(
    startTimeStr: string,
    endTimeStr: string,
    slotDurationMinutes: number,
    bufferMinutes: number
  ): string[] {
    const slots: string[] = [];

    let startTime = parseTimeToDate(startTimeStr);
    const endTime = parseTimeToDate(endTimeStr);

    while (true) {
      const slotEnd = new Date(
        startTime.getTime() + slotDurationMinutes * 60000
      );
      if (slotEnd > endTime) break;

      const slot = `${formatDateToTimeString(
        startTime
      )} - ${formatDateToTimeString(slotEnd)}`;
      slots.push(slot);

      startTime = new Date(slotEnd.getTime() + bufferMinutes * 60000);
    }

    return slots;
  }

  // Generate week dates
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(currentWeekStart, i);
    return {
      date,
      dateString: formatDateYYYYMMDD(date),
      displayDate: formatDateMonthDay(date),
      dayName: date.toLocaleDateString("en-US", { weekday: "long" }),
      dayShort: date
        .toLocaleDateString("en-US", { weekday: "short" })
        .slice(0, 3),
    };
  });

  // Navigate between weeks
  const goToPreviousWeek = () => {
    const newStart = addDays(currentWeekStart, -7);
    setCurrentWeekStart(newStart);
  };

  const goToNextWeek = () => {
    const newStart = addDays(currentWeekStart, 7);
    setCurrentWeekStart(newStart);
  };

  const goToCurrentWeek = () => {
    setCurrentWeekStart(getLastSunday());
  };

  // Toggle time slot availability for the selected day
  const toggleSlot = (dayDateString: string, timeSlot: string) => {
    setSlotAvailability((prev) => {
      const daySlots = { ...prev[dayDateString] };
      daySlots[timeSlot] = !daySlots[timeSlot];

      return {
        ...prev,
        [dayDateString]: daySlots,
      };
    });
  };

  // Bulk actions
  const selectAllSlots = () => {
    if (!selectedDay) return;

    const day = weekDates.find((d) => d.dayShort === selectedDay)?.dateString;
    if (!day || !weekAvailability) return;

    const daySchedule = weekAvailability.days.find((d) => d.date === day);
    if (!daySchedule) return;

    const slots = getTimeSlots(
      daySchedule.workStartTime || workHours.start,
      daySchedule.workEndTime || workHours.end,
      daySchedule.sessionDurationMinutes || sessionDuration,
      daySchedule.bufferMinutes || bufferTime
    );

    const newSlots: Record<string, boolean> = {};
    slots.forEach((slot) => {
      newSlots[slot] = true;
    });

    setSlotAvailability((prev) => ({
      ...prev,
      [day]: newSlots,
    }));
  };

  const clearAllSlots = () => {
    if (!selectedDay) return;

    const day = weekDates.find((d) => d.dayShort === selectedDay)?.dateString;
    if (!day || !weekAvailability) return;

    const daySchedule = weekAvailability.days.find((d) => d.date === day);
    if (!daySchedule) return;

    const slots = getTimeSlots(
      daySchedule.workStartTime || workHours.start,
      daySchedule.workEndTime || workHours.end,
      daySchedule.sessionDurationMinutes || sessionDuration,
      daySchedule.bufferMinutes || bufferTime
    );

    const newSlots: Record<string, boolean> = {};
    slots.forEach((slot) => {
      newSlots[slot] = false;
    });

    setSlotAvailability((prev) => ({
      ...prev,
      [day]: newSlots,
    }));
  };

  const copyScheduleToAllDays = () => {
    if (!selectedDay) return;

    const sourceDay = weekDates.find(
      (d) => d.dayShort === selectedDay
    )?.dateString;
    if (!sourceDay || !slotAvailability[sourceDay]) return;

    const sourceSlots = slotAvailability[sourceDay];

    const newAvailability = { ...slotAvailability };
    weekDates.forEach((day) => {
      if (day.dateString !== sourceDay) {
        newAvailability[day.dateString] = { ...sourceSlots };
      }
    });

    setSlotAvailability(newAvailability);
  };

  // Save availability changes
  const saveChanges = async () => {
    try {
      setIsSaving(true);

      const decodedToken = getUserFromToken();
      const mentorId = decodedToken?.id;

      if (!mentorId) {
        toast.error("User ID not found");
        return;
      }

      // Convert slotAvailability to the format expected by the API
      const updateData: UpdateAvailabilityRequest = {
        days: weekDates.map((day) => {
          // Get the day slots
          const daySlots = slotAvailability[day.dateString] || {};
          const daySchedule = weekAvailability?.days.find(
            (d) => d.date === day.dateString
          );

          const timeBlocks: UpdateTimeBlock[] = [];

          const allTimeSlots = getTimeSlots(
            daySchedule?.workStartTime || workHours.start,
            daySchedule?.workEndTime || workHours.end,
            daySchedule?.sessionDurationMinutes || sessionDuration,
            daySchedule?.bufferMinutes !== undefined &&
              daySchedule?.bufferMinutes !== null
              ? daySchedule.bufferMinutes
              : bufferTime
          );

          allTimeSlots.forEach((slot) => {
            if (daySlots[slot]) {
              const [startTime, endTime] = slot.split(" - ");

              const matchingBlock = daySchedule?.timeBlocks.find(
                (block) =>
                  block.startTime === startTime && block.endTime === endTime
              );

              if (matchingBlock && matchingBlock.sessionStatus.id !== 1) {
                timeBlocks.push({
                  id: matchingBlock.id,
                  startTime,
                  endTime,
                  sessionStatus: matchingBlock.sessionStatus.id,
                });
              } else {
                timeBlocks.push({
                  startTime,
                  endTime,
                  sessionStatus: 1,
                });
              }
            }
          });

          return {
            date: day.dateString,
            workStartTime: daySchedule?.workStartTime || workHours.start,
            workEndTime: daySchedule?.workEndTime || workHours.end,
            sessionDurationMinutes:
              daySchedule?.sessionDurationMinutes || sessionDuration,
            bufferMinutes: daySchedule?.bufferMinutes || bufferTime,
            timeBlocks,
          };
        }),
      };

      // Send update request
      await availabilityService.updateAvailability(mentorId, updateData);

      toast.success("Availability updated successfully");

      // Refresh the data
      const refreshedData = await availabilityService.getWeekAvailability(
        mentorId,
        formatDateYYYYMMDD(currentWeekStart)
      );
      setWeekAvailability(refreshedData);
    } catch (error) {
      console.error("Error saving availability:", error);
      toast.error("Failed to save availability");
    } finally {
      setIsSaving(false);
    }
  };

  // Fetch availability data when week changes
  useEffect(() => {
    const fetchWeekAvailability = async () => {
      setIsLoading(true);
      try {
        const decodedToken = getUserFromToken();
        const mentorId = decodedToken?.id || "";

        if (!mentorId) {
          toast.error("User ID not found");
          return;
        }

        const weekStartDate = formatDateYYYYMMDD(currentWeekStart);
        const data = await availabilityService.getWeekAvailability(
          mentorId,
          weekStartDate
        );
        setWeekAvailability(data);

        // Process the data into the slotAvailability state
        const availability: Record<string, Record<string, boolean>> = {};
        let hasAnyBookedSlots = false;

        // First, set work hours, session duration and buffer from API if available
        if (data.days.length > 0) {
          const firstDay = data.days[0];
          if (firstDay.workStartTime && firstDay.workEndTime) {
            setWorkHours({
              start: firstDay.workStartTime,
              end: firstDay.workEndTime,
            });
          }

          if (firstDay.sessionDurationMinutes) {
            setSessionDuration(firstDay.sessionDurationMinutes);
          }

          if (firstDay.bufferMinutes) {
            setBufferTime(firstDay.bufferMinutes);
          }
        }

        // Process each day of the week
        weekDates.forEach((day) => {
          const dayData = data.days.find(
            (d: DaySchedule) => d.date === day.dateString
          );

          // Get work hours for this day (either from day data or default)
          const dayWorkHours = {
            start: dayData?.workStartTime || workHours.start,
            end: dayData?.workEndTime || workHours.end,
          };

          // Get session and buffer settings for this day
          const daySessionDuration =
            dayData?.sessionDurationMinutes || sessionDuration;
          const dayBufferMinutes = dayData?.bufferMinutes || bufferTime;

          // Generate all possible time slots for this day
          const allTimeSlots = getTimeSlots(
            dayWorkHours.start,
            dayWorkHours.end,
            daySessionDuration,
            dayBufferMinutes
          );

          // Initialize all slots as unavailable
          const daySlots: Record<string, boolean> = {};
          allTimeSlots.forEach((slot) => {
            daySlots[slot] = false;
          });

          // If we have API data for this day, mark slots accordingly
          if (dayData) {
            dayData.timeBlocks.forEach((block: TimeBlock) => {
              const timeSlot = `${block.startTime} - ${block.endTime}`;
              // Mark as available if it's not booked
              daySlots[timeSlot] = true;

              if (block.sessionStatus.id !== 1) {
                hasAnyBookedSlots = true;
              }
            });
          }

          availability[day.dateString] = daySlots;
        });

        setSlotAvailability(availability);
        setHasBookedSlots(hasAnyBookedSlots);

        // Set default selected day to the first day of the week
        if (weekDates.length > 0 && !selectedDay) {
          setSelectedDay(weekDates[0].dayShort);
        }
      } catch (error) {
        console.error("Error fetching week availability:", error);
        toast.error("Failed to load availability data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeekAvailability();
  }, [currentWeekStart]);

  // Generate time slots for the selected day
  const selectedDayDate = selectedDay
    ? weekDates.find((day) => day.dayShort === selectedDay)?.dateString
    : null;

  const selectedDayData =
    selectedDayDate && weekAvailability
      ? weekAvailability.days.find((day) => day.date === selectedDayDate)
      : null;

  const timeSlots = selectedDayData
    ? getTimeSlots(workHours.start, workHours.end, sessionDuration, bufferTime)
    : [];

  // Get the current time slots for the selected day
  const currentDaySlots = selectedDayDate
    ? slotAvailability[selectedDayDate] || {}
    : {};

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="min-h-screen bg-slate-800 text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-slate-700">
        <h1 className="text-2xl font-semibold">Manage Your Availability</h1>
        <button
          className={`bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-medium transition-colors ${
            isSaving ? "opacity-70 cursor-not-allowed" : ""
          }`}
          onClick={saveChanges}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Warning Banner */}
      {hasBookedSlots && (
        <div className="mx-6 mt-6 bg-orange-600 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-medium mb-1">
              Some of your time slots are already booked.
            </div>
            <div className="text-sm text-orange-100">
              You cannot modify work hours, session duration, or buffer time
              until these bookings are completed or canceled.
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-6 p-6">
        {/* Left Sidebar */}
        <div className="w-80 space-y-6">
          {/* Work Hours */}
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Work hours</h3>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label
                  htmlFor="workStartTime"
                  className="block text-sm text-slate-300 mb-2"
                >
                  Start time
                </label>
                <select
                  id="workStartTime"
                  value={workHours.start}
                  onChange={(e) => {
                    const newStartTime = e.target.value;
                    setWorkHours({ ...workHours, start: newStartTime });

                    // Update weekAvailability with the new start time
                    if (weekAvailability && selectedDayDate) {
                      setWeekAvailability({
                        ...weekAvailability,
                        days: weekAvailability.days.map((day) =>
                          day.date === selectedDayDate
                            ? { ...day, workStartTime: newStartTime }
                            : day
                        ),
                      });
                    }
                  }}
                  className="w-full bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white"
                  disabled={hasBookedSlots}
                >
                  {startTimeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="workEndTime"
                  className="block text-sm text-slate-300 mb-2"
                >
                  End time
                </label>
                <select
                  id="workEndTime"
                  value={workHours.end}
                  onChange={(e) => {
                    const newEndTime = e.target.value;
                    setWorkHours({ ...workHours, end: newEndTime });

                    // Update weekAvailability with the new end time
                    if (weekAvailability && selectedDayDate) {
                      setWeekAvailability({
                        ...weekAvailability,
                        days: weekAvailability.days.map((day) =>
                          day.date === selectedDayDate
                            ? { ...day, workEndTime: newEndTime }
                            : day
                        ),
                      });
                    }
                  }}
                  className="w-full bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white"
                  disabled={hasBookedSlots}
                >
                  {endTimeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {hasBookedSlots && (
              <p className="text-sm text-slate-400">
                Cannot change work hours while you have booked sessions.
              </p>
            )}
          </div>

          {/* Session Settings */}
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Session settings</h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="sessionDuration"
                  className="block text-sm text-slate-300 mb-2"
                >
                  Session duration
                </label>
                <select
                  id="sessionDuration"
                  value={sessionDuration}
                  onChange={(e) => {
                    const newDuration = parseInt(e.target.value);
                    setSessionDuration(newDuration);

                    // Update weekAvailability with the new session duration
                    if (weekAvailability && selectedDayDate) {
                      setWeekAvailability({
                        ...weekAvailability,
                        days: weekAvailability.days.map((day) =>
                          day.date === selectedDayDate
                            ? { ...day, sessionDurationMinutes: newDuration }
                            : day
                        ),
                      });
                    }
                  }}
                  className="w-full bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white"
                  disabled={hasBookedSlots}
                >
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                  <option value="120">120 minutes</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="bufferTime"
                  className="block text-sm text-slate-300 mb-2"
                >
                  Buffer time between sessions
                </label>
                <select
                  id="bufferTime"
                  value={bufferTime}
                  onChange={(e) => {
                    const newBufferTime = parseInt(e.target.value);
                    setBufferTime(newBufferTime);

                    // Update weekAvailability with the new buffer time
                    if (weekAvailability && selectedDayDate) {
                      setWeekAvailability({
                        ...weekAvailability,
                        days: weekAvailability.days.map((day) =>
                          day.date === selectedDayDate
                            ? { ...day, bufferMinutes: newBufferTime }
                            : day
                        ),
                      });
                    }
                  }}
                  className="w-full bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white"
                  disabled={hasBookedSlots}
                >
                  <option value="0">No buffer</option>
                  <option value="5">5 minutes</option>
                  <option value="10">10 minutes</option>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Calendar Navigation */}
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Calendar Navigation</h3>
            <div className="flex items-center justify-between mb-4">
              <button
                className="p-1 hover:bg-slate-600 rounded"
                onClick={goToPreviousWeek}
                id="previous-week"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-medium">
                {weekDates.length > 0 &&
                  `${weekDates[0].displayDate} - ${weekDates[6].displayDate}`}
              </span>
              <button
                className="p-1 hover:bg-slate-600 rounded"
                onClick={goToNextWeek}
                id="next-week"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <button
              className="w-full bg-slate-600 hover:bg-slate-500 py-2 rounded transition-colors"
              onClick={goToCurrentWeek}
            >
              Go to current week
            </button>
          </div>

          {/* Bulk Actions */}
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Bulk actions</h3>
            <div className="space-y-2">
              <button
                onClick={selectAllSlots}
                className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded transition-colors"
              >
                Select all slots for {selectedDay}{" "}
                {weekDates.find((d) => d.dayShort === selectedDay)?.displayDate}
              </button>
              <button
                onClick={clearAllSlots}
                className="w-full bg-slate-600 hover:bg-slate-500 py-2 rounded transition-colors"
              >
                Clear all slots for {selectedDay}{" "}
                {weekDates.find((d) => d.dayShort === selectedDay)?.displayDate}
              </button>
              <button
                onClick={copyScheduleToAllDays}
                className="w-full bg-green-600 hover:bg-green-700 py-2 rounded transition-colors"
              >
                Copy schedule to all days
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Day Tabs */}
          <div className="flex mb-6" id="calendar">
            {weekDates.map((day) => {
              // Check if this day has any booked slots
              const dayData = weekAvailability?.days.find(
                (d) => d.date === day.dateString
              );
              const hasBooking = weekAvailability?.days
                .find((d) => d.date === day.dateString)
                ?.timeBlocks.some((block) => block.sessionStatus.id !== 1);

              return (
                <button
                  key={day.dayShort}
                  onClick={() => {
                    setSelectedDay(day.dayShort);
                    setSessionDuration(
                      dayData?.sessionDurationMinutes || sessionDuration
                    );
                    if (
                      dayData?.bufferMinutes !== undefined &&
                      dayData?.bufferMinutes !== null
                    ) {
                      setBufferTime(dayData?.bufferMinutes);
                    }

                    setWorkHours({
                      start: dayData?.workStartTime || workHours.start,
                      end: dayData?.workEndTime || workHours.end,
                    });
                  }}
                  className={`flex-1 py-3 px-4 text-center border-r border-slate-600 last:border-r-0 transition-colors ${
                    selectedDay === day.dayShort
                      ? "bg-orange-500 text-white"
                      : "bg-slate-700 hover:bg-slate-600 text-slate-300 cursor-pointer"
                  }`}
                >
                  <div className="font-medium">{day.dayShort}</div>
                  <div className="text-sm">{day.displayDate}</div>
                  {hasBooking && (
                    <div className="w-2 h-2 bg-blue-400 rounded-full mx-auto mt-1"></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Time Slots */}
          {selectedDayDate && (
            <div className="mb-8">
              <h2 className="text-xl font-medium mb-4">
                Set your availability for{" "}
                {weekDates.find((d) => d.dayShort === selectedDay)?.dayName},{" "}
                {weekDates.find((d) => d.dayShort === selectedDay)?.displayDate}
              </h2>

              {timeSlots.length > 0 ? (
                <div
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                  id="time-block-grid"
                >
                  {timeSlots.map((slot, index) => {
                    // Check if this slot is in API data (has a matching timeBlock)
                    const matchingBlock = selectedDayData?.timeBlocks.find(
                      (block) =>
                        `${block.startTime} - ${block.endTime}` === slot
                    );

                    // Is this slot booked?
                    const isBooked =
                      (matchingBlock?.sessionStatus != null &&
                        matchingBlock?.sessionStatus.id !== 1) ||
                      false;

                    // Is this slot currently set to available?
                    const isAvailable = currentDaySlots[slot] || false;

                    return (
                      <div
                        key={index}
                        onClick={() => {
                          // Only allow toggling if not booked and not in the past
                          const [slotStart] = slot.split(" - ");
                          const slotDate = new Date(selectedDayDate);
                          const [hours, minutes] = slotStart
                            .split(":")
                            .map(Number);
                          slotDate.setHours(hours, minutes, 0, 0);

                          const isPastTime = slotDate < new Date();

                          if (!isBooked && !isPastTime) {
                            toggleSlot(selectedDayDate, slot);
                          }
                        }}
                        className={`
                          rounded-lg p-4 text-center transition-colors relative
                          ${
                            isBooked
                              ? "bg-blue-600 text-white cursor-not-allowed"
                              : (() => {
                                  // Check if slot is in the past
                                  const [slotStart] = slot.split(" - ");
                                  const slotDate = new Date(selectedDayDate);
                                  const [hours, minutes] = slotStart
                                    .split(":")
                                    .map(Number);
                                  slotDate.setHours(hours, minutes, 0, 0);

                                  const isPastTime = slotDate < new Date();
                                  return isAvailable
                                    ? `bg-orange-500 text-white hover:bg-orange-600 ${
                                        isPastTime
                                          ? "cursor-not-allowed"
                                          : "cursor-pointer"
                                      }`
                                    : isPastTime
                                    ? "bg-slate-800 text-slate-500 cursor-not-allowed opacity-60"
                                    : "bg-slate-700 hover:bg-slate-600 cursor-pointer";
                                })()
                          }
                        `}
                      >
                        <div className="font-medium mb-1">{slot}</div>
                        <div className="text-sm text-slate-300">
                          {isBooked
                            ? "Booked"
                            : (() => {
                                // Check if slot is in the past
                                const [slotStart] = slot.split(" - ");
                                const slotDate = new Date(selectedDayDate);
                                const [hours, minutes] = slotStart
                                  .split(":")
                                  .map(Number);
                                slotDate.setHours(hours, minutes, 0, 0);

                                const isPastTime = slotDate < new Date();

                                if (isPastTime) {
                                  return "Past";
                                } else {
                                  return isAvailable
                                    ? "Available"
                                    : "Unavailable";
                                }
                              })()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-700 rounded-lg">
                  <p className="text-slate-400">
                    No time slots available for this day based on your work
                    hours and session settings.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Availability Preview */}
          <div>
            <h2 className="text-xl font-medium mb-2">Availability preview</h2>
            <p className="text-slate-400 mb-4">
              This is how your availability will appear to learners:
            </p>

            <div
              className="grid grid-cols-7 gap-4 mb-4"
              id="availabily-preview"
            >
              {weekDates.map((day) => {
                // Get booked slots for this day
                const dayData = weekAvailability?.days.find(
                  (d) => d.date === day.dateString
                );
                const bookedSlots =
                  dayData?.timeBlocks.filter(
                    (block) => block.sessionStatus.id !== 1
                  ) || [];
                // Get available slots for this day
                const daySlots = slotAvailability[day.dateString] || {};
                const bookedSlotTimes = bookedSlots.map(
                  (slot) => `${slot.startTime} - ${slot.endTime}`
                );
                const availableSlots = Object.entries(daySlots)
                  .filter(
                    ([slot, isAvailable]) =>
                      isAvailable && !bookedSlotTimes.includes(slot)
                  )
                  .map(([slot]) => slot);

                return (
                  <div key={day.dayShort} className="text-center">
                    <div className="font-medium">{day.dayShort}</div>
                    <div className="text-sm text-slate-400">
                      {day.displayDate}
                    </div>

                    <div className="mt-2 space-y-1">
                      {bookedSlots.map((slot, index) => (
                        <div
                          key={`booked-${index}`}
                          className="bg-blue-600 text-white text-xs py-1 px-2 rounded"
                        >
                          {slot.startTime} - {slot.endTime}
                        </div>
                      ))}

                      {availableSlots.length > 0 &&
                        availableSlots.map((slot, index) => (
                          <div
                            key={`avail-${index}`}
                            className="bg-orange-500 text-white text-xs py-1 px-2 rounded"
                          >
                            {slot}
                          </div>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 text-sm text-slate-400">
              <div>
                Working hours: {workHours.start} - {workHours.end} • Session:{" "}
                {sessionDuration} min • Buffer: {bufferTime} min
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded"></div>
                  <span>Booked</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityManager;
