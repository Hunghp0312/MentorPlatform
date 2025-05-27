import { admin } from "./admin";
import { User } from "./user";
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
  status: string;
  email: string;
  fullName: string;
  adminReviewer?: admin;
  submissionDate?: string;
  requestInfoDate?: string;
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
