import React, { useState, useEffect } from "react";
import InputCustom from "../../input/InputCustom"; // Assuming path is correct
import ProfilePictureUpload from "../child/ProfilePictureUpload"; // Assuming path is correct
import RoleSelectionCard from "../child/RoleSelectionCard"; // Assuming path is correct
import MultiSelectButtons from "../child/MultiSelectButtons"; // Assuming path is correct
import { Video, Headphones, MessageCircle } from "lucide-react";
import {
  UserRegistrationRequest,
  SharedProfileDetails,
} from "../../../types/userRegister.d"; // Ensure this path is correct
import {
  RoleEnum,
  CommunicationMethod,
  ArenaOfExpertise, // Added
  Availability, // Added
} from "../../../types/commonType"; // Ensure this path is correct

interface Props {
  currentUserData: UserRegistrationRequest;
  onUpdateProfile: (updates: Partial<SharedProfileDetails>) => void;
  onRoleChange: (newRole: RoleEnum) => void;
  onNext: () => void;
  onBack: () => void;
}

const rolesData = [
  { name: RoleEnum.Learner, subtext: "I want to find mentors", icon: "👨‍🎓" },
  { name: RoleEnum.Mentor, subtext: "I want to mentor others", icon: "👨‍🏫" },
];

// Mappings for ArenaOfExpertise
const expertiseOptionMappings = [
  { value: ArenaOfExpertise.Leadership, label: "Leadership" },
  { value: ArenaOfExpertise.Programming, label: "Programming" },
  { value: ArenaOfExpertise.Design, label: "Design" },
  { value: ArenaOfExpertise.Marketing, label: "Marketing" },
  { value: ArenaOfExpertise.DataScience, label: "Data Science" },
  { value: ArenaOfExpertise.Business, label: "Business" },
  { value: ArenaOfExpertise.ProjectManagement, label: "Project Management" },
  { value: ArenaOfExpertise.Communication, label: "Communication" },
];

// Mappings for Availability
const availabilityOptionMappings = [
  { value: Availability.Weekdays, label: "Weekdays" },
  { value: Availability.Weekends, label: "Weekends" },
  { value: Availability.Mornings, label: "Mornings" },
  { value: Availability.Afternoons, label: "Afternoons" },
  { value: Availability.Evenings, label: "Evenings" },
];

// Options for CommunicationMethod
const communicationMethodOptions = [
  {
    value: CommunicationMethod.VideoCall,
    label: "Video Call",
    IconComponent: Video,
  },
  {
    value: CommunicationMethod.AudioCall,
    label: "Audio Call",
    IconComponent: Headphones,
  },
  {
    value: CommunicationMethod.TextChat,
    label: "Text Chat",
    IconComponent: MessageCircle,
  },
];

