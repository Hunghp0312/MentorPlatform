import LoadingSpinner from "./LoadingSpinner";
interface LoadingOverlayProps {
  message?: string;
  fullScreen?: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = "Loading...",
  fullScreen = false,
}) => {
  return (
    <div
      className={`flex items-center justify-center bg-gray-500/20 backdrop-blur-sm ${
        fullScreen ? "fixed inset-0 z-50" : "absolute inset-0 z-10 "
      }`}
    >
      <div className="flex flex-col items-center justify-center space-y-4 rounded-lg bg-gray-900 p-6 shadow-lg">
        <LoadingSpinner size="lg" />
        <p className="text-center text-white">{message}</p>
      </div>
    </div>
  );
};
export default LoadingOverlay;
