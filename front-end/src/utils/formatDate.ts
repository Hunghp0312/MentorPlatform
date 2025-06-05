export const formatTime = (time: string): string => {
    // Check if it's a time range (contains a dash)
    if (time.includes('-')) {
        const [startTime, endTime] = time.split('-').map(t => t.trim());
        
        // Format start time
        const startTimeParts = startTime.split(':');
        const startHours = parseInt(startTimeParts[0]);
        const startMinutes = parseInt(startTimeParts[1] || '0');
        const startIsPM = startHours >= 12;
        const startDisplayHour = startHours % 12 || 12;
        const formattedStart = `${startDisplayHour}:${startMinutes.toString().padStart(2, '0')}${startIsPM ? 'PM' : 'AM'}`;
        
        // Format end time
        const endTimeParts = endTime.split(':');
        const endHours = parseInt(endTimeParts[0]);
        const endMinutes = parseInt(endTimeParts[1] || '0');
        const endIsPM = endHours >= 12;
        const endDisplayHour = endHours % 12 || 12;
        const formattedEnd = `${endDisplayHour}:${endMinutes.toString().padStart(2, '0')}${endIsPM ? 'PM' : 'AM'}`;
        
        return `${formattedStart} - ${formattedEnd}`;
    }

    // Parse the time string
    const timeWithoutSpaces = time.replace(/\s+/g, '');
    const [hoursStr, minutesStr] = timeWithoutSpaces.split(':');
    const hours = parseInt(hoursStr);
    const minutes = parseInt(minutesStr || '0');

    // Convert to 12-hour format
    const isPM = hours >= 12;
    const displayHour = hours % 12 || 12; // 0 should be displayed as 12

    return `${displayHour}:${minutes.toString().padStart(2, '0')} ${isPM ? 'PM' : 'AM'}`;
}