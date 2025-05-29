import { admin } from "./admin";
import { User } from "./user";
import { SupportingDocument } from "./mentorapplication";
import {
  MentorEducation,
  MentorWorkExperience,
  MentorCertification,
} from "./mentorapplication";

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
  lastStatusUpdateDate?: string;
  adminComments?: string;
  rejectionReason?: string;
  approvalDate?: string;
  applicant?: User;
  mentorEducations?: MentorEducation[];
  mentorWorkExperiences?: MentorWorkExperience[];
  mentorCertifications?: MentorCertification[];
  supportingDocuments?: SupportingDocument;
}

export interface MentorUpdateStatusRequest {
  mentorId: string;
  statusId: number;
  adminComments: string | null;
}
