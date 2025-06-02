// import { useState } from "react";
// import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";

// const AvailabilityManager = () => {
//   const [selectedDay, setSelectedDay] = useState("Sun");
//   const [workHours, setWorkHours] = useState({ start: "09:00", end: "17:00" });
//   const [sessionDuration, setSessionDuration] = useState("60 minutes");
//   const [bufferTime, setBufferTime] = useState("15 minutes");

//   const [slotAvailability, setSlotAvailability] = useState({
//     "09:00 - 10:00": false,
//     "10:15 - 11:15": false,
//     "11:30 - 12:30": false,
//     "12:45 - 13:45": false,
//     "14:00 - 15:00": false,
//     "15:15 - 16:15": false,
//   });

//   const days = [
//     { short: "Sun", full: "Sunday", date: "Jun 1" },
//     { short: "Mon", full: "Monday", date: "Jun 2" },
//     { short: "Tue", full: "Tuesday", date: "Jun 3" },
//     { short: "Wed", full: "Wednesday", date: "Jun 4" },
//     { short: "Thu", full: "Thursday", date: "Jun 5" },
//     { short: "Fri", full: "Friday", date: "Jun 6" },
//     { short: "Sat", full: "Saturday", date: "Jun 7" },
//   ];

//   const timeSlots = [
//     { time: "09:00 - 10:00", status: "Unavailable" },
//     { time: "10:15 - 11:15", status: "Unavailable" },
//     { time: "11:30 - 12:30", status: "Unavailable" },
//     { time: "12:45 - 13:45", status: "Unavailable" },
//     { time: "14:00 - 15:00", status: "Unavailable" },
//     { time: "15:15 - 16:15", status: "Unavailable" },
//   ];

//   const bookedSlots = {
//     Mon: [
//       { time: "10:15", label: "10:15 (booked)" },
//       { time: "14:00", label: "14:00 (booked)" },
//     ],
//     Wed: [
//       { time: "09:00", label: "09:00 (booked)" },
//       { time: "11:30", label: "11:30 (booked)" },
//     ],
//   };

//   const toggleSlot = (slotTime) => {
//     setSlotAvailability((prev) => ({
//       ...prev,
//       [slotTime]: !prev[slotTime],
//     }));
//   };

//   const selectAllSlots = () => {
//     const newAvailability = {};
//     timeSlots.forEach((slot) => {
//       newAvailability[slot.time] = true;
//     });
//     setSlotAvailability(newAvailability);
//   };

//   const clearAllSlots = () => {
//     const newAvailability = {};
//     timeSlots.forEach((slot) => {
//       newAvailability[slot.time] = false;
//     });
//     setSlotAvailability(newAvailability);
//   };

//   return (
//     <div className="min-h-screen bg-slate-800 text-white">
//       {/* Header */}
//       <div className="flex justify-between items-center p-6 border-b border-slate-700">
//         <h1 className="text-2xl font-semibold">Manage Your Availability</h1>
//         <button className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-medium transition-colors">
//           Save Changes
//         </button>
//       </div>

//       {/* Warning Banner */}
//       <div className="mx-6 mt-6 bg-orange-600 rounded-lg p-4 flex items-start gap-3">
//         <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
//         <div>
//           <div className="font-medium mb-1">
//             Some of your time slots are already booked.
//           </div>
//           <div className="text-sm text-orange-100">
//             You cannot modify work hours, session duration, or buffer time until
//             these bookings are completed or canceled.
//           </div>
//         </div>
//       </div>

//       <div className="flex gap-6 p-6">
//         {/* Left Sidebar */}
//         <div className="w-80 space-y-6">
//           {/* Work Hours */}
//           <div className="bg-slate-700 rounded-lg p-4">
//             <h3 className="text-lg font-medium mb-4">Work hours</h3>
//             <div className="grid grid-cols-2 gap-4 mb-3">
//               <div>
//                 <label className="block text-sm text-slate-300 mb-2">
//                   Start time
//                 </label>
//                 <select
//                   value={workHours.start}
//                   onChange={(e) =>
//                     setWorkHours({ ...workHours, start: e.target.value })
//                   }
//                   className="w-full bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white"
//                 >
//                   <option value="09:00">09:00</option>
//                   <option value="08:00">08:00</option>
//                   <option value="10:00">10:00</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm text-slate-300 mb-2">
//                   End time
//                 </label>
//                 <select
//                   value={workHours.end}
//                   onChange={(e) =>
//                     setWorkHours({ ...workHours, end: e.target.value })
//                   }
//                   className="w-full bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white"
//                 >
//                   <option value="17:00">17:00</option>
//                   <option value="16:00">16:00</option>
//                   <option value="18:00">18:00</option>
//                 </select>
//               </div>
//             </div>
//             <p className="text-sm text-slate-400">
//               Cannot change work hours while you have booked sessions.
//             </p>
//           </div>

