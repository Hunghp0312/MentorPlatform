import { MentorApplication } from "./approval";

export interface MentorCertificationType {
  id: string;
  mentorApplication: MentorApplication;
  certificationName: string;
  issuingOrganization: string;
  credentialUrl?: string;
}

export interface MentorEducationType {
  id: string;
  mentorApplication: MentorApplication;
  institutionName: string;
  fieldOfStudy: string;
  graduationYear?: string;
}

export interface MentorWorkExperienceType {
  id: string;
  mentorApplication: MentorApplication;
  companyName: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface SupportingDocumentType {
  id: string;
  mentorApplication: MentorApplication;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileContent: string[];
  uploadedAt: string;
}