const MAX_FILE_SIZE_MB = 5;
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
  const [skillsError, setSkillsError] = useState(""); // profile.skills is string, not array
  const [industryExperienceError, setIndustryExperienceError] = useState("");
  const [contactError, setContactError] = useState("");
  const [availabilityError, setAvailabilityError] = useState("");
  // No error state needed for preferredCommunication as it's always an array (can be empty)

  const [profilePicturePreview, setProfilePicturePreview] = useState<
    string | null
  >(profile.profilePictureUrl || null); // Initialize with URL if available
  const [firstErrorFieldId, setFirstErrorFieldId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (profile.profilePictureFile) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setProfilePicturePreview(reader.result as string);
      reader.readAsDataURL(profile.profilePictureFile);
    } else if (profile.profilePictureUrl) {
      setProfilePicturePreview(profile.profilePictureUrl);
    } else {
      setProfilePicturePreview(null);
    }
  }, [profile.profilePictureFile, profile.profilePictureUrl]);

  const handleFieldChange = (
    field: keyof SharedProfileDetails,
    value: SharedProfileDetails[keyof SharedProfileDetails]
  ) => {
    onUpdateProfile({ [field]: value });
  };

  const handleMultiSelectToggle = (
    selectedLabel: string,
    currentEnumSelection: ArenaOfExpertise[] | Availability[] | undefined,
    field: "expertise" | "availability",
    errorSetter?: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const mappings =
      field === "expertise"
        ? expertiseOptionMappings
        : availabilityOptionMappings;
    const selectedMapping = mappings.find((m) => m.label === selectedLabel);

    if (!selectedMapping) {
      console.error("Invalid label selected in multi-select:", selectedLabel);
      return;
    }

    const selectedEnumValue = selectedMapping.value;
    // Explicitly type safeCurrentEnumSelection to avoid TS confusion with mixed types
    const safeCurrentEnumSelection: (ArenaOfExpertise | Availability)[] =
      currentEnumSelection || [];

    let newSelection: (ArenaOfExpertise | Availability)[];

    if (safeCurrentEnumSelection.includes(selectedEnumValue)) {
      newSelection = safeCurrentEnumSelection.filter(
        (item) => item !== selectedEnumValue
      );
    } else {
      newSelection = [...safeCurrentEnumSelection, selectedEnumValue];
    }

    // Ensure the newSelection is correctly typed for the specific field
    if (field === "expertise") {
      handleFieldChange(field, newSelection as ArenaOfExpertise[]);
    } else if (field === "availability") {
      handleFieldChange(field, newSelection as Availability[]);
    }

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
        e.target.value = ""; // Reset file input
        return;
      }
      handleFieldChange("profilePictureFile", file);
      handleFieldChange("profilePictureUrl", undefined); // Clear URL if new file is selected
    }
  };

  const handleDeletePicture = () => {
    setProfilePicturePreview(null);
    handleFieldChange("profilePictureFile", null);
    handleFieldChange("profilePictureUrl", undefined);
  };

  const validateAndSetFocusTarget = () => {
    let isValid = true;
    let focusTargetId: string | null = null;

    const setFocus = (id: string) => {
      if (!focusTargetId) focusTargetId = id;
    };

    if (!profile.fullName.trim()) {
      setFullNameError("Full name is required.");
      setFocus("profileFullName");
      isValid = false;
    } else {
      setFullNameError("");
    }

    if (profile.contact.trim()) {
      const phoneRegex = /^\+?\d{7,15}$/; // Basic regex, consider libphonenumber-js for robust validation
      if (!phoneRegex.test(profile.contact.trim())) {
        setContactError(
          "Invalid phone number. Must be 7-15 digits, optionally starting with '+'."
        );
        setFocus("profileContact");
        isValid = false;
      } else {
        setContactError("");
      }
    } else {
      // Contact is not required, so clear error if empty
      setContactError("");
    }

    if (profile.expertise.length === 0) {
      setExpertiseError("Select at least one expertise area.");
      setFocus("profileExpertiseGroup");
      isValid = false;
    } else {
      setExpertiseError("");
    }

    if (
      role === RoleEnum.Mentor &&
      (!profile.skills || profile.skills.trim().length === 0)
    ) {
      setSkillsError("Skills are required for Mentors.");
      setFocus("profileSkills");
      isValid = false;
    } else {
      setSkillsError("");
    }

    if (role === RoleEnum.Mentor && !profile.industryExperience?.trim()) {
      setIndustryExperienceError(
        "Industry experience is required for Mentors."
      );
      setFocus("profileIndustryExperience");
      isValid = false;
    } else {
      setIndustryExperienceError("");
    }

    if (profile.availability.length === 0) {
      setAvailabilityError("Select at least one availability slot.");
      setFocus("profileAvailabilityGroup");
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
      setFirstErrorFieldId(null); // Reset after focusing
    }
  }, [firstErrorFieldId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Clear all errors before re-validating
    setProfilePictureError("");
    setFullNameError("");
    setBioError("");
    setExpertiseError("");
    setSkillsError("");
    setContactError("");
    setIndustryExperienceError("");
    setAvailabilityError("");

    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top to see any top-of-form errors

    if (validateAndSetFocusTarget()) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-white pb-8">
      {/* Profile Picture and Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
        <div className="md:col-span-1">
          <ProfilePictureUpload
            picturePreview={profilePicturePreview}
            onPictureChange={handleProfilePictureChange}
            onDeletePicture={handleDeletePicture}
            inputId="profilePictureActualInput" // Ensure this id is unique if component is reused
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
            onChange={(e) => {
              const value = e.target.value;
              if (value.length > 100) {
                setFullNameError("Please enter between 2-100 characters.");
              } else {
                setFullNameError("");
                handleFieldChange("fullName", value);
              }
            }}
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
            onChange={(e) => {
              const value = e.target.value;
              if (value.length > 1000) {
                setBioError("Please enter under 1000 characters.");
              } else {
                setBioError("");
                handleFieldChange("bio", value);
              }
            }}
            placeholder="A brief introduction about yourself..."
            errorMessage={bioError}
            className="min-h-[100px] bg-gray-800 border-gray-700 p-3"
          />
          <InputCustom
            label="Phone Number"
            name="phoneNumber"
            type="text"
            value={profile.contact}
            onChange={(e) => handleFieldChange("contact", e.target.value)}
            placeholder="e.g., +1234567890"
            errorMessage={contactError}
            className="bg-gray-800 border-gray-700"
          />
        </div>
      </div>

      {/* Role Selection */}
      <div>
        <label className="text-base font-medium text-gray-300 block mb-3">
          I am joining as <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-4 w-full">
          {rolesData.map((roleOpt) => (
            <RoleSelectionCard
              key={roleOpt.name} // Role enum values are numbers, good for keys
              role={roleOpt}
              isSelected={role === roleOpt.name}
              onClick={() => onRoleChange(roleOpt.name)}
            />
          ))}
        </div>
      </div>

      {/* Areas of Expertise */}
      <div id="profileExpertiseGroup">
        <MultiSelectButtons
          label="Areas of Expertise / Interest"
          options={expertiseOptionMappings.map((m) => m.label)}
          selectedOptions={
            profile.expertise
              .map(
                (val) =>
                  expertiseOptionMappings.find((m) => m.value === val)?.label
              )
              .filter((label): label is string => !!label) // Type guard for non-null labels
          }
          onToggleSelect={(label) =>
            handleMultiSelectToggle(
              label,
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

      {/* Professional Skills */}
      <InputCustom
        label="Professional Skills"
        placeholder="Add skills (e.g., JavaScript, Python, Agile)"
        errorMessage={skillsError}
        className="bg-gray-800 border-gray-700"
        isRequired={role === RoleEnum.Mentor}
        name="skills"
        type="text"
        value={profile.skills || ""}
        onChange={(e) => handleFieldChange("skills", e.target.value)}
      />

      {/* Industry Experience */}
      <InputCustom
        label="Industry Experience"
        name="industryExperience"
        type="text"
        value={profile.industryExperience ?? ""}
        onChange={(e) =>
          handleFieldChange("industryExperience", e.target.value)
        }
        placeholder="e.g., 5 years in Software Development"
        isRequired={role === RoleEnum.Mentor}
        errorMessage={industryExperienceError}
        className="bg-gray-800 border-gray-700"
      />

      {/* Availability */}
      <div id="profileAvailabilityGroup">
        <MultiSelectButtons
          label="Your Availability"
          options={availabilityOptionMappings.map((m) => m.label)}
          selectedOptions={
            profile.availability
              .map(
                (val) =>
                  availabilityOptionMappings.find((m) => m.value === val)?.label
              )
              .filter((label): label is string => !!label) // Type guard
          }
          onToggleSelect={(label) =>
            handleMultiSelectToggle(
              label,
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

      {/* Preferred Communication Method */}
      <div id="profileCommunicationMethodGroup">
        {" "}
        {/* Added ID for potential focus target */}
        <label className="text-base font-medium text-gray-300 block mb-2">
          Preferred Communication Method <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
          {communicationMethodOptions.map((option) => {
            const isSelected = profile.preferredCommunication?.includes(
              option.value
            );

            return (
              <button
                type="button"
                key={option.value}
                className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border font-medium transition-colors text-sm focus:outline-none focus:ring-2 ${
                  isSelected
                    ? "bg-orange-500 text-white border-orange-500 ring-orange-500"
                    : "bg-gray-700 border-gray-600 hover:bg-gray-650 text-gray-300 hover:text-white ring-gray-600 focus:ring-orange-500"
                }`}
                onClick={() => {
                  const currentMethods = profile.preferredCommunication || [];
                  const updatedMethods = isSelected
                    ? currentMethods.filter((m) => m !== option.value)
                    : [...currentMethods, option.value];
                  handleFieldChange("preferredCommunication", updatedMethods);
                }}>
                <option.IconComponent size={18} />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
        {/* Add error message display for preferredCommunication if needed */}
        {/* {preferredCommunicationError && <p className="text-sm text-red-500 mt-1">{preferredCommunicationError}</p>} */}
      </div>

      {/* Action Buttons */}
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
