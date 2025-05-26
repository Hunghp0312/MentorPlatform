export enum Role {
  Learner = "Learner",
  Mentor = "Mentor",
}

export enum CommunicationMethod {
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
  password: string;
}

export interface SharedProfileDetails {
  fullName: string;
  bio: string;
  contact: string;
  profilePictureUrl?: string;
  profilePictureFile?: File | null;
  expertise: string[];
  skills?: string[];
  industryExperience?: string;
  availability: string[];
  preferredCommunication: CommunicationMethod;
}

export interface LearnerDetails {
  learningStyle: LearningStyleOption[];
}

export interface MentorDetails {
  industryExperience: string;
  teachingApproach: TeachingApproachOption[];
}

export interface UserPreferences {
  interestedTopics: string[];
  sessionFrequency: SessionFrequencyOption;
  sessionDuration: SessionDurationOption;
  goal: string;
  privacySettings: {
    isProfilePrivate: boolean;
    allowMessages: boolean;
    receiveNotifications: boolean;
  };
}

interface BaseUserRegistration {
  account: AccountDetails;
  profile: SharedProfileDetails;
  preferences: UserPreferences;
}

export type UserRegistrationRequest =
  | (BaseUserRegistration & {
      role: Role.Learner;
      learnerDetails: LearnerDetails;
    })
  | (BaseUserRegistration & {
      role: Role.Mentor;
      mentorDetails: MentorDetails;
    });

const baseAccount: AccountDetails = {
  email: "",
  password: "",
};

const baseProfile: SharedProfileDetails = {
  fullName: "",
  bio: "",
  contact: "",
  profilePictureFile: null,
  expertise: [],
  skills: [],
  industryExperience: "",
  availability: [],
  preferredCommunication: CommunicationMethod.VideoCall,
};

const basePreferences: UserPreferences = {
  interestedTopics: [],
  sessionFrequency: SessionFrequencyOption.Weekly,
  sessionDuration: SessionDurationOption.OneHour,
  goal: "",
  privacySettings: {
    isProfilePrivate: false,
    allowMessages: true,
    receiveNotifications: true,
  },
};

export const createInitialData = (role: Role): UserRegistrationRequest => {
  const account = { ...baseAccount };
  const profile = { ...baseProfile };
  const preferences = { ...basePreferences };

  if (role === Role.Learner) {
    return {
      role,
      account,
      profile,
      learnerDetails: { learningStyle: [LearningStyleOption.Visual] },
      preferences,
    };
  } else {
    return {
      role,
      account,
      profile,
      mentorDetails: {
        industryExperience: "",
        teachingApproach: [TeachingApproachOption.HandsOn],
      },
      preferences,
    };
  }
};
