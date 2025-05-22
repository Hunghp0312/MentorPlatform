import React, { useState, useEffect } from "react";
import InputCustom from "../../input/InputCustom";
import ProfilePictureUpload from "../child/ProfilePictureUpload";
import RoleSelectionCard from "../child/RoleSelectionCard";
import MultiSelectButtons from "../child/MultiSelectButtons";
import CommunicationMethodButton from "../child/CommunicationMethodButton";
import { Video, Headphones, MessageCircle } from "lucide-react";

interface Props {
  profile: string; // This is for Bio
  setProfile: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const rolesData = [
  { name: "Learner", subtext: "I want to find mentors", icon: "👨‍🎓" },
  { name: "Mentor", subtext: "I want to mentor others", icon: "👨‍🏫" },
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
  { value: "Video Call", label: "Video Call", icon: <Video size={20} /> },
  { value: "Audio Call", label: "Audio Call", icon: <Headphones size={20} /> },
  { value: "Text Chat", label: "Text Chat", icon: <MessageCircle size={20} /> },
];

const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png"];

const ProfileCreatePanel: React.FC<Props> = ({
  profile,
  setProfile,
  onNext,
  onBack,
}) => {
  const [selectedRole, setSelectedRole] = useState<"Learner" | "Mentor">(
    "Learner"
  ); // Initial Role
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [experience, setExperience] = useState("");
  const [expertise, setExpertise] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [communication, setCommunication] = useState("Video Call");
  const [goals, setGoals] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null
  );
  const [profilePicturePreview, setProfilePicturePreview] = useState<
    string | null
  >(null);

