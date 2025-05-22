// ProfileCreatePanel.tsx
import React, { useState, useEffect } from "react";
import InputCustom from "../../input/InputCustom";
import ProfilePictureUpload from "../child/ProfilePictureUpload";
import RoleSelectionCard from "../child/RoleSelectionCard";
import MultiSelectButtons from "../child/MultiSelectButtons";
import CommunicationMethodButton from "../child/CommunicationMethodButton";
import { Video, Headphones, MessageCircle } from "lucide-react";
import {
  ProfileDetails,
  Role,
  CommunicationMethod,
} from "../../../types/userRegister.d"; // Adjust path

interface Props {
  profileData: ProfileDetails;
  onProfileChange: (field: keyof ProfileDetails, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const rolesData = [
  { name: "Learner" as Role, subtext: "I want to find mentors", icon: "👨‍🎓" },
  { name: "Mentor" as Role, subtext: "I want to mentor others", icon: "👨‍🏫" },
];

const expertiseOptions = [
  "Leadership",
  "Programming",
  "Design",
  "Marketing",
  "Data Science",
  "Business",
  "Project Management",
  "Communication",
];
const availabilityOptions = [
  "Weekdays",
  "Weekends",
  "Mornings",
  "Afternoons",
  "Evenings",
];
const communicationMethodsData = [
  {
    value: "Video Call" as CommunicationMethod,
    label: "Video Call",
    icon: <Video size={20} />,
  },
  {
    value: "Audio Call" as CommunicationMethod,
    label: "Audio Call",
    icon: <Headphones size={20} />,
  },
  {
    value: "Text Chat" as CommunicationMethod,
    label: "Text Chat",
    icon: <MessageCircle size={20} />,
  },
];

const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png"];

const ProfileCreatePanel: React.FC<Props> = ({
  profileData,
  onProfileChange,
  onNext,
  onBack,
}) => {
  const [profilePictureError, setProfilePictureError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [bioError, setBioError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [expertiseError, setExpertiseError] = useState("");
  const [skillsError, setSkillsError] = useState(""); // For InputTag's own error message prop
  const [experienceError, setExperienceError] = useState("");
  const [availabilityError, setAvailabilityError] = useState("");

  const [profilePicturePreview, setProfilePicturePreview] = useState<
    string | null
  >(null);
  const [firstErrorFieldId, setFirstErrorFieldId] = useState<string | null>(
    null
  );

  // Sync profile picture preview if file changes from parent (e.g., on back and forth navigation)
  useEffect(() => {
    if (profileData.profilePictureFile) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setProfilePicturePreview(reader.result as string);
      reader.readAsDataURL(profileData.profilePictureFile);
    } else {
      setProfilePicturePreview(null);
    }
  }, [profileData.profilePictureFile]);

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProfilePictureError("");
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (
        !ALLOWED_FILE_TYPES.includes(file.type) ||
        file.size > MAX_FILE_SIZE_BYTES
      ) {
        setProfilePictureError(
          `Please select a .png or .jpg file (max ${MAX_FILE_SIZE_MB}MB)`
        );
        onProfileChange("profilePictureFile", null);
        e.target.value = "";
        return;
      }
      onProfileChange("profilePictureFile", file);
    } else {
      onProfileChange("profilePictureFile", null);
    }
  };

  const toggleMultiSelect = (
    option: string,
    field: keyof Pick<ProfileDetails, "expertise" | "availability">,
    errorSetter?: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const currentSelection = profileData[field] as string[];
    const newSelection = currentSelection.includes(option)
      ? currentSelection.filter((item) => item !== option)
      : [...currentSelection, option];
    onProfileChange(field, newSelection);
    errorSetter?.("");
  };

  const validateAndSetFocusTarget = () => {
    let isValid = true;
    let focusTargetId: string | null = null;

    const {
      fullName,
      bio,
      phoneNumber,
      expertise,
      skills,
      industryExperience,
      availability,
      role,
    } = profileData;

    if (!fullName.trim()) {
      setFullNameError("Full name is required.");
      focusTargetId ??= "fullName";
      isValid = false;
    } else if (fullName.trim().length < 2 || fullName.trim().length > 100) {
      setFullNameError("Must be 2-100 characters.");
      focusTargetId ??= "fullName";
      isValid = false;
    } else {
      setFullNameError("");
    }

    if (!bio.trim()) {
      setBioError("Bio is required.");
      focusTargetId ??= "bio";
      isValid = false;
    } else if (bio.trim().length > 1000) {
      setBioError("Max 1000 characters.");
      focusTargetId ??= "bio";
      isValid = false;
    } else {
      setBioError("");
    }

    if (phoneNumber && !/^\d+$/.test(phoneNumber.replace(/\s+/g, ""))) {
      setPhoneNumberError("Digits only.");
      focusTargetId ??= "phoneNumber";
      isValid = false;
    } else if (phoneNumber && phoneNumber.replace(/\s+/g, "").length > 15) {
      setPhoneNumberError("Max 15 digits.");
      focusTargetId ??= "phoneNumber";
      isValid = false;
    } else {
      setPhoneNumberError("");
    }

    if (expertise.length === 0) {
      setExpertiseError("Select at least one expertise.");
      focusTargetId ??= "expertiseGroup";
      isValid = false;
    } else {
      setExpertiseError("");
    }

    // InputTag handles its own length validation, skills here refers to the array.
    // If skills array must not be empty:
    if (skills.length === 0) {
      setSkillsError("At least one skill is required.");
      focusTargetId ??= "professionalSkillsInputTag";
      isValid = false;
    } else {
      setSkillsError("");
    }

    const isExperienceRequired = role === "Mentor";
    if (isExperienceRequired && !industryExperience.trim()) {
      setExperienceError("Experience required for Mentors.");
      focusTargetId ??= "industryExperience";
      isValid = false;
    } else if (industryExperience.trim().length > 100) {
      setExperienceError("Max 100 characters.");
      focusTargetId ??= "industryExperience";
      isValid = false;
    } // Example max length
    else {
      setExperienceError("");
    }

    if (availability.length === 0) {
      setAvailabilityError("Select at least one availability.");
      focusTargetId ??= "availabilityGroup";
      isValid = false;
    } else {
      setAvailabilityError("");
    }

    setFirstErrorFieldId(focusTargetId);
    return isValid;
  };

  useEffect(() => {
    if (firstErrorFieldId) {
      const elementToFocus = document.getElementById(firstErrorFieldId);
      if (elementToFocus) {
        elementToFocus.focus();
        elementToFocus.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      setFirstErrorFieldId(null);
    }
  }, [firstErrorFieldId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Clear all local error states before re-validating
    setProfilePictureError("");
    setFullNameError("");
    setBioError("");
    setPhoneNumberError("");
    setExpertiseError("");
    setSkillsError("");
    setExperienceError("");
    setAvailabilityError("");

    if (validateAndSetFocusTarget()) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-white pb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
        <div className="md:col-span-1">
          <ProfilePictureUpload
            picturePreview={profilePicturePreview}
            onPictureChange={handleProfilePictureChange}
            inputId="profilePictureActualInput"
          />
          {profilePictureError && (
            <p className="text-sm text-red-500 mt-1 text-center">
              {profilePictureError}
            </p>
          )}
        </div>
        <div className="md:col-span-2 space-y-6">
          <InputCustom
            label="Full Name"
            name="fullName"
            type="text"
            value={profileData.fullName}
            onChange={(e) => onProfileChange("fullName", e.target.value)}
            placeholder="Your full name"
            isRequired
            errorMessage={fullNameError}
            className="bg-gray-800 border-gray-700"
          />
          <InputCustom
            label="Bio"
            name="bio"
            type="textarea"
            value={profileData.bio}
            onChange={(e) => onProfileChange("bio", e.target.value)}
            placeholder="A brief introduction about yourself…"
            isRequired
            errorMessage={bioError}
            className="min-h-[100px] bg-gray-800 border-gray-700 p-3"
          />
          <InputCustom
            label="Phone number"
            name="phoneNumber"
            type="tel"
            value={profileData.phoneNumber || ""}
            onChange={(e) => onProfileChange("phoneNumber", e.target.value)}
            placeholder="Your phone number (optional)"
            errorMessage={phoneNumberError}
            className="bg-gray-800 border-gray-700"
          />
        </div>
      </div>

      <div>
        <label className="text-base font-medium text-gray-300 block mb-3">
          I am joining as <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-4 w-full">
          {rolesData.map((roleOpt) => (
            <RoleSelectionCard
              key={roleOpt.name}
              role={roleOpt}
              isSelected={profileData.role === roleOpt.name}
              onClick={() => onProfileChange("role", roleOpt.name)}
            />
          ))}
        </div>
      </div>

      <div id="expertiseGroup">
        {" "}
        {/* ID for focusing the group */}
        <MultiSelectButtons
          label="Areas of Expertise"
          options={expertiseOptions}
          selectedOptions={profileData.expertise}
          onToggleSelect={(option) =>
            toggleMultiSelect(option, "expertise", setExpertiseError)
          }
          gridColsClass="grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
          isRequired
        />
        {expertiseError && (
          <p className="text-sm text-red-500 mt-1">{expertiseError}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputCustom
          name="professionalSkillsInputTag" // ID for focusing
          label="Professional Skills"
          type="text"
          value={profileData.skills.join(", ")} // Assuming skills is an array of strings
          onChange={(e) =>
            onProfileChange(
              "skills",
              e.target.value.split(",").map((s) => s.trim())
            )
          }
          placeholder="Type and press Enter"
          errorMessage={skillsError} // Show parent error
          className="bg-gray-800 border-gray-700"
          isRequired
        />
        <InputCustom
          label="Industry Experience"
          name="industryExperience"
          type="text"
          value={profileData.industryExperience}
          onChange={(e) =>
            onProfileChange("industryExperience", e.target.value)
          }
          placeholder="e.g., 5 years in Tech"
          isRequired={profileData.role === "Mentor"}
          errorMessage={experienceError}
          className="bg-gray-800 border-gray-700"
        />
      </div>

      <div id="availabilityGroup">
        {" "}
        {/* ID for focusing the group */}
        <MultiSelectButtons
          label="Your Availability"
          options={availabilityOptions}
          selectedOptions={profileData.availability}
          onToggleSelect={(option) =>
            toggleMultiSelect(option, "availability", setAvailabilityError)
          }
          gridColsClass="grid-cols-2 sm:grid-cols-3 md:grid-cols-5"
          isRequired
        />
        {availabilityError && (
          <p className="text-sm text-red-500 mt-1">{availabilityError}</p>
        )}
      </div>

      <div>
        <label className="text-base font-medium text-gray-300 block mb-2">
          Preferred Communication Method <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
          {communicationMethodsData.map((method) => (
            <CommunicationMethodButton
              key={method.value}
              method={method}
              isSelected={profileData.preferredCommunication === method.value}
              onClick={() =>
                onProfileChange("preferredCommunication", method.value)
              }
            />
          ))}
        </div>
      </div>

      {/* Learning Goals removed as it's now in PreferenceSetupPanel */}

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto flex-1 py-3 px-5 border border-gray-600 bg-gray-700 hover:bg-gray-600 transition rounded-lg text-gray-300 font-semibold">
          Back
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto flex-1 py-3 px-5 bg-orange-500 hover:bg-orange-600 transition rounded-lg text-white font-semibold">
          Continue to Preferences
        </button>
      </div>
    </form>
  );
};

export default ProfileCreatePanel;
