import { ApprovalType } from "./approval";

export interface MentorCertificationType {
  id: string;
  mentorApplication: ApprovalType;
  certificationName: string;
  issuingOrganization: string;
  credentialUrl?: string;
}

export interface MentorEducationType {
  id: string;
  mentorApplication: ApprovalType;
  institutionName: string;
  fieldOfStudy: string;
  graduationYear?: string;
}

export interface MentorWorkExperienceType {
  id: string;
  mentorApplication: ApprovalType;
  companyName: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface SupportingDocumentType {
  id: string;
  mentorApplication: ApprovalType;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileContent: string[];
  uploadedAt: string;
}
