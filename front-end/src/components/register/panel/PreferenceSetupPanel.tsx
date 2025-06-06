import React, { useState, useEffect } from "react";
import Dropdown from "../../input/Dropdown"; // Assume path is correct
import InputCheckbox from "../../input/InputCheckbox"; // Assume path is correct
import InputCustom from "../../input/InputCustom"; // Assume path is correct
import MultiSelectButtons from "../child/MultiSelectButtons"; // Assume path is correct
import {
  UserPreferences,
  LearnerDetails,
  MentorDetails,
} from "../../../types/userRegister.d"; // Assume path is correct

import {
  RoleEnum,
  SessionFrequencyOption,
  SessionDurationOption,
  LearningStyleOption,
  TeachingApproachOption,
  TopicOfInterest, // Import TopicOfInterest
} from "../../../types/commonType"; // Import common types if needed

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
  userRoleEnum: RoleEnum;
  onSubmit: () => void;
  onBack: () => void;
}

// Mappings for Enums to Labels
const topicOptionMappings = [
  { value: TopicOfInterest.CareerDevelopment, label: "Career Development" },
  { value: TopicOfInterest.TechnicalSkills, label: "Technical Skills" },
  { value: TopicOfInterest.Leadership, label: "Leadership" },
  { value: TopicOfInterest.Communication, label: "Communication" },
  { value: TopicOfInterest.WorkLifeBalance, label: "Work-Life Balance" },
  { value: TopicOfInterest.IndustryInsights, label: "Industry Insights" },
  { value: TopicOfInterest.Networking, label: "Networking" },
  { value: TopicOfInterest.Entrepreneurship, label: "Entrepreneurship" },
];

const frequencyOptionMappings = [
  { value: SessionFrequencyOption.Weekly.toString(), label: "Weekly" },
  {
    value: SessionFrequencyOption.Biweekly.toString(),
    label: "Bi-weekly (Every 2 weeks)",
  },
  { value: SessionFrequencyOption.Monthly.toString(), label: "Monthly" },
  { value: SessionFrequencyOption.AsNeeded.toString(), label: "As Needed" },
];

const durationOptionMappings = [
  { value: SessionDurationOption.HalfHour.toString(), label: "30 Minutes" },
  {
    value: SessionDurationOption.FortyFiveMinutes.toString(),
    label: "45 Minutes",
  },
  { value: SessionDurationOption.OneHour.toString(), label: "1 Hour" },
  {
    value: SessionDurationOption.OneAndHalfHour.toString(),
    label: "1.5 Hours",
  },
  { value: SessionDurationOption.TwoHours.toString(), label: "2 Hours" },
];

const learningStyleOptionMappings = [
  { value: LearningStyleOption.Visual, label: "Visual (seeing)" },
  { value: LearningStyleOption.Auditory, label: "Auditory (hearing)" },
  { value: LearningStyleOption.ReadingWriting, label: "Reading/Writing" },
  { value: LearningStyleOption.Kinesthetic, label: "Kinesthetic (doing)" },
];

const teachingApproachOptionMappings = [
  { value: TeachingApproachOption.HandsOn, label: "Hands-On Practice" },
  { value: TeachingApproachOption.TheoryBased, label: "Theory-Based" },
  {
    value: TeachingApproachOption.ProjectLedMentoring,
    label: "Project-Led Mentoring",
  },
  {
    value: TeachingApproachOption.StepByStepTutorials,
    label: "Step-by-Step Tutorials",
  },
];

