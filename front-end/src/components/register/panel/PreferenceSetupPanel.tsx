import React, { useState, useEffect } from "react";
import Dropdown from "../../input/Dropdown";
import InputCheckbox from "../../input/InputCheckbox";
import InputCustom from "../../input/InputCustom";
import MultiSelectButtons from "../child/MultiSelectButtons";
import {
  UserPreferences,
  LearnerDetails,
  MentorDetails,
  Role,
  SessionFrequencyOption,
  SessionDurationOption,
  LearningStyleOption,
  TeachingApproachOption,
} from "../../../types/userRegister.d";

interface Props {
  currentPreferences: UserPreferences;
  currentLearnerDetails?: LearnerDetails;
  currentMentorDetails?: MentorDetails;
  onUpdate: (
    updates: Partial<
      UserPreferences & {
        learningStyle: LearningStyleOption[];
        teachingApproach: TeachingApproachOption[];
      }
    >
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
const frequencyOptionsData = Object.values(SessionFrequencyOption).map(
  (value) => ({ value, label: value })
);
const durationOptionsData = Object.values(SessionDurationOption).map(
  (value) => ({ value, label: value })
);
const learningStyleOptionsData = Object.values(LearningStyleOption);
const teachingApproachOptionsData = Object.values(TeachingApproachOption);

const PreferenceSetupPanel: React.FC<Props> = ({
  currentPreferences,
  currentLearnerDetails,
  currentMentorDetails,
  onUpdate,
  userRole,
  onSubmit,
  onBack,
}) => {
  const [topicsError, setTopicsError] = useState("");
  const [goalError, setGoalError] = useState("");
  const [learningStyleError, setLearningStyleError] = useState("");
  const [teachingApproachError, setTeachingApproachError] = useState("");
  const [firstErrorFieldId, setFirstErrorFieldId] = useState<string | null>(
    null
  );

  const handleMultiSelectToggle = (
    option: string,
    currentSelection: string[] | undefined,
    fieldKey: "interestedTopics" | "learningStyle" | "teachingApproach",
    errorSetter?: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const safeCurrentSelection = currentSelection || [];
    const newSelection = safeCurrentSelection.includes(option)
      ? safeCurrentSelection.filter((item) => item !== option)
      : [...safeCurrentSelection, option];

    onUpdate({ [fieldKey]: newSelection } as any);
    errorSetter?.("");
  };

  const handlePrivacySettingChange = (
    privacyField: keyof UserPreferences["privacySettings"],
    value: boolean
  ) => {
    onUpdate({
      privacySettings: {
        ...(currentPreferences.privacySettings ?? {}),
        [privacyField]: value,
      },
    });
  };

  const validateAndSetFocusTarget = () => {
    let isValid = true;
    let focusTargetId: string | null = null;
    const { interestedTopics, goal } = currentPreferences;

    if (interestedTopics.length === 0) {
      setTopicsError("Select at least one topic.");
      focusTargetId ??= "topicsOfInterestGroup";
      isValid = false;
    } else {
      setTopicsError("");
    }

    if (!goal.trim()) {
      setGoalError("Goal is required.");
      focusTargetId ??= "preferencesGoalInput";
      isValid = false;
    } else if (goal.trim().length > 1000) {
      setGoalError("Max 1000 characters.");
      focusTargetId ??= "preferencesGoalInput";
      isValid = false;
    } else {
      setGoalError("");
    }

    if (userRole === Role.Learner) {
      if (
        !currentLearnerDetails?.learningStyle ||
        currentLearnerDetails.learningStyle.length === 0
      ) {
        setLearningStyleError("Select at least one learning style.");
        focusTargetId ??= "learnerLearningStyleGroup";
        isValid = false;
      } else {
        setLearningStyleError("");
      }
    } else if (userRole === Role.Mentor) {
      if (
        !currentMentorDetails?.teachingApproach ||
        currentMentorDetails.teachingApproach.length === 0
      ) {
        setTeachingApproachError("Select at least one teaching approach.");
        focusTargetId ??= "mentorTeachingApproachGroup";
        isValid = false;
      } else {
        setTeachingApproachError("");
      }
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
    setTopicsError("");
    setGoalError("");
    setLearningStyleError("");
    setTeachingApproachError("");

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
            handleMultiSelectToggle(
              option,
              currentPreferences.interestedTopics,
              "interestedTopics",
              setTopicsError
            )
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
            onUpdate({ sessionFrequency: value as SessionFrequencyOption })
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
            onUpdate({ sessionDuration: value as SessionDurationOption })
          }
          inputPadding="px-4 py-2.5"
          className="bg-gray-700 border-gray-600"
          isRequired
        />
      </div>

      <InputCustom
        label="Your Goal(s)"
        name="goal"
        type="textarea"
        value={currentPreferences.goal}
        onChange={(e) => onUpdate({ goal: e.target.value })}
        placeholder="Describe your main goal..."
        isRequired
        errorMessage={goalError}
        className="min-h-[100px] bg-gray-800 border-gray-700 p-3"
      />

      {userRole === Role.Learner && currentLearnerDetails && (
        <div id="learnerLearningStyleGroup">
          <MultiSelectButtons
            label="Your Preferred Learning Style(s)"
            options={learningStyleOptionsData}
            selectedOptions={currentLearnerDetails.learningStyle}
            onToggleSelect={(option) =>
              handleMultiSelectToggle(
                option,
                currentLearnerDetails.learningStyle,
                "learningStyle",
                setLearningStyleError
              )
            }
            gridColsClass="grid-cols-2 sm:grid-cols-4"
            isRequired
          />
          {learningStyleError && (
            <p className="text-sm text-red-500 mt-1">{learningStyleError}</p>
          )}
        </div>
      )}
      {userRole === Role.Mentor && currentMentorDetails && (
        <div id="mentorTeachingApproachGroup">
          <MultiSelectButtons
            label="Your Preferred Teaching Approach(es)"
            options={teachingApproachOptionsData}
            selectedOptions={currentMentorDetails.teachingApproach}
            onToggleSelect={(option) =>
              handleMultiSelectToggle(
                option,
                currentMentorDetails.teachingApproach,
                "teachingApproach",
                setTeachingApproachError
              )
            }
            gridColsClass="grid-cols-2 sm:grid-cols-4"
            isRequired
          />
          {teachingApproachError && (
            <p className="text-sm text-red-500 mt-1">{teachingApproachError}</p>
          )}
        </div>
      )}

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
