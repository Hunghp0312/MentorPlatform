// components/register/panel/ProfileCreatePanel.tsx
import React, { useState, useEffect } from "react";
import InputCustom from "../../input/InputCustom";
import InputTag from "../../input/InputTag";
import ProfilePictureUpload from "../child/ProfilePictureUpload";
import RoleSelectionCard from "../child/RoleSelectionCard";
import MultiSelectButtons from "../child/MultiSelectButtons";
import CommunicationMethodButton from "../child/CommunicationMethodButton";
import { Video, Headphones, MessageCircle } from "lucide-react";
import {
  UserRegistrationRequest,
  SharedProfileDetails,
  LearnerDetails,
  MentorDetails,
  Role,
  LearnerCommunicationMethod,
} from "../../../types/userRegister.d"; // Adjust

interface Props {
  currentUserData: UserRegistrationRequest;
  onUpdate: (
    updates: Partial<{
      // Allows sending partial updates for any section
      profile: Partial<SharedProfileDetails>;
      learnerDetails: Partial<LearnerDetails>;
      mentorDetails: Partial<MentorDetails>;
    }>
  ) => void;
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
const communicationMethodsData = [
  {
    value: LearnerCommunicationMethod.VideoCall,
    label: "Video Call",
    icon: <Video size={18} />,
  }, // Smaller icon
  {
    value: LearnerCommunicationMethod.AudioCall,
    label: "Audio Call",
    icon: <Headphones size={18} />,
  },
  {
    value: LearnerCommunicationMethod.TextChat,
    label: "Text Chat",
    icon: <MessageCircle size={18} />,
  },
];

const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png"];

const ProfileCreatePanel: React.FC<Props> = ({
  currentUserData,
  onUpdate,
  onRoleChange,
  onNext,
  onBack,
}) => {
  const { role, profile } = currentUserData;
  // Access role-specific details conditionally
  const learnerDetails =
    role === Role.Learner ? currentUserData.learnerDetails : undefined;
  const mentorDetails =
    role === Role.Mentor ? currentUserData.mentorDetails : undefined;

  // Local UI State (errors, preview, focus target)
  const [profilePictureError, setProfilePictureError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [bioError, setBioError] = useState("");
  // Learner specific errors
  const [learningGoalsError, setLearningGoalsError] = useState("");
  // Mentor specific errors
  const [expertiseError, setExpertiseError] = useState("");
  const [skillsError, setSkillsError] = useState("");
  const [experienceError, setExperienceError] = useState("");
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

  const handleFieldChange = (
    section: "profile" | "learnerDetails" | "mentorDetails",
    field: string,
    value: any
  ) => {
    onUpdate({ [section]: { [field]: value } });
  };

  const handleMultiSelectToggle = (
    option: string,
    currentSelection: string[],
    detailType: "mentorDetails", // Currently only mentorDetails has multi-select arrays here
    field: keyof MentorDetails, // Restrict to MentorDetails fields
    errorSetter?: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const newSelection = currentSelection.includes(option)
      ? currentSelection.filter((item) => item !== option)
      : [...currentSelection, option];
    handleFieldChange(detailType, field, newSelection);
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
        setProfilePictureError(`PNG/JPG only, max ${MAX_FILE_SIZE_MB}MB.`);
        handleFieldChange("profile", "profilePictureFile", null);
        e.target.value = "";
        return;
      }
      handleFieldChange("profile", "profilePictureFile", file);
    } else {
      handleFieldChange("profile", "profilePictureFile", null);
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

    if (role === Role.Learner && learnerDetails) {
      if (!learnerDetails.learningGoals.trim()) {
        setLearningGoalsError("Goals are required.");
        focusTargetId ??= "learnerLearningGoals";
        isValid = false;
      } else {
        setLearningGoalsError("");
      }
    } else if (role === Role.Mentor && mentorDetails) {
      if (mentorDetails.expertise.length === 0) {
        setExpertiseError("Select expertise.");
        focusTargetId ??= "mentorExpertiseGroup";
        isValid = false;
      } else {
        setExpertiseError("");
      }
      if (mentorDetails.skills.length === 0) {
        setSkillsError("Add skills.");
        focusTargetId ??= "mentorSkillsInputTag";
        isValid = false;
      } else {
        setSkillsError("");
      }
      if (!mentorDetails.industryExperience.trim()) {
        setExperienceError("Experience required.");
        focusTargetId ??= "mentorIndustryExperience";
        isValid = false;
      } else {
        setExperienceError("");
      }
      if (mentorDetails.availability.length === 0) {
        setAvailabilityError("Select availability.");
        focusTargetId ??= "mentorAvailabilityGroup";
        isValid = false;
      } else {
        setAvailabilityError("");
      }
    }
    setFirstErrorFieldId(focusTargetId);
    return isValid;
  };

  useEffect(() => {
    if (firstErrorFieldId) {
      const elementToFocus = document.getElementById(firstErrorFieldId);
      if (elementToFocus) {
        elementToFocus.focus({ preventScroll: true }); // preventScroll then manually scroll
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
    setLearningGoalsError("");
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
            onChange={(e) =>
              handleFieldChange("profile", "fullName", e.target.value)
            }
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
            onChange={(e) =>
              handleFieldChange("profile", "bio", e.target.value)
            }
            placeholder="A brief introduction..."
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

      {role === Role.Learner && learnerDetails && (
        <>
          <InputCustom
            label="Learning Goals"
            name="learningGoals"
            type="textarea"
            value={learnerDetails.learningGoals}
            onChange={(e) =>
              handleFieldChange(
                "learnerDetails",
                "learningGoals",
                e.target.value
              )
            }
            placeholder="What do you hope to achieve?"
            isRequired
            errorMessage={learningGoalsError}
            className="min-h-[100px] bg-gray-800 border-gray-700 p-3"
          />
          <div>
            <label className="text-base font-medium text-gray-300 block mb-2">
              Preferred Communication Method{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
              {communicationMethodsData.map((method) => (
                <CommunicationMethodButton
                  key={method.value}
                  method={method}
                  isSelected={
                    learnerDetails.preferredCommunication === method.value
                  }
                  onClick={() =>
                    handleFieldChange(
                      "learnerDetails",
                      "preferredCommunication",
                      method.value
                    )
                  }
                />
              ))}
            </div>
          </div>
        </>
      )}

      {role === Role.Mentor && mentorDetails && (
        <>
          <div id="mentorExpertiseGroup">
            <MultiSelectButtons
              label="Areas of Expertise"
              options={expertiseOptionsData}
              selectedOptions={mentorDetails.expertise}
              onToggleSelect={(option) =>
                handleMultiSelectToggle(
                  option,
                  mentorDetails.expertise,
                  "mentorDetails",
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
          <InputTag
            label="Professional Skills"
            tags={mentorDetails.skills}
            setTags={(newSkills) =>
              handleFieldChange("mentorDetails", "skills", newSkills)
            }
            placeholder="Type and press Enter"
            errorMessage={skillsError}
            setErrorMessage={setSkillsError}
            inputPadding="px-4 py-3"
            className="bg-gray-800 border-gray-700"
            isRequired
          />
          <InputCustom
            label="Industry Experience"
            name="industryExperience"
            type="text"
            value={mentorDetails.industryExperience}
            onChange={(e) =>
              handleFieldChange(
                "mentorDetails",
                "industryExperience",
                e.target.value
              )
            }
            placeholder="e.g., 5 years in Tech"
            isRequired
            errorMessage={experienceError}
            className="bg-gray-800 border-gray-700"
          />
          <div id="mentorAvailabilityGroup">
            <MultiSelectButtons
              label="Your Availability"
              options={availabilityOptionsData}
              selectedOptions={mentorDetails.availability}
              onToggleSelect={(option) =>
                handleMultiSelectToggle(
                  option,
                  mentorDetails.availability,
                  "mentorDetails",
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
        </>
      )}

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
          Continue
        </button>
      </div>
    </form>
  );
};
export default ProfileCreatePanel;
