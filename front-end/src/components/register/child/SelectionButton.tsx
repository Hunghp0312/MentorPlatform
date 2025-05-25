import React from "react";
import { cn } from "../../../utils/cn"; // Adjust path as needed

interface SelectionButtonProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}

const SelectionButton: React.FC<SelectionButtonProps> = ({
  label,
  isSelected,
  onClick,
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full px-4 py-2.5 rounded-lg text-sm border font-medium transition-colors focus:outline-none focus:ring-2",
        isSelected
          ? "bg-orange-500 text-white border-orange-500 ring-orange-500"
          : "bg-gray-700 border-gray-600 hover:bg-gray-650 text-gray-300 hover:text-white ring-gray-600 focus:ring-orange-500",
        className
      )}>
      {label}
    </button>
  );
};

export default SelectionButton;