//           {/* Session Settings */}
//           <div className="bg-slate-700 rounded-lg p-4">
//             <h3 className="text-lg font-medium mb-4">Session settings</h3>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm text-slate-300 mb-2">
//                   Session duration
//                 </label>
//                 <select
//                   value={sessionDuration}
//                   onChange={(e) => setSessionDuration(e.target.value)}
//                   className="w-full bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white"
//                 >
//                   <option value="60 minutes">60 minutes</option>
//                   <option value="30 minutes">30 minutes</option>
//                   <option value="90 minutes">90 minutes</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm text-slate-300 mb-2">
//                   Buffer time between sessions
//                 </label>
//                 <select
//                   value={bufferTime}
//                   onChange={(e) => setBufferTime(e.target.value)}
//                   className="w-full bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white"
//                 >
//                   <option value="15 minutes">15 minutes</option>
//                   <option value="10 minutes">10 minutes</option>
//                   <option value="30 minutes">30 minutes</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Calendar Navigation */}
//           <div className="bg-slate-700 rounded-lg p-4">
//             <h3 className="text-lg font-medium mb-4">Calendar Navigation</h3>
//             <div className="flex items-center justify-between mb-4">
//               <button className="p-1 hover:bg-slate-600 rounded">
//                 <ChevronLeft className="w-5 h-5" />
//               </button>
//               <span className="font-medium">Jun 1 - Jun 7</span>
//               <button className="p-1 hover:bg-slate-600 rounded">
//                 <ChevronRight className="w-5 h-5" />
//               </button>
//             </div>
//             <button className="w-full bg-slate-600 hover:bg-slate-500 py-2 rounded transition-colors">
//               Go to current week
//             </button>
//           </div>

//           {/* Bulk Actions */}
//           <div className="bg-slate-700 rounded-lg p-4">
//             <h3 className="text-lg font-medium mb-4">Bulk actions</h3>
//             <div className="space-y-2">
//               <button
//                 onClick={selectAllSlots}
//                 className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded transition-colors"
//               >
//                 Select all slots for Sun Jun 1
//               </button>
//               <button
//                 onClick={clearAllSlots}
//                 className="w-full bg-slate-600 hover:bg-slate-500 py-2 rounded transition-colors"
//               >
//                 Clear all slots for Sun Jun 1
//               </button>
//               <button className="w-full bg-green-600 hover:bg-green-700 py-2 rounded transition-colors">
//                 Copy schedule to all days
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="flex-1">
//           {/* Day Tabs */}
//           <div className="flex mb-6">
//             {days.map((day) => (
//               <button
//                 key={day.short}
//                 onClick={() => setSelectedDay(day.short)}
//                 className={`flex-1 py-3 px-4 text-center border-r border-slate-600 last:border-r-0 transition-colors ${
//                   selectedDay === day.short
//                     ? "bg-orange-500 text-white"
//                     : "bg-slate-700 hover:bg-slate-600 text-slate-300"
//                 }`}
//               >
//                 <div className="font-medium">{day.short}</div>
//                 <div className="text-sm">{day.date}</div>
//                 {(day.short === "Mon" || day.short === "Wed") && (
//                   <div className="w-2 h-2 bg-blue-400 rounded-full mx-auto mt-1"></div>
//                 )}
//               </button>
//             ))}
//           </div>

//           {/* Time Slots */}
//           <div className="mb-8">
//             <h2 className="text-xl font-medium mb-4">
//               Set your availability for{" "}
//               {days.find((d) => d.short === selectedDay)?.full},{" "}
//               {days.find((d) => d.short === selectedDay)?.date}
//             </h2>
//             <div className="grid grid-cols-5 gap-4">
//               {timeSlots.map((slot, index) => (
//                 <div
//                   key={index}
//                   onClick={() => toggleSlot(slot.time)}
//                   className={`rounded-lg p-4 text-center cursor-pointer transition-colors ${
//                     slotAvailability[slot.time]
//                       ? "bg-orange-500 text-white hover:bg-orange-600"
//                       : "bg-slate-700 hover:bg-slate-600"
//                   }`}
//                 >
//                   <div className="font-medium mb-1">{slot.time}</div>
//                   <div className="text-sm text-slate-300">
//                     {slotAvailability[slot.time] ? "Available" : "Unavailable"}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Availability Preview */}
//           <div>
//             <h2 className="text-xl font-medium mb-2">Availability preview</h2>
//             <p className="text-slate-400 mb-4">
//               This is how your availability will appear to learners:
//             </p>

//             <div className="grid grid-cols-7 gap-4 mb-4">
//               {days.map((day) => (
//                 <div key={day.short} className="text-center">
//                   <div className="font-medium">{day.short}</div>
//                   <div className="text-sm text-slate-400">{day.date}</div>
//                   <div className="mt-2 space-y-1">
//                     {bookedSlots[day.short]?.map((slot, index) => (
//                       <div
//                         key={index}
//                         className="bg-blue-600 text-white text-xs py-1 px-2 rounded"
//                       >
//                         {slot.label}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="flex items-center gap-6 text-sm text-slate-400">
//               <div>
//                 Working hours: 09:00 - 17:00 • Session duration: 60 min •
//                 Buffer: 15 min
//               </div>
//               <div className="flex items-center gap-4">
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 bg-orange-500 rounded"></div>
//                   <span>Available</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 bg-blue-600 rounded"></div>
//                   <span>Booked</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AvailabilityManager;
