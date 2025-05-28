import React from "react";
import { Camera, X } from "lucide-react";

interface ProfilePictureUploadProps {
  picturePreview: string | null;
  onPictureChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeletePicture: () => void; // New prop
  inputId?: string;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  picturePreview,
  onPictureChange,
  onDeletePicture,
  inputId = "profilePictureInput",
}) => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative w-32 h-32 sm:w-36 sm:h-36">
        <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center overflow-hidden relative">
          {picturePreview ? (
            <img
              src={picturePreview}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <Camera className="w-12 h-12 text-gray-500" />
          )}

          {/* Delete button */}
        </div>
        {picturePreview && (
          <button
            type="button"
            onClick={onDeletePicture}
            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-md"
            aria-label="Delete picture">
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Upload button */}
        <label
          htmlFor={inputId}
          className="absolute -bottom-1 -right-1 bg-orange-500 p-2.5 rounded-full cursor-pointer hover:bg-orange-600 transition-colors shadow-md">
          <Camera className="w-5 h-5 text-white" />
          <input
            id={inputId}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPictureChange}
          />
        </label>
      </div>
      <p className="text-sm text-gray-400">Upload a professional photo</p>
    </div>
  );
};

export default ProfilePictureUpload;
