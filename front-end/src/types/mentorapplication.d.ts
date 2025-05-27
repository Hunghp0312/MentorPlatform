// import { CourseType } from "./course";
import { UserAreaOfExpertise } from "./user";

export interface MentorCertification {
  certificationName: string;
  issuingOrganization: string;
}

export interface MentorWorkExperience {
  companyName: string;
  position: string;
  startDate: string; // ISO string for DateTime
  endDate?: string; // ISO string for DateTime
}

export interface MentorEducation {
  institutionName: string;
  fieldOfStudy: string;
  graduationYear?: number;
}

export interface MentorCreateApplication {
  mentorEducations: MentorEducation[];
  mentorWorkExperiences: MentorWorkExperience[];
  mentorCertifications: MentorCertification[];
  mentorDocuments: SupportingDocument;
}
export interface SupportingDocument {
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string; // ISO string for DateTime
  documentContent?: DocumentContent;
}

export interface DocumentContent {
  fileContent: string; // Base64 string for binary data
  fileName: string;
  fileType: string;
  supportingDocument?: SupportingDocument;
}
export interface AreaOfExpertise {
  id: string;
  name: string;
  userAreaOfExpertises?: UserAreaOfExpertise[];
}
export interface ApplicationStatus {
  id: number;
  name: string;
}
