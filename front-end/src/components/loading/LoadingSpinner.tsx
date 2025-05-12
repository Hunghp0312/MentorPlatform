import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  text,
  className = "",
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <Loader2 className={`animate-spin text-gray-400 ${sizeClasses[size]}`} />
      {text && <p className="text-sm text-gray-400">{text}</p>}
    </div>
  );
};
export default LoadingSpinner;