const PreferenceSetupPanel: React.FC<Props> = ({
  currentPreferences,
  currentLearnerDetails,
  currentMentorDetails,
  onUpdate,
  userRoleEnum,
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

  // Generic type for mapping arrays
  type EnumMapping<E> = { value: E; label: string };

  const handleMultiSelectToggle = <
    E extends TopicOfInterest | LearningStyleOption | TeachingApproachOption
  >(
    selectedLabel: string,
    currentEnumSelection: E[] | undefined,
    fieldKey: "interestedTopics" | "learningStyle" | "teachingApproach",
    optionMappings: ReadonlyArray<EnumMapping<E>>,
    errorSetter?: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const selectedMapping = optionMappings.find(
      (m) => m.label === selectedLabel
    );
    if (!selectedMapping) {
      console.error("Invalid label selected in multi-select:", selectedLabel);
      return;
    }

    const selectedEnumValue = selectedMapping.value;
    const safeCurrentEnumSelection = currentEnumSelection || [];

    const newSelection = safeCurrentEnumSelection.includes(selectedEnumValue)
      ? safeCurrentEnumSelection.filter((item) => item !== selectedEnumValue)
      : [...safeCurrentEnumSelection, selectedEnumValue];

    // Type assertion is needed because fieldKey is a string literal union,
    // and TS can't directly infer the specific type of newSelection for `onUpdate`.
    if (fieldKey === "interestedTopics") {
      onUpdate({ [fieldKey]: newSelection as TopicOfInterest[] });
    } else if (fieldKey === "learningStyle") {
      onUpdate({ [fieldKey]: newSelection as LearningStyleOption[] });
    } else if (fieldKey === "teachingApproach") {
      onUpdate({ [fieldKey]: newSelection as TeachingApproachOption[] });
    }

    errorSetter?.("");
  };

  const handlePrivacySettingChange = (
    privacyField: keyof UserPreferences["privacySettings"],
    value: boolean
  ) => {
    onUpdate({
      privacySettings: {
        ...currentPreferences.privacySettings, // No need for nullish coalescing, it's not optional
        [privacyField]: value,
      },
    });
  };

  const validateAndSetFocusTarget = () => {
    let isValid = true;
    let focusTargetId: string | null = null;
    const setFocus = (id: string) => {
      if (!focusTargetId) focusTargetId = id;
    };

    const { interestedTopics, goal } = currentPreferences;

    if (interestedTopics.length === 0) {
      setTopicsError("Select at least one topic.");
      setFocus("topicsOfInterestGroup");
      isValid = false;
    } else {
      setTopicsError("");
    }

    if (!goal.trim()) {
      setGoalError("Your goal is required.");
      setFocus("preferencesGoalInput");
      isValid = false;
    } else if (goal.trim().length > 1000) {
      setGoalError("Max 1000 characters for goal.");
      setFocus("preferencesGoalInput");
      isValid = false;
    } else {
      setGoalError("");
    }

    if (userRoleEnum === RoleEnum.Learner) {
      if (
        !currentLearnerDetails?.learningStyle ||
        currentLearnerDetails.learningStyle.length === 0
      ) {
        setLearningStyleError("Select at least one learning style.");
        setFocus("learnerLearningStyleGroup");
        isValid = false;
      } else {
        setLearningStyleError("");
      }
    } else if (userRoleEnum === RoleEnum.Mentor) {
      if (
        !currentMentorDetails?.teachingApproach ||
        currentMentorDetails.teachingApproach.length === 0
      ) {
        setTeachingApproachError("Select at least one teaching approach.");
        setFocus("mentorTeachingApproachGroup");
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
      setFirstErrorFieldId(null); // Reset after focusing
    }
  }, [firstErrorFieldId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTopicsError("");
    setGoalError("");
    setLearningStyleError("");
    setTeachingApproachError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (validateAndSetFocusTarget()) {
      onSubmit();
    }
  };

  // Helper to get labels from enum values for MultiSelectButtons
  const getSelectedLabels = <E,>(
    enumArray: E[] | undefined,
    mappings: ReadonlyArray<EnumMapping<E>>
  ): string[] => {
    if (!enumArray) return [];
    return enumArray
      .map((val) => mappings.find((m) => m.value === val)?.label)
      .filter((label): label is string => !!label);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-white pb-8">
      <div id="topicsOfInterestGroup">
        <MultiSelectButtons
          label="Topics you're interested in learning about"
          options={topicOptionMappings.map((m) => m.label)}
          selectedOptions={getSelectedLabels(
            currentPreferences.interestedTopics,
            topicOptionMappings
          )}
          onToggleSelect={(label) =>
            handleMultiSelectToggle(
              label,
              currentPreferences.interestedTopics,
              "interestedTopics",
              topicOptionMappings,
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
          options={frequencyOptionMappings} // Pass the mapping array directly
          value={currentPreferences.sessionFrequency.toString()}
          onChange={(
            value // Assuming Dropdown passes back the 'value' part of the option
          ) =>
            onUpdate({
              sessionFrequency: value as unknown as SessionFrequencyOption,
            })
          }
          inputPadding="px-4 py-2.5" // Example, adjust as per your Dropdown component
          className="bg-gray-700 border-gray-600" // Example
          isRequired
          dataTestId="sessionFrequencyDropdown"
        />
        <Dropdown
          label="Preferred session duration"
          name="sessionDuration"
          options={durationOptionMappings} // Pass the mapping array directly
          value={currentPreferences.sessionDuration.toString()}
          onChange={(
            value // Assuming Dropdown passes back the 'value' part of the option
          ) =>
            onUpdate({
              sessionDuration: value as unknown as SessionDurationOption,
            })
          }
          inputPadding="px-4 py-2.5" // Example
          className="bg-gray-700 border-gray-600" // Example
          isRequired
          dataTestId="sessionDurationDropdown"
        />
      </div>

      <InputCustom
        label="Your Goal(s)"
        name="goal"
        type="textarea"
        value={currentPreferences.goal}
        onChange={(e) => {
          const value = e.target.value;
          if (value.length <= 1000) {
            onUpdate({ goal: e.target.value });
            setGoalError("");
          } else {
            setGoalError("Please enter goal under 1000 characters.");
          }
        }}
        placeholder="Describe your main learning or mentoring goal for using this platform..."
        isRequired
        errorMessage={goalError}
        className="min-h-[100px] bg-gray-800 border-gray-700 p-3"
      />

      {userRoleEnum === RoleEnum.Learner && currentLearnerDetails && (
        <div id="learnerLearningStyleGroup">
          <MultiSelectButtons
            label="Your Preferred Learning Style(s)"
            options={learningStyleOptionMappings.map((m) => m.label)}
            selectedOptions={getSelectedLabels(
              currentLearnerDetails.learningStyle,
              learningStyleOptionMappings
            )}
            onToggleSelect={(label) =>
              handleMultiSelectToggle(
                label,
                currentLearnerDetails.learningStyle,
                "learningStyle",
                learningStyleOptionMappings,
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
      {userRoleEnum === RoleEnum.Mentor && currentMentorDetails && (
        <div id="mentorTeachingApproachGroup">
          <MultiSelectButtons
            label="Your Preferred Teaching Approach(es)"
            options={teachingApproachOptionMappings.map((m) => m.label)}
            selectedOptions={getSelectedLabels(
              currentMentorDetails.teachingApproach,
              teachingApproachOptionMappings
            )}
            onToggleSelect={(label) =>
              handleMultiSelectToggle(
                label,
                currentMentorDetails.teachingApproach,
                "teachingApproach",
                teachingApproachOptionMappings,
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
          checked={currentPreferences.privacySettings.privacyProfile}
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
          checked={currentPreferences.privacySettings.messagePermission}
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
          checked={currentPreferences.privacySettings.notificationsEnabled}
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
