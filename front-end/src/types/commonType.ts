export interface EnumType {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
}

export enum UserAccountStatus {
  Active = 1,
  Pending = 2, // Primarily for Mentors before approval
  Deactivated = 3,
}

export enum RoleEnum {
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
