import { Loader2 } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950">
      <div className="flex flex-col items-center justify-center space-y-6 px-4 text-center">
        <div className="relative">
          {/* Outer spinning ring */}
          <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-gray-700 border-t-gray-400"></div>

          {/* Inner spinning icon */}
          <Loader2 className="h-16 w-16 animate-spin text-gray-400" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-medium text-white">Loading</h2>
          <p className="text-sm text-gray-400">
            Please wait while we prepare your content...
          </p>
        </div>

        {/* Loading progress bar */}
        <div className="w-full max-w-xs">
          <div className="h-1 w-full overflow-hidden rounded-full bg-gray-800">
            <div className="animate-pulse-x h-full w-1/2 rounded-full bg-gray-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
