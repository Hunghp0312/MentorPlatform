import React from "react";
import { cn } from "../../../utils/cn"; // Adjust path as needed
import { Role as AppRole } from "../../../types/userRegister.d"; // Import the Role enum, aliased as AppRole to avoid naming conflict

// Define the structure of the role data object expected by this component
interface RoleUIData {
  name: AppRole; // This 'name' is now the enum value (e.g., AppRole.Learner)
  subtext: string;
  icon: string;
}

interface RoleSelectionCardProps {
  role: RoleUIData; // Use the new interface
  isSelected: boolean;
  onClick: () => void;
}

const RoleSelectionCard: React.FC<RoleSelectionCardProps> = ({
  role,
  isSelected,
  onClick,
}) => {
  // To display the string name of the enum (e.g., "Learner", "Mentor")
  const roleNameString = AppRole[role.name];

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
      <span className="font-semibold text-base mb-0.5">
        {roleNameString}
      </span>{" "}
      {/* Display the string name */}
      <span className="text-xs opacity-80">{role.subtext}</span>
    </button>
  );
};

export default RoleSelectionCard;
