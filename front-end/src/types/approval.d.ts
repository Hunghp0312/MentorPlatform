import { admin } from "./admin";
import { User } from "./user";
import { ApplicationStatus } from "./mentor";
// src/types/approval.ts
export interface MentorApplication {
  applicantId: string;
  applicationStatus?: ApplicationStatus;
  adminReviewer?: admin;
  // motivationStatement: string;
  submissionDate?: string;
  lastStatusUpdateDate?: string; // ISO string for DateTime
  adminComments?: string;
  rejectionReason?: string;
  approvalDate?: string; // ISO string for DateTime
  //createdAt: string; // ISO string for DateTime
  updatedAt?: string; // ISO string for DateTime
  applicant?: User;
  mentorEducations?: MentorEducation[];
  mentorWorkExperiences?: MentorWorkExperience[];
  // mentorCertifications?: MentorCertification[];
  // supportingDocuments?: SupportingDocument[];
}
