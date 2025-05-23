// Registration.tsx
import React, { useState } from "react";
import StepProgressBar from "../../components/progress/StepProgressBar"; // Adjust
import RegistrationPanel from "../../components/register/panel/RegistrationPanel"; // Adjust
import ProfileCreatePanel from "../../components/register/panel/ProfileCreatePanel"; // Adjust
import PreferenceSetupPanel from "../../components/register/panel/PreferenceSetupPanel"; // Adjust
import { submitRegistration } from "../../services/registration.service"; // Adjust
import {
  UserRegistrationRequest,
  AccountDetails,
  SharedProfileDetails,
  LearnerDetails,
  MentorDetails,
  UserPreferences,
  Role,
  createInitialData,
} from "../../types/userRegister.d"; // Adjust

const Registration = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState<UserRegistrationRequest>(
    createInitialData(Role.Learner)
  );

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleAccountSubmit = (accountDetails: AccountDetails) => {
    setFormData((prev) => ({ ...prev, account: accountDetails }));
    nextStep();
  };

  const handleProfileUpdate = (
    updates:
      | Partial<SharedProfileDetails>
      | Partial<LearnerDetails>
      | Partial<MentorDetails>,
    detailType: "profile" | "learnerDetails" | "mentorDetails"
  ) => {
    setFormData((prev) => {
      if (detailType === "profile") {
        return { ...prev, profile: { ...prev.profile, ...updates } };
      }
      if (prev.role === Role.Learner && detailType === "learnerDetails") {
        return {
          ...prev,
          learnerDetails: {
            ...prev.learnerDetails,
            ...(updates as Partial<LearnerDetails>),
          },
        };
      }
      if (prev.role === Role.Mentor && detailType === "mentorDetails") {
        return {
          ...prev,
          mentorDetails: {
            ...prev.mentorDetails,
            ...(updates as Partial<MentorDetails>),
          },
        };
      }
      return prev;
    });
  };

  const handleRoleChange = (newRole: Role) => {
    setFormData((prev) => {
      const newStructure = createInitialData(newRole);
      return {
        ...newStructure,
        account: prev.account, // Keep existing account info
        profile: {
          // Keep existing shared profile info, but ensure new role
          ...newStructure.profile, // Gets default picture if any
          fullName: prev.profile.fullName,
          bio: prev.profile.bio,
          profilePictureFile: prev.profile.profilePictureFile,
        },
        // Use preferences from new structure to get role-specific defaults
        preferences: newStructure.preferences,
      };
    });
  };

  const handlePreferencesUpdate = (
    updates:
      | Partial<UserPreferences>
      | ((prevPrefs: UserPreferences) => UserPreferences)
  ) => {
    setFormData((prev) => ({
      ...prev,
      preferences:
        typeof updates === "function"
          ? updates(prev.preferences)
          : { ...prev.preferences, ...updates },
    }));
  };

  const handleFinalSubmit = async () => {
    console.log("Final Registration Data to Submit:", formData);
    try {
      const { account, profile, preferences } = formData;
      await submitRegistration(
        account.email,
        account.password,
        JSON.stringify(profile),
        JSON.stringify(preferences)
      );
      alert("Registration complete!");
      setFormData(createInitialData(Role.Learner));
      setStep(1);
    } catch (error) {
      console.error("Registration submission failed:", error);
      alert("Registration failed. Please try again.");
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <RegistrationPanel
            initialEmail={formData.account.email}
            initialPassword={formData.account.password} // Pass current password (might be empty initially)
            onAccountSubmit={handleAccountSubmit}
          />
        );
      case 2:
        return (
          <ProfileCreatePanel
            currentUserData={formData}
            onUpdate={(updates) => {
              const { profile, learnerDetails, mentorDetails } = updates;
              if (profile) handleProfileUpdate(profile, "profile");
              if (learnerDetails)
                handleProfileUpdate(learnerDetails, "learnerDetails");
              if (mentorDetails)
                handleProfileUpdate(mentorDetails, "mentorDetails");
            }}
            onRoleChange={handleRoleChange}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <PreferenceSetupPanel
            currentPreferences={formData.preferences}
            onPreferencesChange={handlePreferencesUpdate}
            userRole={formData.role}
            onSubmit={handleFinalSubmit}
            onBack={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 py-12 text-white">
      <div className="w-full max-w-3xl">
        <div className="bg-gray-800 p-8 sm:p-10 rounded-xl shadow-xl">
          <div className="flex justify-between items-start gap-4 sm:gap-6 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-left flex-shrink-0">
              {step === 1
                ? "Create Your Account"
                : step === 2
                ? "Setup Your Profile"
                : "Set Your Preferences"}
            </h2>
            <div className="flex-grow min-w-0">
              <StepProgressBar step={step} totalSteps={totalSteps} />
            </div>
          </div>
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default Registration;
