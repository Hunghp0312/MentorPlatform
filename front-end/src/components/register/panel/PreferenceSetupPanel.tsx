// components/register/panel/PreferenceSetupPanel.tsx
import React, { useState, useEffect } from "react";
import Dropdown from "../../input/Dropdown";
import InputCheckbox from "../../input/InputCheckbox";
import InputCustom from "../../input/InputCustom"; // Learning goals moved to LearnerDetails
import MultiSelectButtons from "../child/MultiSelectButtons";
import {
  UserPreferences,
  Role,
  SessionFrequencyOption,
  SessionDurationOption,
  LearningStyleOption,
} from "../../../types/userRegister.d"; // Adjust path

interface Props {
  currentPreferences: UserPreferences;
  onPreferencesChange: (
    updates:
      | Partial<UserPreferences>
      | ((prevPrefs: UserPreferences) => UserPreferences)
  ) => void;
  userRole: Role;
  onSubmit: () => void;
  onBack: () => void;
}

const topicsOptionsData = [
  "Career Development",
  "Technical Skills",
  "Leadership",
  "Communication",
  "Work-Life Balance",
  "Industry Insights",
  "Networking",
  "Entrepreneurship",
];
const frequencyOptionsData = [
  { value: SessionFrequencyOption.Weekly, label: "Weekly" },
  { value: SessionFrequencyOption.Biweekly, label: "Every two weeks" },
  { value: SessionFrequencyOption.Monthly, label: "Monthly" },
  { value: SessionFrequencyOption.AsNeeded, label: "As needed" },
];
const durationOptionsData = [
  { value: SessionDurationOption.HalfHour, label: "30 minutes" },
  { value: SessionDurationOption.OneHour, label: "1 hour" },
  { value: SessionDurationOption.OneAndHalfHour, label: "1.5 hours" },
  { value: SessionDurationOption.TwoHours, label: "2 hours" },
];
const learningStyleOptionsData: LearningStyleOption[] = [
  LearningStyleOption.Visual,
  LearningStyleOption.Auditory,
  LearningStyleOption.ReadingWriting,
  LearningStyleOption.Kinesthetic,
];
// const teachingApproachOptionsData: TeachingApproachOption[] = [ ... ]; // If you add teachingApproach to UserPreferences

