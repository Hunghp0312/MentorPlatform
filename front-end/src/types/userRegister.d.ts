export enum Role {
  Admin = 1,
  Learner = 2,
  Mentor = 3,
}

export enum CommunicationMethod {
  VideoCall = 1,
  AudioCall = 2,
  TextChat = 3,
}

export enum SessionFrequencyOption {
  Weekly = 1,
  Biweekly = 2,
  Monthly = 3,
  AsNeeded = 4,
}

export enum SessionDurationOption {
  HalfHour = 1,
  FortyFiveMinutes = 2,
  OneHour = 3,
  OneAndHalfHour = 4,
  TwoHours = 5,
}

export enum LearningStyleOption {
  Visual = 1,
  Auditory = 2,
  ReadingWriting = 3,
  Kinesthetic = 4,
}

export enum TeachingApproachOption {
  HandsOn = 1,
  TheoryBased = 2,
  ProjectLedMentoring = 3,
  StepByStepTutorials = 4,
}

export enum ArenaOfExpertise {
  Leadership = 1,
  Programming = 2,
  Design = 3,
  Marketing = 4,
  DataScience = 5,
  Business = 6,
  ProjectManagement = 7,
  Communication = 8,
}

export enum Availability {
  Weekdays = 1,
  Weekends = 2,
  Mornings = 3,
  Afternoons = 4,
  Evenings = 5,
}

export interface AccountDetails {
  email: string;
  password: string;
}

export enum TopicOfInterest {
  CareerDevelopment = 1,
  TechnicalSkills = 2,
  Leadership = 3,
  Communication = 4,
  WorkLifeBalance = 5,
  IndustryInsights = 6,
  Networking = 7,
  Entrepreneurship = 8,
}

export interface CreateProfileResponse {
  userId: string;
  email: string;
  fullName: string;
  role: {
    id: number;
    name: string;
  };
  bio: string;
  photoData: string;
  phoneNumber: string;
  expertiseAreas: string[];
  professionalSkills: string;
  industryExperience: string;
  availability: string[];
  communicationMethods: string[];
  userGoals: string;
}

export interface SharedProfileDetails {
  fullName: string;
  bio: string;
  contact: string;
  profilePictureUrl?: string;
  profilePictureFile?: File | null;
  expertise: ArenaOfExpertise[];
  skills?: string;
  industryExperience?: string;
  availability: Availability[];
  preferredCommunication: CommunicationMethod[];
}

export interface LearnerDetails {
  learningStyle: LearningStyleOption[];
}

export interface MentorDetails {
  industryExperience: string;
  teachingApproach: TeachingApproachOption[];
}

export interface UserPreferences {
  interestedTopics: TopicOfInterest[];
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
  skills: "",
  industryExperience: "",
  availability: [],
  preferredCommunication: [CommunicationMethod.VideoCall],
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
