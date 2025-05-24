import React from "react";
import { cn } from "../../../utils/cn"; // Adjust path as needed

interface CommunicationMethod {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface CommunicationMethodButtonProps {
  method: CommunicationMethod;
  isSelected: boolean;
  onClick: () => void;
}

const CommunicationMethodButton: React.FC<CommunicationMethodButtonProps> = ({
  method,
  isSelected,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-lg border font-medium transition-colors text-sm",
        isSelected
          ? "bg-orange-500 text-white border-orange-500"
          : "bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-300 hover:text-white"
      )}>
      {method.icon}
      <span>{method.label}</span>
    </button>
  );
};

export default CommunicationMethodButton;
