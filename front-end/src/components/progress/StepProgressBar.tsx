import React from "react";

interface StepProgressBarProps {
  step: number;
  totalSteps: number;
}

const StepProgressBar: React.FC<StepProgressBarProps> = ({
  step,
  totalSteps,
}) => {
  const progress = (step / totalSteps) * 100;

  return (
    <div className="w-full max-w-md mb-8">
      <div className="flex justify-between text-sm text-gray-300 mb-1">
        <span className="text-white font-medium">
          Step {step} of {totalSteps}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-700 rounded-full">
        <div
          className="h-full bg-orange-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default StepProgressBar;
