import { admin } from "./admin";
import { User } from "./user";
import { ApplicationStatus } from "./mentorapplication";
import {
  MentorEducation,
  MentorWorkExperience,
  MentorCertification,
} from "./mentorapplication";
// src/types/approval.ts
export interface ApprovalType {
  id: string;
  name: string;
  email: string;
  expertiseAreas: string[];
  status: string;
  submittedDate: string;
  profileImage: string;
  experience: string;
  documents: { type: string; name: string; url: string }[];
}
export interface MentorApplicationResponse {
  applicantId: string;
  applicationStatus?: ApplicationStatus;
  adminReviewer?: admin;
  submissionDate?: string;
  lastStatusUpdateDate?: string; // ISO string for DateTime
  adminComments?: string;
  rejectionReason?: string;
  approvalDate?: string; // ISO string for DateTime
  applicant?: User;
  mentorEducations?: MentorEducation[];
  mentorWorkExperiences?: MentorWorkExperience[];
  mentorCertifications?: MentorCertification[];
  supportingDocuments?: SupportingDocument;
}

export interface MentorUpdateStatusRequest {
  mentorId: string; // Guid được biểu diễn dưới dạng string trong TypeScript
  statusId: number;
  adminComments?: string;
  adminReviewerId?: string; // Guid được biểu diễn dưới dạng string
}
