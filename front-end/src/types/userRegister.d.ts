// src/types/registration.ts (or your chosen path)

export enum Role {
  Learner = "Learner",
  Mentor = "Mentor",
}

export enum LearnerCommunicationMethod {
  VideoCall = "Video Call",
  AudioCall = "Audio Call",
  TextChat = "Text Chat",
}

export enum SessionFrequencyOption {
  Weekly = "Weekly",
  Biweekly = "Every two weeks",
  Monthly = "Monthly",
  AsNeeded = "As needed",
}

export enum SessionDurationOption {
  HalfHour = "30 minutes",
  OneHour = "1 hour",
  OneAndHalfHour = "1.5 hours",
  TwoHours = "2 hours",
}

export enum LearningStyleOption {
  Visual = "Visual",
  Auditory = "Auditory",
  ReadingWriting = "Reading/Writing",
  Kinesthetic = "Kinesthetic",
}

export enum TeachingApproachOption {
  HandsOn = "Hands-On",
  TheoryBased = "Theory Based",
  ProjectLedMentoring = "Project-Led Mentoring",
  StepByStepTutorials = "StepByStepTutorials",
}

export interface AccountDetails {
  email: string;
  password: string; // This DTO will hold the password temporarily before submission
}

export interface SharedProfileDetails {
  fullName: string;
  bio: string;
  profilePictureUrl?: string; // URL after upload
  profilePictureFile?: File | null; // For client-side state before upload
  goal: string;
  expertise: string[];
  skills: string[];
  industryExperience: string;
  availability: string[];
  preferredCommunication: LearnerCommunicationMethod;
}

export interface LearnerDetails {
  learningStyle: LearningStyleOption[];
}

export interface MentorDetails {
  teachingApproach: [];
}

export interface UserPreferences {
  interestedTopics: string[];
  sessionFrequency: SessionFrequencyOption;
  sessionDuration: SessionDurationOption;
  privacySettings: {
    isProfilePrivate: boolean;
    allowMessages: boolean;
    receiveNotifications: boolean;
  };
}

export type UserRegistrationRequest =
  | {
      role: Role.Learner;
      account: AccountDetails;
      profile: SharedProfileDetails;
      learnerDetails: LearnerDetails;
      preferences: UserPreferences;
    }
  | {
      role: Role.Mentor;
      account: AccountDetails;
      profile: SharedProfileDetails;
      mentorDetails: MentorDetails;
      preferences: UserPreferences;
    };

// Helper to create initial data based on role
export const createInitialData = (role: Role): UserRegistrationRequest => {
  const account: AccountDetails = { email: "", password: "" };
  const profile: SharedProfileDetails = {
    fullName: "",
    bio: "",
    profilePictureFile: null,
  };
  const basePreferences: Omit<
    UserPreferences,
    "learningStyle" /* | "teachingApproach" */
  > = {
    interestedTopics: [],
    sessionFrequency: SessionFrequencyOption.Weekly,
    sessionDuration: SessionDurationOption.OneHour,
    privacySettings: {
      isProfilePrivate: false,
      allowMessages: true,
      receiveNotifications: true,
    },
  };

  if (role === Role.Learner) {
    return {
      role: Role.Learner,
      account,
      profile,
      learnerDetails: {
        learningGoals: "",
        preferredCommunication: LearnerCommunicationMethod.VideoCall,
      },
      preferences: {
        ...basePreferences,
        learningStyle: LearningStyleOption.Visual,
      },
    };
  } else {
    // Mentor
    return {
      role: Role.Mentor,
      account,
      profile,
      mentorDetails: {
        expertise: [],
        skills: [],
        industryExperience: "",
        availability: [],
      },
      preferences: {
        ...basePreferences /* teachingApproach: TeachingApproachOption.HandsOn */,
      }, // Add teachingApproach if defined
    };
  }
};
