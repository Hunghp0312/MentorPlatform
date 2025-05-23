import React, { useState, useEffect } from "react";
import InputCustom from "../../input/InputCustom";
import ProfilePictureUpload from "../child/ProfilePictureUpload";
import RoleSelectionCard from "../child/RoleSelectionCard";
import MultiSelectButtons from "../child/MultiSelectButtons";
import { Video, Headphones, MessageCircle } from "lucide-react";
import {
  UserRegistrationRequest,
  SharedProfileDetails,
  Role,
  CommunicationMethod,
} from "../../../types/userRegister.d";

interface Props {
  currentUserData: UserRegistrationRequest;
  onUpdateProfile: (updates: Partial<SharedProfileDetails>) => void;
  onRoleChange: (newRole: Role) => void;
  onNext: () => void;
  onBack: () => void;
}

const rolesData = [
  { name: Role.Learner, subtext: "I want to find mentors", icon: "👨‍🎓" },
  { name: Role.Mentor, subtext: "I want to mentor others", icon: "👨‍🏫" },
];
const expertiseOptionsData = [
  "Leadership",
  "Programming",
  "Design",
  "Marketing",
  "Data Science",
  "Business",
  "Project Management",
  "Communication",
];
const availabilityOptionsData = [
  "Weekdays",
  "Weekends",
  "Mornings",
  "Afternoons",
  "Evenings",
];

const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png"];