const PreferenceSetupPanel: React.FC<Props> = ({
  currentPreferences,
  onPreferencesChange,
  userRole,
  onSubmit,
  onBack,
}) => {
  const [topicsError, setTopicsError] = useState("");
  const [learningStyleError, setLearningStyleError] = useState("");
  // const [teachingApproachError, setTeachingApproachError] = useState("");
  const [firstErrorFieldId, setFirstErrorFieldId] = useState<string | null>(
    null
  );

  const handleMultiSelectToggle = (
    option: string,
    field: keyof Pick<
      UserPreferences,
      "interestedTopics" | "learningStyle" /* | "teachingApproach" */
    >,
    errorSetter?: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const currentSelection =
      (currentPreferences[field] as
        | string[]
        | LearningStyleOption
        | undefined) ||
      (Array.isArray(currentPreferences[field]) ? [] : undefined);

    let newSelection;
    if (field === "learningStyle") {
      // Assuming learningStyle from DTO is single, but your table said multi
      newSelection = option as LearningStyleOption; // For single select
    } else if (Array.isArray(currentSelection)) {
      // For topicsOfInterest (and teachingApproach if multi)
      newSelection = currentSelection.includes(option)
        ? currentSelection.filter((item) => item !== option)
        : [...currentSelection, option];
    } else {
      // Fallback for single non-array field
      newSelection = option;
    }

    onPreferencesChange({ [field]: newSelection });
    errorSetter?.("");
  };

  const handlePrivacySettingChange = (
    field: keyof UserPreferences["privacySettings"],
    value: boolean
  ) => {
    onPreferencesChange((prev) => ({
      ...prev,
      privacySettings: { ...prev.privacySettings, [field]: value },
    }));
  };

  const validateAndSetFocusTarget = () => {
    let isValid = true;
    let focusTargetId: string | null = null;
    const { interestedTopics, learningStyle /*, teachingApproach */ } =
      currentPreferences;

    if (interestedTopics.length === 0) {
      setTopicsError("Select at least one topic.");
      focusTargetId ??= "topicsOfInterestGroup";
      isValid = false;
    } else {
      setTopicsError("");
    }

    if (userRole === Role.Learner && !learningStyle) {
      // If learningStyle is required and single
      setLearningStyleError("Select a learning style.");
      focusTargetId ??= "learningStyleGroup"; // Assuming you wrap learning style buttons
      isValid = false;
    } else {
      setLearningStyleError("");
    }
    // Add validation for teachingApproach if it's added for Mentors

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
    setTopicsError("");
    setLearningStyleError("");
    // setTeachingApproachError("");

    if (validateAndSetFocusTarget()) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-white">
      <div id="topicsOfInterestGroup">
        <MultiSelectButtons
          label="Topics you're interested in learning about"
          options={topicsOptionsData}
          selectedOptions={currentPreferences.interestedTopics}
          onToggleSelect={(option) =>
            handleMultiSelectToggle(option, "interestedTopics", setTopicsError)
          }
          gridColsClass="grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
          isRequired
        />
        {topicsError && (
          <p className="text-sm text-red-500 mt-1">{topicsError}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Dropdown
          label="Preferred session frequency"
          name="sessionFrequency"
          options={frequencyOptionsData}
          value={currentPreferences.sessionFrequency}
          onChange={(value) =>
            onPreferencesChange({
              sessionFrequency: value as SessionFrequencyOption,
            })
          }
          inputPadding="px-4 py-2.5"
          className="bg-gray-700 border-gray-600"
          isRequired
        />
        <Dropdown
          label="Preferred session duration"
          name="sessionDuration"
          options={durationOptionsData}
          value={currentPreferences.sessionDuration}
          onChange={(value) =>
            onPreferencesChange({
              sessionDuration: value as SessionDurationOption,
            })
          }
          inputPadding="px-4 py-2.5"
          className="bg-gray-700 border-gray-600"
          isRequired
        />
      </div>

      {/* Learning Style - Assuming single select as per DTO, but your table said multi */}
      {userRole === Role.Learner && (
        <div id="learningStyleGroup">
          <label className="text-base font-medium text-gray-300 block mb-2">
            Your preferred learning style{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {learningStyleOptionsData.map((style) => (
              <button
                type="button"
                key={style}
                className={`w-full px-4 py-2.5 rounded-lg text-sm border font-medium transition-colors focus:outline-none focus:ring-2 ${
                  currentPreferences.learningStyle === style
                    ? "bg-orange-500 text-white border-orange-500 ring-orange-500"
                    : "bg-gray-700 border-gray-600 hover:bg-gray-650 text-gray-300 hover:text-white ring-gray-600 focus:ring-orange-500"
                }`}
                onClick={() => {
                  onPreferencesChange({ learningStyle: style });
                  setLearningStyleError("");
                }}>
                {style}
              </button>
            ))}
          </div>
          {learningStyleError && (
            <p className="text-sm text-red-500 mt-1">{learningStyleError}</p>
          )}
        </div>
      )}
      {/* Add TeachingApproach section here if needed for Mentors, similar to learningStyle */}

      <div className="space-y-5 pt-3 border-t border-gray-700">
        <h3 className="text-xl font-semibold text-gray-200 pt-2">
          Privacy settings
        </h3>
        <InputCheckbox
          label="Private profile"
          name="isProfilePrivate"
          checked={currentPreferences.privacySettings.isProfilePrivate}
          onChange={(e) =>
            handlePrivacySettingChange("isProfilePrivate", e.target.checked)
          }
        />
        <p className="-mt-4 ml-[calc(1rem+8px)] text-xs text-gray-400">
          Only approved connections can view your full profile details
        </p>
        <InputCheckbox
          label="Allow messages"
          name="allowMessages"
          checked={currentPreferences.privacySettings.allowMessages}
          onChange={(e) =>
            handlePrivacySettingChange("allowMessages", e.target.checked)
          }
        />
        <p className="-mt-4 ml-[calc(1rem+8px)] text-xs text-gray-400">
          Let others initiate contact with you through messages
        </p>
        <InputCheckbox
          label="Receive notifications"
          name="receiveNotifications"
          checked={currentPreferences.privacySettings.receiveNotifications}
          onChange={(e) =>
            handlePrivacySettingChange("receiveNotifications", e.target.checked)
          }
        />
        <p className="-mt-4 ml-[calc(1rem+8px)] text-xs text-gray-400">
          Get email and in-app notifications for messages, session requests, and
          updates
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto flex-1 py-3 px-5 border border-gray-600 bg-gray-700 hover:bg-gray-650 rounded-lg text-gray-300 font-semibold">
          Back
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto flex-1 py-3 px-5 bg-orange-500 hover:bg-orange-600 rounded-lg text-white font-semibold">
          Complete Registration
        </button>
      </div>
    </form>
  );
};
export default PreferenceSetupPanel;
