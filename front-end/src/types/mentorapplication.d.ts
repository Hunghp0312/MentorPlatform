// import { CourseType } from "./course";
import { UserArenaOfExpertise } from "./user";

export interface MentorCertification {
  certificationName: string;
  issuingOrganization: string;
  //mentorApplication?: MentorApplication;
}

export interface MentorWorkExperience {
  companyName: string;
  position: string;
  startDate: string; // ISO string for DateTime
  endDate?: string; // ISO string for DateTime
  // mentorApplication?: MentorApplication;
}

export interface MentorEducation {
  institutionName: string;
  fieldOfStudy: string;
  graduationYear?: number;
  //mentorApplication?: MentorApplication;
}

export interface MentorCreateApplication {
  mentorEducations: MentorEducation[];
  mentorWorkExperiences: MentorWorkExperience[];
  mentorCertifications: MentorCertification[];
  menttorDocuments: SupportingDocument;
}
export interface SupportingDocument {
  //mentorApplication?: MentorApplication;
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
export interface ArenaOfExpertise {
  id: string;
  name: string;
  userArenaOfExpertises?: UserArenaOfExpertise[];
}
export interface ApplicationStatus {
  id: number;
  name: string;
}
