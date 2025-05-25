import React from "react";
import { Camera } from "lucide-react";

interface ProfilePictureUploadProps {
  picturePreview: string | null;
  onPictureChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputId?: string;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  picturePreview,
  onPictureChange,
  inputId = "profilePictureInput",
}) => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative w-32 h-32 sm:w-36 sm:h-36">
        <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
          {picturePreview ? (
            <img
              src={picturePreview}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <Camera className="w-12 h-12 text-gray-500" />
          )}
        </div>
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
