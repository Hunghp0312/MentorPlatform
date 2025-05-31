import { useState } from "react";
import StepProgressBar from "../../components/progress/StepProgressBar";
import RegistrationPanel from "../../components/register/panel/RegistrationPanel";
import ProfileCreatePanel from "../../components/register/panel/ProfileCreatePanel";
import PreferenceSetupPanel from "../../components/register/panel/PreferenceSetupPanel";
import { registrionService } from "../../services/registration.service";
import {
  UserRegistrationRequest,
  SharedProfileDetails,
  UserPreferences,
  createInitialData,
  AccountDetails,
} from "../../types/userRegister.d";
import {
  RoleEnum,
  LearningStyleOption,
  TeachingApproachOption,
} from "../../types/commonType";
import { useNavigate } from "react-router-dom";
import { pathName } from "../../constants/pathName";
import { AxiosError } from "axios";

interface ErrorResponse {
  message?: string;
  errors?: Record<string, string>;
}

const Registration = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [formData, setFormData] = useState<UserRegistrationRequest>(
    createInitialData(RoleEnum.Learner)
  );

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  const navigation = useNavigate();

  const handleAccountSubmit = (accountDetails: AccountDetails) => {
    setFormData((prev) => ({ ...prev, account: accountDetails }));
    nextStep();
  };

  const handleSharedProfileUpdate = (
    updates: Partial<SharedProfileDetails>
  ) => {
    setFormData((prev) => {
      const newProfileData = { ...prev.profile, ...updates };
      if (
        prev.role === RoleEnum.Mentor &&
        updates.industryExperience !== undefined
      ) {
        let currentMentorDetails = {};
        if (
          prev.role === RoleEnum.Mentor &&
          "mentorDetails" in prev &&
          prev.mentorDetails
        ) {
          currentMentorDetails = prev.mentorDetails;
        }
        return {
          ...prev,
          profile: newProfileData,
          mentorDetails: {
            ...currentMentorDetails,
            industryExperience: updates.industryExperience,
          },
        } as UserRegistrationRequest;
      }
      return { ...prev, profile: newProfileData };
    });
  };

  const handleRoleEnumChange = (newRoleEnum: RoleEnum) => {
    setFormData((prev) => {
      const newStructure = createInitialData(newRoleEnum);
      const preservedProfileData: Partial<SharedProfileDetails> = {
        fullName: prev.profile.fullName,
        bio: prev.profile.bio,
        profilePictureFile: prev.profile.profilePictureFile,
        contact: prev.profile.contact,
        expertise: prev.profile.expertise,
        availability: prev.profile.availability,
        preferredCommunication: prev.profile.preferredCommunication,
        skills: prev.profile.skills || "",
        industryExperience: prev.profile.industryExperience || "",
      };

      if (newRoleEnum === RoleEnum.Learner) {
        return {
          ...newStructure,
          account: prev.account,
          profile: { ...newStructure.profile, ...preservedProfileData },
          preferences: prev.preferences,
        } as UserRegistrationRequest;
      } else {
        let currentMentorDetails = {};
        if (
          prev.role === RoleEnum.Mentor &&
          "mentorDetails" in prev &&
          prev.mentorDetails
        ) {
          currentMentorDetails = prev.mentorDetails;
        }
        return {
          ...newStructure,
          account: prev.account,
          profile: { ...newStructure.profile, ...preservedProfileData },
          mentorDetails: {
            ...currentMentorDetails,
            industryExperience: preservedProfileData.industryExperience ?? "",
          },
          preferences: prev.preferences,
        } as UserRegistrationRequest;
      }
    });
  };

  const createProfile = async () => {
    try {
      const response = await registrionService.createProfile(formData);
      return response.userId;
    } catch (error) {
      setStep(2);
      throw error;
    }
  };

  const setPreferences = async (userId: string) => {
    try {
      await registrionService.setPreference(formData, userId);
    } catch (error) {
      setStep(3);
      throw error;
    }
  };

  const handlePreferencesAndRoleEnumSpecificDetailsUpdate = (
    updates: Partial<
      UserPreferences & {
        learningStyle?: LearningStyleOption[];
        teachingApproach?: TeachingApproachOption[];
      }
    >
  ) => {
    setFormData((prev) => {
      const { learningStyle, teachingApproach, ...preferenceUpdates } = updates;
      const updatedFormData = {
        ...prev,
        preferences: { ...prev.preferences, ...preferenceUpdates },
      };

      if (
        updatedFormData.role === RoleEnum.Learner &&
        learningStyle !== undefined
      ) {
        let currentLearnerDetails = {};
        if (
          prev.role === RoleEnum.Learner &&
          "learnerDetails" in prev &&
          prev.learnerDetails
        ) {
          currentLearnerDetails = prev.learnerDetails;
        }
        (
          updatedFormData as UserRegistrationRequest & {
            RoleEnum: RoleEnum.Learner;
            learnerDetails: typeof currentLearnerDetails;
          }
        ).learnerDetails = {
          ...currentLearnerDetails,
          learningStyle: learningStyle,
        };
      }
      if (
        updatedFormData.role === RoleEnum.Mentor &&
        teachingApproach !== undefined
      ) {
        if (
          "mentorDetails" in updatedFormData &&
          updatedFormData.mentorDetails
        ) {
          updatedFormData.mentorDetails = {
            ...updatedFormData.mentorDetails,
            teachingApproach: teachingApproach,
          };
        }
      }
      return updatedFormData as UserRegistrationRequest;
    });
  };

  const handleFinalSubmit = async () => {
    try {
      setFormData(createInitialData(RoleEnum.Learner));

      const userId = await createProfile();

      await setPreferences(userId);

      alert("Registration success.");
      setStep(1);
      navigation(pathName.login);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError?.response?.data?.message) {
        alert(axiosError.response.data.message);
        return;
      }
      if (axiosError?.response?.data?.errors) {
        for (const key in axiosError.response.data.errors) {
          const errorMessage = axiosError.response.data.errors[key];
          alert(`${errorMessage}`);
          return;
        }
      }
      console.error("Registration error:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <RegistrationPanel
            initialEmail={formData.account.email}
            initialPassword={formData.account.password}
            initialConfirm={formData.account.confirmPassword}
            initialAgreed={formData.account.agreedToTerms}
            onAccountSubmit={handleAccountSubmit}
          />
        );
      case 2:
        return (
          <ProfileCreatePanel
            currentUserData={formData}
            onUpdateProfile={handleSharedProfileUpdate}
            onRoleChange={handleRoleEnumChange}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <PreferenceSetupPanel
            currentPreferences={formData.preferences}
            currentLearnerDetails={
              formData.role === RoleEnum.Learner && "learnerDetails" in formData
                ? formData.learnerDetails
                : undefined
            }
            currentMentorDetails={
              formData.role === RoleEnum.Mentor && "mentorDetails" in formData
                ? formData.mentorDetails
                : undefined
            }
            onUpdate={handlePreferencesAndRoleEnumSpecificDetailsUpdate}
            userRoleEnum={formData.role}
            onSubmit={handleFinalSubmit}
            onBack={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-6">
      <div className="w-full max-w-3xl mx-auto mt-10">
        <div className="bg-gray-800 p-8 sm:p-10 rounded-xl shadow-xl">
          <div className="flex justify-between items-start gap-4 sm:gap-6 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-left flex-shrink-0">
              {(() => {
                if (step === 1) return "Create Your Account";
                if (step === 2) return "Setup Your Profile";
                return "Set Your Preferences";
              })()}
            </h2>

            <div className="w-64">
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
