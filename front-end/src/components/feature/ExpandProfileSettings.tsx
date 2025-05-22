import { useState } from "react";

interface ExpandProfileSettingsProps {
  additionalSettings?: React.ReactNode;
}

const ExpandProfileSettings: React.FC<ExpandProfileSettingsProps> = ({
  additionalSettings,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="pt-4 border-t border-gray-700">
      <button
        onClick={toggleExpand}
        className="text-orange-500 hover:text-orange-400 text-sm flex items-center"
      >
        <span>
          {isExpanded
            ? "Hide Additional Profile Settings"
            : "View Additional Profile Settings"}
        </span>
        <svg
          className={`w-4 h-4 ml-1 transform ${isExpanded ? "rotate-90" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
      {isExpanded && (
        <div className="mt-4 text-gray-300">
          {additionalSettings ??
            "Additional profile settings content goes here."}
        </div>
      )}
    </div>
  );
};

export default ExpandProfileSettings;
