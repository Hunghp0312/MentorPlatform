import { useState } from "react";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
interface InputDateProps {
  value: Date;
  onChange: (value: Date, name: string) => void;
  name: string;
  label?: string;
  isRequired?: boolean;
}
const InputDate: React.FC<InputDateProps> = ({
  value,
  onChange,
  name,
  label,
  isRequired = false,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  return (
    <>
      {/* Published Date Field */}
      <div className="relative">
        {label && (
          <label
            htmlFor={name}
            className="text-sm font-medium text-gray-300 block mb-2"
          >
            {label} {isRequired && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            type="text"
            id={name}
            name={name}
            placeholder="YYYY-MM-DD"
            value={format(value, "yyyy-MM-dd")}
            onChange={(e) =>
              onChange(new Date(e.target.value), "publishedDate")
            }
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-gray-600"
            aria-label="Published date"
            aria-describedby="date-format-hint"
          />
          <button
            type="button"
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 p-1 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-600"
            aria-label="Toggle date picker"
          >
            <Calendar className="h-5 w-5" />
          </button>
        </div>

        {showDatePicker && (
          <div className="absolute z-10 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg p-4 w-64">
            <div className="flex justify-between items-center mb-2">
              <button
                type="button"
                onClick={() => {
                  const newDate = new Date(value);
                  newDate.setMonth(newDate.getMonth() - 1);
                  onChange(newDate, name);
                }}
                className="p-1 rounded-md hover:bg-gray-700 text-gray-400 hover:text-gray-300"
                aria-label="Previous month"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <div className="flex items-center space-x-1">
                <select
                  value={value.getMonth()}
                  onChange={(e) => {
                    const newDate = new Date(value);
                    newDate.setMonth(Number.parseInt(e.target.value));
                    onChange(newDate, name);
                  }}
                  className="bg-gray-700 text-white border-none rounded py-1 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600"
                  aria-label="Select month"
                >
                  {[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ].map((month, index) => (
                    <option key={month} value={index}>
                      {month}
                    </option>
                  ))}
                </select>

                <select
                  value={value.getFullYear()}
                  onChange={(e) => {
                    const newDate = new Date(value);
                    newDate.setFullYear(Number.parseInt(e.target.value));
                    onChange(newDate, name);
                  }}
                  className="bg-gray-700 text-white border-none rounded py-1 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600"
                  aria-label="Select year"
                >
                  {Array.from(
                    { length: 100 },
                    (_, i) => new Date().getFullYear() - 99 + i
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newDate = new Date(value);
                  newDate.setMonth(newDate.getMonth() + 1);
                  onChange(newDate, name);
                }}
                className="p-1 rounded-md hover:bg-gray-700 text-gray-400 hover:text-gray-300"
                aria-label="Next month"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>

            {/* Day names header */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div
                  key={day}
                  className="h-8 flex items-center justify-center text-xs text-gray-500 font-medium"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {(() => {
                const year = value.getFullYear();
                const month = value.getMonth();
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                const firstDayOfMonth = new Date(year, month, 1).getDay();

                // Create array for all days in the month plus empty spots for alignment
                const days = [];

                // Add empty cells for days before the first day of the month
                for (let i = 0; i < firstDayOfMonth; i++) {
                  days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
                }

                // Add days of the month
                for (let day = 1; day <= daysInMonth; day++) {
                  const date = new Date(year, month, day);
                  const isSelected =
                    date.getDate() === value.getDate() &&
                    date.getMonth() === value.getMonth() &&
                    date.getFullYear() === value.getFullYear();

                  const isToday =
                    date.getDate() === new Date().getDate() &&
                    date.getMonth() === new Date().getMonth() &&
                    date.getFullYear() === new Date().getFullYear();

                  days.push(
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        const newDate = new Date(value);
                        newDate.setDate(day);
                        onChange(newDate, name);
                        setShowDatePicker(false);
                      }}
                      className={`h-8 w-8 rounded-full flex items-center justify-center text-sm focus:outline-none focus:ring-1 focus:ring-gray-600 ${
                        isSelected
                          ? "bg-gray-600 text-white"
                          : isToday
                          ? "border border-gray-600 text-gray-300 hover:bg-gray-700"
                          : "text-gray-300 hover:bg-gray-700"
                      }`}
                      aria-label={`Select ${format(
                        new Date(year, month, day),
                        "MMMM d, yyyy"
                      )}`}
                      aria-selected={isSelected}
                    >
                      {day}
                    </button>
                  );
                }

                return days;
              })()}
            </div>

            {/* Quick actions */}
            <div className="mt-3 flex justify-between">
              <button
                type="button"
                onClick={() => {
                  onChange(new Date(), name);
                }}
                className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
              >
                Today
              </button>

              <button
                type="button"
                onClick={() => setShowDatePicker(false)}
                className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default InputDate;