const ProfileCreatePanel: React.FC<Props> = ({
  currentUserData,
  onUpdateProfile,
  onRoleChange,
  onNext,
  onBack,
}) => {
  const { role, profile } = currentUserData;

  const [profilePictureError, setProfilePictureError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [bioError, setBioError] = useState("");
  const [expertiseError, setExpertiseError] = useState("");
  const [skillsError, setSkillsError] = useState("");
  const [industryExperienceError, setIndustryExperienceError] = useState("");
  const [availabilityError, setAvailabilityError] = useState("");

  const [profilePicturePreview, setProfilePicturePreview] = useState<
    string | null
  >(null);
  const [firstErrorFieldId, setFirstErrorFieldId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (profile.profilePictureFile) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setProfilePicturePreview(reader.result as string);
      reader.readAsDataURL(profile.profilePictureFile);
    } else {
      setProfilePicturePreview(null);
    }
  }, [profile.profilePictureFile]);

  const handleFieldChange = (field: keyof SharedProfileDetails, value: any) => {
    onUpdateProfile({ [field]: value });
  };

  const handleMultiSelectToggle = (
    option: string,
    currentSelection: string[] | undefined,
    field: keyof Pick<
      SharedProfileDetails,
      "expertise" | "availability" | "skills"
    >,
    errorSetter?: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const safeCurrentSelection = currentSelection || [];
    const newSelection = safeCurrentSelection.includes(option)
      ? safeCurrentSelection.filter((item) => item !== option)
      : [...safeCurrentSelection, option];
    handleFieldChange(field, newSelection);
    errorSetter?.("");
  };

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
        setProfilePictureError(`PNG/JPG only, max ${MAX_FILE_SIZE_MB}MB`);
        handleFieldChange("profilePictureFile", null);
        e.target.value = "";
        return;
      }
      handleFieldChange("profilePictureFile", file);
    } else {
      handleFieldChange("profilePictureFile", null);
    }
  };

  const validateAndSetFocusTarget = () => {
    let isValid = true;
    let focusTargetId: string | null = null;

    if (!profile.fullName.trim()) {
      setFullNameError("Full name is required.");
      focusTargetId ??= "profileFullName";
      isValid = false;
    } else {
      setFullNameError("");
    }

    if (!profile.bio.trim()) {
      setBioError("Bio is required.");
      focusTargetId ??= "profileBio";
      isValid = false;
    } else {
      setBioError("");
    }

    if (profile.expertise.length === 0) {
      setExpertiseError("Select at least one expertise area.");
      focusTargetId ??= "profileExpertiseGroup";
      isValid = false;
    } else {
      setExpertiseError("");
    }

    if (
      role === Role.Mentor &&
      (!profile.skills || profile.skills.length === 0)
    ) {
      setSkillsError("Skills are required for Mentors.");
      focusTargetId ??= "profileSkillsInputTag";
      isValid = false;
    } else {
      setSkillsError("");
    }

    if (role === Role.Mentor && !profile.industryExperience?.trim()) {
      setIndustryExperienceError(
        "Industry experience is required for Mentors."
      );
      focusTargetId ??= "profileIndustryExperience";
      isValid = false;
    } else {
      setIndustryExperienceError("");
    }

    if (profile.availability.length === 0) {
      setAvailabilityError("Select at least one availability slot.");
      focusTargetId ??= "profileAvailabilityGroup";
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
        elementToFocus.focus({ preventScroll: true });
        elementToFocus.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      setFirstErrorFieldId(null);
    }
  }, [firstErrorFieldId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfilePictureError("");
    setFullNameError("");
    setBioError("");
    setExpertiseError("");
    setSkillsError("");
    setIndustryExperienceError("");
    setAvailabilityError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
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
            <p className="text-xs text-red-500 mt-1 text-center">
              {profilePictureError}
            </p>
          )}
        </div>
        <div className="md:col-span-2 space-y-6">
          <InputCustom
            label="Full Name"
            name="fullName"
            type="text"
            value={profile.fullName}
            onChange={(e) => handleFieldChange("fullName", e.target.value)}
            placeholder="Your full name"
            isRequired
            errorMessage={fullNameError}
            className="bg-gray-800 border-gray-700"
          />
          <InputCustom
            label="Bio"
            name="bio"
            type="textarea"
            value={profile.bio}
            onChange={(e) => handleFieldChange("bio", e.target.value)}
            placeholder="A brief introduction about yourself..."
            isRequired
            errorMessage={bioError}
            className="min-h-[100px] bg-gray-800 border-gray-700 p-3"
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
              isSelected={role === roleOpt.name}
              onClick={() => onRoleChange(roleOpt.name)}
            />
          ))}
        </div>
      </div>

      <div id="profileExpertiseGroup">
        <MultiSelectButtons
          label="Areas of Expertise / Interest"
          options={expertiseOptionsData}
          selectedOptions={profile.expertise}
          onToggleSelect={(option) =>
            handleMultiSelectToggle(
              option,
              profile.expertise,
              "expertise",
              setExpertiseError
            )
          }
          gridColsClass="grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
          isRequired
        />
        {expertiseError && (
          <p className="text-sm text-red-500 mt-1">{expertiseError}</p>
        )}
      </div>

      <InputCustom
        label="Professional Skills"
        placeholder="Add skills (e.g., JavaScript)"
        errorMessage={skillsError}
        className="bg-gray-800 border-gray-700"
        isRequired={role === Role.Mentor}
        name="skills"
        type="text"
        value={profile.skills?.join(", ") || ""}
        onChange={(e) =>
          handleFieldChange(
            "skills",
            e.target.value.split(",").map((skill) => skill.trim())
          )
        }
      />

      <InputCustom
        label="Industry Experience"
        name="industryExperience"
        type="text"
        value={profile.industryExperience || ""}
        onChange={(e) =>
          handleFieldChange("industryExperience", e.target.value)
        }
        placeholder="e.g., 5 years in Software Development"
        isRequired={role === Role.Mentor}
        errorMessage={industryExperienceError}
        className="bg-gray-800 border-gray-700"
      />

      <div id="profileAvailabilityGroup">
        <MultiSelectButtons
          label="Your Availability"
          options={availabilityOptionsData}
          selectedOptions={profile.availability}
          onToggleSelect={(option) =>
            handleMultiSelectToggle(
              option,
              profile.availability,
              "availability",
              setAvailabilityError
            )
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
          {Object.values(CommunicationMethod).map((methodValue) => (
            <button
              type="button"
              key={methodValue}
              className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border font-medium transition-colors text-sm focus:outline-none focus:ring-2 ${
                profile.preferredCommunication === methodValue
                  ? "bg-orange-500 text-white border-orange-500 ring-orange-500"
                  : "bg-gray-700 border-gray-600 hover:bg-gray-650 text-gray-300 hover:text-white ring-gray-600 focus:ring-orange-500"
              }`}
              onClick={() =>
                handleFieldChange("preferredCommunication", methodValue)
              }>
              {methodValue === CommunicationMethod.VideoCall && (
                <Video size={18} />
              )}
              {methodValue === CommunicationMethod.AudioCall && (
                <Headphones size={18} />
              )}
              {methodValue === CommunicationMethod.TextChat && (
                <MessageCircle size={18} />
              )}
              <span>{methodValue}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto flex-1 py-3 px-5 border border-gray-600 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 font-semibold">
          Back
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto flex-1 py-3 px-5 bg-orange-500 hover:bg-orange-600 rounded-lg text-white font-semibold">
          Continue to Preferences
        </button>
      </div>
    </form>
  );
};

export default ProfileCreatePanel;
