import { Loader2 } from "lucide-react";
const SmallLoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-full bg-gray-700 rounded-lg">
      <div className="flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-gray-400 h-8 w-8" />
        <p className="text-center text-gray-400">Loading details...</p>
      </div>
    </div>
  );
};

export default SmallLoadingSpinner;
