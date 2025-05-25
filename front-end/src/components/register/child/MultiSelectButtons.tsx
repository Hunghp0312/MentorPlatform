import React from "react";
import { cn } from "../../../utils/cn"; // Adjust path as needed

interface MultiSelectButtonsProps {
  label: string;
  options: string[];
  selectedOptions: string[];
  onToggleSelect: (option: string) => void;
  gridColsClass?: string;
  isRequired?: boolean;
  id?: string;
}

const MultiSelectButtons: React.FC<MultiSelectButtonsProps> = ({
  label,
  options,
  selectedOptions,
  onToggleSelect,
  gridColsClass = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
  isRequired = false,
  id,
}) => {
  return (
    <div id={id}>
      <label className="text-base font-medium text-gray-300 block mb-3">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </label>
      <div className={`grid ${gridColsClass} gap-2.5 w-full`}>
        {options.map((item, index) => (
          <button
            id={id && index === 0 ? `${id}-first-option` : undefined}
            type="button"
            key={item}
            onClick={() => onToggleSelect(item)}
            className={cn(
              "w-full px-4 py-2 rounded-lg text-sm border font-medium transition-colors",
              selectedOptions.includes(item)
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-300 hover:text-white"
            )}>
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MultiSelectButtons;
