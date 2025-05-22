// Registration.tsx
import React, { useState } from "react";
import StepProgressBar from "../../components/progress/StepProgressBar";
import RegistrationPanel from "../../components/register/panel/RegistrationPanel";
import ProfileCreatePanel from "../../components/register/panel/ProfileCreatePanel";
import PreferenceSetupPanel from "../../components/register/panel/PreferenceSetupPanel";
import { submitRegistration } from "../../services/registration.service";
import {
  UserRegistrationEntity,
  initialUserRegistrationEntity,
} from "../../types/userRegister.d"; // Adjust path

const Registration = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  // Single state object for all registration data
  const [formData, setFormData] = useState<UserRegistrationEntity>(
    initialUserRegistrationEntity
  );
  const [rawPassword, setRawPassword] = useState(""); // Keep password separate for security, hash before sending

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleAccountChange = (
    field: keyof UserRegistrationEntity["account"],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      account: { ...prev.account, [field]: value },
    }));
  };

  const handleProfileChange = (
    field: keyof UserRegistrationEntity["profile"],
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      profile: { ...prev.profile, [field]: value },
    }));
  };

  const handlePreferenceChange = (
    field:
      | keyof UserRegistrationEntity["preferences"]
      | keyof UserRegistrationEntity["preferences"]["privacySettings"],
    value: any,
    isPrivacySetting: boolean = false
  ) => {
    if (isPrivacySetting) {
      setFormData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          privacySettings: {
            ...prev.preferences.privacySettings,
            [field as keyof UserRegistrationEntity["preferences"]["privacySettings"]]:
              value,
          },
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [field as keyof UserRegistrationEntity["preferences"]]: value,
        },
      }));
    }
  };

  const handleFinalSubmit = async () => {
    // Assemble the final entity (formData already is the entity)
    // You might want to add rawPassword to a temporary object if your backend needs it for hashing
    const submissionData = {
      ...formData,
      account: {
        ...formData.account,
        // password: rawPassword, // Only if backend expects raw password
      },
    };
    console.log("Final Registration Entity to Submit:", submissionData);

    try {
      await submitRegistration(
        submissionData.account.email,
        rawPassword,
        JSON.stringify(submissionData.profile),
        JSON.stringify(submissionData.preferences)
      ); // Your service takes the entity

      console.log("Registration Successful! Submitted Data:", submissionData);
      alert("Registration complete!");
      // Reset state or redirect
      setFormData(initialUserRegistrationEntity);
      setRawPassword("");
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
            email={formData.account.email}
            password={rawPassword} // Use rawPassword state
            setEmail={(value) => handleAccountChange("email", value)}
            setPassword={setRawPassword} // Set rawPassword
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <ProfileCreatePanel
            profileData={formData.profile}
            onProfileChange={handleProfileChange}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <PreferenceSetupPanel
            preferencesData={formData.preferences}
            onPreferenceChange={handlePreferenceChange}
            userRole={formData.profile.role}
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
        {" "}
        {/* Panel width control */}
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
