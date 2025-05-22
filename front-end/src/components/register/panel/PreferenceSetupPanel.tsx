// PreferenceSetupPanel.tsx
import React, { useState, useEffect } from "react";
import Dropdown from "../../input/Dropdown";
import InputCheckbox from "../../input/InputCheckbox";
import InputCustom from "../../input/InputCustom";
import MultiSelectButtons from "../child/MultiSelectButtons"; // Re-use from Profile panel's children if structure allows
import {
  UserPreferences,
  LearningStyle,
  TeachingApproach,
  SessionFrequency,
  SessionDuration,
} from "../../../types/userRegister.d"; // Adjust path

interface Props {
  preferencesData: UserPreferences;
  onPreferenceChange: (
    field: keyof UserPreferences | keyof UserPreferences["privacySettings"],
    value: any,
    isPrivacySetting?: boolean
  ) => void;
  userRole: "Learner" | "Mentor" | string;
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
  { value: "Weekly" as SessionFrequency, label: "Weekly" },
  { value: "Every two weeks" as SessionFrequency, label: "Every two weeks" },
  { value: "Monthly" as SessionFrequency, label: "Monthly" },
  { value: "As needed" as SessionFrequency, label: "As needed" },
];
const durationOptionsData = [
  { value: "30 minutes" as SessionDuration, label: "30 minutes" },
  { value: "1 hour" as SessionDuration, label: "1 hour" },
  { value: "1.5 hours" as SessionDuration, label: "1.5 hours" },
  { value: "2 hours" as SessionDuration, label: "2 hours" },
];
const learningStyleOptionsData: LearningStyle[] = [
  "Visual",
  "Auditory",
  "Reading/Writing",
  "Kinesthetic",
];
const teachingApproachOptionsData: TeachingApproach[] = [
  "Hands-on",
  "Theory based",
  "Project-Led Mentoring",
  "Step-by-Step Tutorials",
];

