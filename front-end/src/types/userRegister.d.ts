import * as common from "./commonType";

export interface AccountDetails {
  email: string;
  password: string;
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
  expertise: common.ArenaOfExpertise[];
  skills?: string;
  industryExperience?: string;
  availability: common.Availability[];
  preferredCommunication: common.CommunicationMethod[];
}

export interface LearnerDetails {
  learningStyle: common.LearningStyleOption[];
}

export interface MentorDetails {
  industryExperience: string;
  teachingApproach: common.TeachingApproachOption[];
}

export interface UserPreferences {
  interestedTopics: common.TopicOfInterest[];
  sessionFrequency: common.SessionFrequencyOption;
  sessionDuration: common.SessionDurationOption;
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
  preferredCommunication: [common.CommunicationMethod.VideoCall],
};

const basePreferences: UserPreferences = {
  interestedTopics: [],
  sessionFrequency: common.SessionFrequencyOption.Weekly,
  sessionDuration: common.SessionDurationOption.OneHour,
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

  if (role === common.RoleEnum.Learner) {
    return {
      role,
      account,
      profile,
      learnerDetails: { learningStyle: [common.LearningStyleOption.Visual] },
      preferences,
    };
  } else {
    return {
      role,
      account,
      profile,
      mentorDetails: {
        industryExperience: "",
        teachingApproach: [common.TeachingApproachOption.HandsOn],
      },
      preferences,
    };
  }
};
