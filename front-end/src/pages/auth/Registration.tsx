import { useState } from "react";
import StepProgressBar from "../../components/progress/StepProgressBar";
import RegistrationPanel from "../../components/panel/RegistrationPanel";
import ProfileCreatePanel from "../../components/panel/ProfileCreatePanel";
import PreferenceSetupPanel from "../../components/panel/PreferenceSetupPanel";
import { submitRegistration } from "../../services/registration.service";

const Registration = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState("");
  const [preferences, setPreferences] = useState("");

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));

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
          />
        );
      case 3:
        return (
          <PreferenceSetupPanel
            preferences={preferences}
            setPreferences={setPreferences}
            onSubmit={handleFinalSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 py-12 text-white">
      <StepProgressBar step={step} totalSteps={totalSteps} />

      <div className="bg-gray-800 p-10 rounded-xl shadow-xl mt-8">
        <h2 className="text-3xl font-bold mb-8 text-center">
          {step === 1
            ? "Create Your Account"
            : step === 2
            ? "Setup Your Profile"
            : "Your Preferences"}
        </h2>

        {renderStep()}
      </div>
    </div>
  );
};

export default Registration;
