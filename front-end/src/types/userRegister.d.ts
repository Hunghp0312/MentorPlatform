// src/types/registration.ts
export type Role = "Learner" | "Mentor"; // Keep it strict if these are the only options
export type CommunicationMethod = "Video Call" | "Audio Call" | "Text Chat";
export type LearningStyle =
  | "Visual"
  | "Auditory"
  | "Reading/Writing"
  | "Kinesthetic";
export type TeachingApproach =
  | "Hands-on"
  | "Theory based"
  | "Project-Led Mentoring"
  | "Step-by-Step Tutorials";
export type SessionFrequency =
  | "Weekly"
  | "Every two weeks"
  | "Monthly"
  | "As needed"; // Matched your options
export type SessionDuration = "30 minutes" | "1 hour" | "1.5 hours" | "2 hours"; // Matched your options

export interface AccountDetails {
  email: string;
  // password?: string; // Password is often handled transiently for security
}

export interface ProfileDetails {
  fullName: string;
  role: Role;
  bio: string;
  phoneNumber?: string; // Optional
  skills: string[]; // For InputTag, this should be the final array of strings
  industryExperience: string;
  expertise: string[];
  availability: string[];
  preferredCommunication: CommunicationMethod;
  profilePictureFile?: File | null;
}

export interface UserPreferences {
  topicsOfInterest: string[];
  sessionFrequency: SessionFrequency;
  sessionDuration: SessionDuration;
  preferredLearningStyles?: LearningStyle[]; // Multi-select, learner only
  teachingApproaches?: TeachingApproach[]; // Multi-select, mentor only
  learningGoals?: string; // Added from your PreferenceSetupPanel image
  privacySettings: {
    isProfilePrivate: boolean;
    allowMessages: boolean;
    receiveNotifications: boolean;
  };
}

export interface UserRegistrationEntity {
  account: AccountDetails;
  profile: ProfileDetails;
  preferences: UserPreferences;
}

// Initial Data for the main state
export const initialUserRegistrationEntity: UserRegistrationEntity = {
  account: {
    email: "",
  },
  profile: {
    fullName: "",
    role: "Learner",
    bio: "",
    phoneNumber: "",
    skills: [],
    industryExperience: "",
    expertise: [],
    availability: [],
    preferredCommunication: "Video Call",
    profilePictureFile: null,
  },
  preferences: {
    topicsOfInterest: [],
    sessionFrequency: "Weekly",
    sessionDuration: "1 hour",
    preferredLearningStyles: ["Visual"], // Default if user is Learner
    // teachingApproaches: [], // Default empty if user is Mentor
    learningGoals: "",
    privacySettings: {
      isProfilePrivate: false,
      allowMessages: true,
      receiveNotifications: true,
    },
  },
};
