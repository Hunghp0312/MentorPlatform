import React from "react";
import { cn } from "../../../utils/cn"; // Adjust path as needed

interface Role {
  name: string;
  subtext: string;
  icon: string;
}

interface RoleSelectionCardProps {
  role: Role;
  isSelected: boolean;
  onClick: () => void;
}

const RoleSelectionCard: React.FC<RoleSelectionCardProps> = ({
  role,
  isSelected,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all duration-200 ease-in-out hover:scale-[1.01]",
        isSelected
          ? "bg-orange-500 border-orange-600 text-white shadow-md"
          : "bg-gray-700 border-gray-600 hover:bg-gray-650 text-gray-300 hover:text-white"
      )}>
      <span className="text-2xl mb-2">{role.icon}</span>
      <span className="font-semibold text-base mb-0.5">{role.name}</span>
      <span className="text-xs opacity-80">{role.subtext}</span>
    </button>
  );
};

export default RoleSelectionCard;