const PreferenceSetupPanel: React.FC<Props> = ({
  preferencesData,
  onPreferenceChange,
  userRole,
  onSubmit,
  onBack,
}) => {
  // Local error states for this panel
  const [topicsError, setTopicsError] = useState("");
  const [learningGoalsError, setLearningGoalsError] = useState("");
  // Add error states for learningStyles/teachingApproaches if they are required
  const [roleSpecificPrefsError, setRoleSpecificPrefsError] = useState("");

  const [firstErrorFieldId, setFirstErrorFieldId] = useState<string | null>(
    null
  );

  const handleMultiSelectToggle = (
    option: string,
    field: keyof Pick<
      UserPreferences,
      "topicsOfInterest" | "preferredLearningStyles" | "teachingApproaches"
    >,
    errorSetter?: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const currentSelection =
      (preferencesData[field] as string[] | undefined) || [];
    const newSelection = currentSelection.includes(option)
      ? currentSelection.filter((item) => item !== option)
      : [...currentSelection, option];
    onPreferenceChange(field, newSelection);
    errorSetter?.("");
  };

  const validateAndSetFocusTarget = () => {
    let isValid = true;
    let focusTargetId: string | null = null;
    const {
      topicsOfInterest,
      learningGoals,
      preferredLearningStyles,
      teachingApproaches,
    } = preferencesData;

    if (topicsOfInterest.length === 0) {
      setTopicsError("Select at least one topic.");
      focusTargetId ??= "topicsOfInterestGroup";
      isValid = false;
    } else {
      setTopicsError("");
    }

    if (
      userRole === "Learner" &&
      (!preferredLearningStyles || preferredLearningStyles.length === 0)
    ) {
      setRoleSpecificPrefsError("Select at least one learning style.");
      focusTargetId ??= "preferredLearningStylesGroup"; // ID for the MultiSelectButtons container
      isValid = false;
    } else if (
      userRole === "Mentor" &&
      (!teachingApproaches || teachingApproaches.length === 0)
    ) {
      setRoleSpecificPrefsError("Select at least one teaching approach.");
      focusTargetId ??= "teachingApproachesGroup"; // ID for the MultiSelectButtons container
      isValid = false;
    } else {
      setRoleSpecificPrefsError("");
    }

    if (learningGoals && learningGoals.trim().length > 1000) {
      setLearningGoalsError("Max 1000 characters.");
      focusTargetId ??= "learningGoalsInput";
      isValid = false;
    } else {
      setLearningGoalsError("");
    }
    // Note: "learningGoals" is optional in the type, so no empty check unless it's explicitly required.

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
    setTopicsError("");
    setRoleSpecificPrefsError("");
    setLearningGoalsError("");

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
          selectedOptions={preferencesData.topicsOfInterest}
          onToggleSelect={(option) =>
            handleMultiSelectToggle(option, "topicsOfInterest", setTopicsError)
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
          value={preferencesData.sessionFrequency}
          onChange={(value) => onPreferenceChange("sessionFrequency", value)}
          inputPadding="px-4 py-2.5"
          className="bg-gray-700 border-gray-600"
          isRequired
        />
        <Dropdown
          label="Preferred session duration"
          name="sessionDuration"
          options={durationOptionsData}
          value={preferencesData.sessionDuration}
          onChange={(value) => onPreferenceChange("sessionDuration", value)}
          inputPadding="px-4 py-2.5"
          className="bg-gray-700 border-gray-600"
          isRequired
        />
      </div>

      {userRole === "Learner" && (
        <div id="preferredLearningStylesGroup">
          <MultiSelectButtons
            label="Your preferred learning style"
            options={learningStyleOptionsData}
            selectedOptions={preferencesData.preferredLearningStyles || []}
            onToggleSelect={(option) =>
              handleMultiSelectToggle(
                option as LearningStyle,
                "preferredLearningStyles",
                setRoleSpecificPrefsError
              )
            }
            gridColsClass="grid-cols-2 sm:grid-cols-4"
            isRequired
          />
          {roleSpecificPrefsError && userRole === "Learner" && (
            <p className="text-sm text-red-500 mt-1">
              {roleSpecificPrefsError}
            </p>
          )}
        </div>
      )}

      {userRole === "Mentor" && (
        <div id="teachingApproachesGroup">
          <MultiSelectButtons
            label="Teaching Approach"
            options={teachingApproachOptionsData}
            selectedOptions={preferencesData.teachingApproaches || []}
            onToggleSelect={(option) =>
              handleMultiSelectToggle(
                option as TeachingApproach,
                "teachingApproaches",
                setRoleSpecificPrefsError
              )
            }
            gridColsClass="grid-cols-2 sm:grid-cols-4"
            isRequired
          />
          {roleSpecificPrefsError && userRole === "Mentor" && (
            <p className="text-sm text-red-500 mt-1">
              {roleSpecificPrefsError}
            </p>
          )}
        </div>
      )}

      <InputCustom
        label="What do you hope to learn? (Optional)"
        name="learningGoals"
        type="textarea"
        value={preferencesData.learningGoals || ""}
        onChange={(e) => onPreferenceChange("learningGoals", e.target.value)}
        placeholder="Describe your learning objectives and what you hope to achieve…"
        errorMessage={learningGoalsError}
        className="min-h-[100px] bg-gray-800 border-gray-700 p-3"
      />

      <div className="space-y-5 pt-3 border-t border-gray-700">
        <h3 className="text-xl font-semibold text-gray-200 pt-2">
          Privacy settings
        </h3>
        <InputCheckbox
          label="Private profile"
          name="isProfilePrivate"
          checked={preferencesData.privacySettings.isProfilePrivate}
          onChange={(e) =>
            onPreferenceChange("isProfilePrivate", e.target.checked, true)
          }
        />
        <p className="-mt-4 ml-[calc(1rem+8px)] text-xs text-gray-400">
          Only approved connections can view your full profile details
        </p>
        <InputCheckbox
          label="Allow messages"
          name="allowMessages"
          checked={preferencesData.privacySettings.allowMessages}
          onChange={(e) =>
            onPreferenceChange("allowMessages", e.target.checked, true)
          }
        />
        <p className="-mt-4 ml-[calc(1rem+8px)] text-xs text-gray-400">
          Let others initiate contact with you through messages
        </p>
        <InputCheckbox
          label="Receive notifications"
          name="receiveNotifications"
          checked={preferencesData.privacySettings.receiveNotifications}
          onChange={(e) =>
            onPreferenceChange("receiveNotifications", e.target.checked, true)
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
          className="w-full sm:w-auto flex-1 py-3 px-5 border border-gray-600 bg-gray-700 hover:bg-gray-650 transition rounded-lg text-gray-300 font-semibold">
          Back
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto flex-1 py-3 px-5 bg-orange-500 hover:bg-orange-600 transition rounded-lg text-white font-semibold">
          Complete Registration
        </button>
      </div>
    </form>
  );
};

export default PreferenceSetupPanel;
