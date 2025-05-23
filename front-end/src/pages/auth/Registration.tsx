// Registration.tsx
import React, { useState } from "react";
import StepProgressBar from "../../components/progress/StepProgressBar";
import RegistrationPanel from "../../components/register/panel/RegistrationPanel";
import ProfileCreatePanel from "../../components/register/panel/ProfileCreatePanel";
import PreferenceSetupPanel from "../../components/register/panel/PreferenceSetupPanel";
import { submitRegistration } from "../../services/registration.service";
import {
  UserRegistrationRequest,
  AccountDetails,
  SharedProfileDetails,
  LearnerDetails,
  MentorDetails,
  UserPreferences,
  Role,
  createInitialData,
  LearningStyleOption,
  TeachingApproachOption,
} from "../../types/userRegister.d";

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

  // This updater is simplified because ProfileCreatePanel will only send SharedProfileDetails updates
  const handleSharedProfileUpdate = (
    updates: Partial<SharedProfileDetails>
  ) => {
    setFormData((prev) => {
      const newProfileData = { ...prev.profile, ...updates };
      // If the role is Mentor and industryExperience is updated via shared profile,
      // also update the specific mentorDetails.industryExperience.
      if (
        prev.role === Role.Mentor &&
        updates.industryExperience !== undefined
      ) {
        // We need to ensure we are working with the Mentor version of the formData
        const currentMentorData = prev as Extract<
          UserRegistrationRequest,
          { role: Role.Mentor }
        >;
        return {
          ...prev,
          profile: newProfileData,
          mentorDetails: {
            ...currentMentorData.mentorDetails,
            industryExperience: updates.industryExperience,
          },
        } as UserRegistrationRequest; // Cast back to the union type
      }
      return { ...prev, profile: newProfileData };
    });
  };

  const handleRoleChange = (newRole: Role) => {
    setFormData((prev) => {
      const newStructure = createInitialData(newRole);
      const preservedProfileData: Partial<SharedProfileDetails> = {
        fullName: prev.profile.fullName,
        bio: prev.profile.bio,
        profilePictureFile: prev.profile.profilePictureFile,
        expertise: prev.profile.expertise,
        availability: prev.profile.availability,
        preferredCommunication: prev.profile.preferredCommunication,
        skills: prev.profile.skills || [],
        industryExperience: prev.profile.industryExperience || "",
      };

      if (newRole === Role.Learner) {
        return {
          ...newStructure, // This is already a Learner structure
          account: prev.account,
          profile: { ...newStructure.profile, ...preservedProfileData },
          preferences: prev.preferences,
        } as UserRegistrationRequest; // Ensure correct type
      } else {
        // Mentor
        const currentMentorDetails = (
          newStructure as Extract<
            UserRegistrationRequest,
            { role: Role.Mentor }
          >
        ).mentorDetails;
        return {
          ...newStructure, // This is already a Mentor structure
          account: prev.account,
          profile: { ...newStructure.profile, ...preservedProfileData },
          mentorDetails: {
            // Ensure mentorDetails is correctly structured
            ...currentMentorDetails,
            industryExperience: preservedProfileData.industryExperience || "", // Sync from what was in shared
            // teachingApproach will come from newStructure.mentorDetails
          },
          preferences: prev.preferences,
        } as UserRegistrationRequest; // Ensure correct type
      }
    });
  };

  const handlePreferencesAndRoleSpecificDetailsUpdate = (
    updates: Partial<
      UserPreferences & {
        learningStyle?: LearningStyleOption[];
        teachingApproach?: TeachingApproachOption[];
      }
    >
  ) => {
    setFormData((prev) => {
      const { learningStyle, teachingApproach, ...preferenceUpdates } = updates;
      let updatedFormData = {
        ...prev,
        preferences: { ...prev.preferences, ...preferenceUpdates },
      };

      if (
        updatedFormData.role === Role.Learner &&
        learningStyle !== undefined
      ) {
        updatedFormData.learnerDetails = {
          ...updatedFormData.learnerDetails,
          learningStyle: learningStyle,
        };
      }
      if (
        updatedFormData.role === Role.Mentor &&
        teachingApproach !== undefined
      ) {
        updatedFormData.mentorDetails = {
          ...updatedFormData.mentorDetails,
          teachingApproach: teachingApproach,
        };
      }
      return updatedFormData as UserRegistrationRequest; // Cast needed because TS can't infer the exact union member after conditional spreads
    });
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
            initialPassword={formData.account.password}
            onAccountSubmit={handleAccountSubmit}
          />
        );
      case 2:
        return (
          <ProfileCreatePanel
            currentUserData={formData}
            onUpdateProfile={handleSharedProfileUpdate} // Changed prop name for clarity
            onRoleChange={handleRoleChange}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <PreferenceSetupPanel
            currentPreferences={formData.preferences}
            // Pass learnerDetails or mentorDetails based on the role for PreferenceSetupPanel to use
            currentLearnerDetails={
              formData.role === Role.Learner
                ? formData.learnerDetails
                : undefined
            }
            currentMentorDetails={
              formData.role === Role.Mentor ? formData.mentorDetails : undefined
            }
            onUpdate={handlePreferencesAndRoleSpecificDetailsUpdate}
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
