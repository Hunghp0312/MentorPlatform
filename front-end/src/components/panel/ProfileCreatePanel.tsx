import React, { useState } from "react";
import { cn } from "../../utils/cn";

interface Props {
  profile: string;
  setProfile: (v: string) => void;
  onNext: () => void;
}

const roles = ["Learner", "Mentor"];
const expertiseOptions = [
  "Leadership",
  "Programming",
  "Design",
  "Marketing",
  "Data Science",
  "Business",
  "Project Management",
  "Communication",
];
const availabilityOptions = [
  "Weekdays",
  "Weekends",
  "Mornings",
  "Afternoons",
  "Evenings",
];
const communicationOptions = ["Video Call", "Audio Call", "Text Chat"];

const ProfileCreatePanel: React.FC<Props> = ({
  profile,
  setProfile,
  onNext,
}) => {
  const [selectedRole, setSelectedRole] = useState("Learner");
  const [fullName, setFullName] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [expertise, setExpertise] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [communication, setCommunication] = useState("Video Call");
  const [goals, setGoals] = useState("");

  const toggleSelect = (
    value: string,
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setState((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !profile.trim()) {
      alert("Please fill in all required fields.");
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-white">
      <div className="text-center">
        <div className="w-24 h-24 rounded-full bg-gray-600 mx-auto relative">
          {/* Upload button */}
          <label className="absolute -bottom-2 -right-2 bg-orange-500 p-1 rounded-full cursor-pointer">
            <input type="file" accept="image/*" className="hidden" />
            📷
          </label>
        </div>
        <p className="mt-2 text-sm">Upload a professional photo</p>
      </div>

      <div>
        <label className="block text-sm mb-1">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label className="block text-sm mb-2">I am joining as:</label>
        <div className="flex space-x-4">
          {roles.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setSelectedRole(role)}
              className={cn(
                "flex-1 px-4 py-2 rounded border font-semibold",
                selectedRole === role
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-gray-700 border-gray-600 hover:bg-gray-600"
              )}>
              {role}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Bio</label>
        <textarea
          placeholder="A brief introduction about yourself..."
          value={profile}
          onChange={(e) => setProfile(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Areas of Expertise</label>
        <div className="flex flex-wrap gap-2">
          {expertiseOptions.map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => toggleSelect(item, setExpertise)}
              className={cn(
                "px-3 py-1 rounded text-sm border",
                expertise.includes(item)
                  ? "bg-orange-500 border-orange-500"
                  : "bg-gray-700 border-gray-600 hover:bg-gray-600"
              )}>
              {item}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Professional Skills</label>
        <input
          type="text"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="e.g. JavaScript, Project Management"
          className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Industry Experience</label>
        <input
          type="text"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="e.g. 5 years in Tech, 3 years in Finance"
          className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Your Availability</label>
        <div className="flex flex-wrap gap-2">
          {availabilityOptions.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => toggleSelect(slot, setAvailability)}
              className={cn(
                "px-3 py-1 rounded text-sm border",
                availability.includes(slot)
                  ? "bg-orange-500 border-orange-500"
                  : "bg-gray-700 border-gray-600 hover:bg-gray-600"
              )}>
              {slot}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">
          Preferred Communication Method
        </label>
        <div className="flex gap-2">
          {communicationOptions.map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => setCommunication(method)}
              className={cn(
                "flex-1 px-3 py-2 rounded border font-semibold",
                communication === method
                  ? "bg-orange-500 border-orange-500"
                  : "bg-gray-700 border-gray-600 hover:bg-gray-600"
              )}>
              {method}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">What do you hope to learn?</label>
        <textarea
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          placeholder="Describe your learning objectives and what you hope to achieve..."
          className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-orange-500 hover:bg-orange-600 transition rounded text-white font-semibold">
        Continue to Final Step
      </button>
    </form>
  );
};

export default ProfileCreatePanel;