  const [fullNameError, setFullNameError] = useState("");
  const [bioError, setBioError] = useState("");
  const [expertiseError, setExpertiseError] = useState("");
  const [availabilityError, setAvailabilityError] = useState("");
  const [profilePictureError, setProfilePictureError] = useState("");
  const [experienceError, setExperienceError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [skillsError, setSkillsError] = useState("");

  const [firstErrorFieldId, setFirstErrorFieldId] = useState<string | null>(
    null
  );

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
          `Please select a .png or .jpg file with a maximum of ${MAX_FILE_SIZE_MB}MB`
        );
        setProfilePictureFile(null);
        setProfilePicturePreview(null);
        e.target.value = ""; // Reset file input
        console.log(profilePictureFile);
        return;
      }
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleMultiSelect = (
    option: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    errorSetter?: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter((prev) =>
      prev.includes(option)
        ? prev.filter((v) => v !== option)
        : [...prev, option]
    );
    errorSetter?.("");
  };

  const getSkillsArray = () =>
    skillsInput
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill !== "");

  const validateAndSetFocusTarget = () => {
    let isValid = true;
    let focusTargetId: string | null = null;

    const trimmedFullName = fullName.trim();
    if (!trimmedFullName) {
      setFullNameError("Please fill in this field");
      focusTargetId ??= "fullName";
      isValid = false;
    } else if (trimmedFullName.length < 2 || trimmedFullName.length > 100) {
      setFullNameError("Full name must be between 2 and 100 characters.");
      focusTargetId ??= "fullName";
      isValid = false;
    } else {
      setFullNameError("");
    }

    const trimmedBio = profile.trim();
    if (!trimmedBio) {
      setBioError("Please fill in this field");
      focusTargetId ??= "bio";
      isValid = false;
    } else if (trimmedBio.length > 1000) {
      setBioError("Bio must be a maximum of 1000 characters.");
      focusTargetId ??= "bio";
      isValid = false;
    } else {
      setBioError("");
    }

    if (phoneNumber && !/^\d+$/.test(phoneNumber.replace(/\s+/g, ""))) {
      setPhoneNumberError("Phone number should only contain digits.");
      focusTargetId ??= "phoneNumber";
      isValid = false;
    } else if (phoneNumber && phoneNumber.replace(/\s+/g, "").length > 15) {
      setPhoneNumberError("Phone number must be a maximum of 15 digits.");
      focusTargetId ??= "phoneNumber";
      isValid = false;
    } else {
      setPhoneNumberError("");
    }

    if (expertise.length === 0) {
      setExpertiseError("Please select at least one category from the list");
      focusTargetId ??= "expertiseGroup";
      isValid = false;
    } else {
      setExpertiseError("");
    }

    if (skillsInput.length > 50) {
      setSkillsError(
        "Professional skills input must be a maximum of 50 characters."
      );
      focusTargetId ??= "professionalSkills";
      isValid = false;
    } else {
      setSkillsError("");
    }

    const trimmedExperience = experience.trim();
    if (selectedRole === "Mentor" && !trimmedExperience) {
      setExperienceError("Please fill in this field");
      focusTargetId ??= "experience";
      isValid = false;
    } else if (trimmedExperience.length > 50) {
      setExperienceError(
        "Industry experience must be a maximum of 50 characters."
      );
      focusTargetId ??= "experience";
      isValid = false;
    } else {
      setExperienceError("");
    }

    if (availability.length === 0) {
      setAvailabilityError("Please select at least one option from the list");
      focusTargetId ??= "availabilityGroup";
      isValid = false;
    } else {
      setAvailabilityError("");
    }

    if (goals.length > 1000) {
      setBioError("Goals must be a maximum of 1000 characters.");
      focusTargetId ??= "goals";
      isValid = false;
    }

    setFirstErrorFieldId(focusTargetId);
    return isValid;
  };

  useEffect(() => {
    if (firstErrorFieldId) {
      const elementToFocusOrScroll = document.getElementById(firstErrorFieldId);
      if (elementToFocusOrScroll) {
        if (
          [
            "fullName",
            "bio",
            "professionalSkills",
            "experience",
            "goals",
            "profilePictureActualInput",
            "phoneNumber",
          ].includes(firstErrorFieldId)
        ) {
          elementToFocusOrScroll.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
        elementToFocusOrScroll.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      setFirstErrorFieldId(null);
    }
  }, [firstErrorFieldId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

  const isExperienceRequired = selectedRole === "Mentor";

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
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              setFullNameError("");
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
            value={profile}
            onChange={(e) => {
              setProfile(e.target.value);
              setBioError("");
            }}
            placeholder="A brief introduction about yourself…"
            isRequired
            errorMessage={bioError}
            className="min-h-[100px] bg-gray-800 border-gray-700 p-3"
          />
          <InputCustom
            label="Phone number"
            name="phoneNumber"
            type="tel" // Use type="tel" for phone numbers
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
              setPhoneNumberError("");
            }}
            placeholder="Your phone number"
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
          {rolesData.map((role) => (
            <RoleSelectionCard
              key={role.name}
              role={role}
              isSelected={selectedRole === role.name}
              onClick={() => {
                setSelectedRole(role.name as "Learner" | "Mentor");
                if (
                  role.name === "Learner" &&
                  isExperienceRequired &&
                  experience.trim() === ""
                ) {
                  setExperienceError("");
                }
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <MultiSelectButtons
          id="expertiseGroup"
          label="Areas of Expertise"
          options={expertiseOptions}
          selectedOptions={expertise}
          onToggleSelect={(option) =>
            toggleMultiSelect(option, setExpertise, setExpertiseError)
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
          label="Professional Skills"
          name="professionalSkills"
          type="text"
          value={skillsInput}
          onChange={(e) => {
            setSkillsInput(e.target.value);
            setSkillsError("");
          }}
          placeholder="e.g., JavaScript, Project Management"
          errorMessage={skillsError}
          className="bg-gray-800 border-gray-700"
        />
        <InputCustom
          label="Industry Experience"
          name="experience"
          type="text"
          value={experience}
          onChange={(e) => {
            setExperience(e.target.value);
            if (isExperienceRequired) setExperienceError("");
          }}
          placeholder="e.g., 5 years in Tech, 3 years in Finance"
          isRequired={isExperienceRequired}
          errorMessage={experienceError}
          className="bg-gray-800 border-gray-700"
        />
      </div>
      {getSkillsArray().length > 0 && (
        <div className="flex flex-wrap items-center -mt-6 mb-2 gap-2 px-1">
          {getSkillsArray().map((skill, index) => (
            <span
              key={index}
              className="bg-gray-600 text-gray-200 px-2 py-1 rounded-md text-xs">
              {skill}
            </span>
          ))}
        </div>
      )}

      <div>
        <MultiSelectButtons
          id="availabilityGroup"
          label="Your Availability"
          options={availabilityOptions}
          selectedOptions={availability}
          onToggleSelect={(option) =>
            toggleMultiSelect(option, setAvailability, setAvailabilityError)
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
              isSelected={communication === method.value}
              onClick={() => setCommunication(method.value)}
            />
          ))}
        </div>
      </div>

      <InputCustom
        label="What do you hope to learn?"
        name="goals"
        type="textarea"
        value={goals}
        onChange={(e) => {
          setGoals(e.target.value);
        }}
        placeholder="Describe your learning objectives and what you hope to achieve…"
        className="min-h-[100px] bg-gray-800 border-gray-700 p-3"
      />

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
          Continue to Final Step
        </button>
      </div>
    </form>
  );
};

export default ProfileCreatePanel;
