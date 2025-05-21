import { useState } from "react";
import StepProgressBar from "../../components/progress/StepProgressBar";
import RegistrationPanel from "../../components/register/panel/RegistrationPanel";
import ProfileCreatePanel from "../../components/register/panel/ProfileCreatePanel";
import PreferenceSetupPanel from "../../components/register/panel/PreferenceSetupPanel";
import { submitRegistration } from "../../services/registration.service";

const Registration = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState("");
  const [preferences, setPreferences] = useState("");

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleFinalSubmit = async () => {
    await submitRegistration(email, password, profile, preferences);
    alert("Registration complete!");
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <RegistrationPanel
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <ProfileCreatePanel
            profile={profile}
            setProfile={setProfile}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <PreferenceSetupPanel
            preferences={preferences}
            setPreferences={setPreferences}
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
      <div className="bg-gray-800 p-8 sm:p-10 rounded-xl shadow-xl">
        <div className="flex justify-between items-start mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-left">
            {step === 1
              ? "Create Your Account"
              : step === 2
              ? "Setup Your Profile"
              : "Your Preferences"}
          </h2>
          <div className="w-32 sm:w-36 md:w-40 flex-shrink-0 ml-4">
            {" "}
            {/* Sizing and spacing for progress bar */}
            <StepProgressBar step={step} totalSteps={totalSteps} />
          </div>
        </div>
        {renderStep()}
      </div>
    </div>
  );
};

export default Registration;
