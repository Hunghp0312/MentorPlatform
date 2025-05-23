import { MentorApplication } from "./approval";
// import { CourseType } from "./course";
import { UserArenaOfExpertise } from "./user";

export interface MentorCertification {
  //id: string;
  certificationName: string;
  issuingOrganization: string;
  mentorApplication?: MentorApplication;
}
// export interface SupportingDocument {
//   id: string;
//   mentorApplication?: MentorApplication;
//   fileName: string;
//   fileType: string;
//   fileSize: number;
//   uploadedAt: string; // ISO string for DateTime
//   documentContent?: DocumentContent;
// }
// export interface Resource {
//   id: string;
//   title?: string;
//   type?: number;
//   resourceCategoryId?: string;
//   description?: string;
//   course?: CourseType;
//   documentContent?: DocumentContent;
// }
export interface MentorWorkExperience {
  //id: string;
  companyName: string;
  position: string;
  startDate: string; // ISO string for DateTime
  endDate?: string; // ISO string for DateTime
  mentorApplication?: MentorApplication;
}
export interface MentorEducation {
  //id: string;
  institutionName: string;
  fieldOfStudy: string;
  graduationYear?: number;
  mentorApplication?: MentorApplication;
}
// export interface DocumentContent {
//   id: string;
//   fileContent: string; // Base64 string for binary data
//   fileName: string;
//   fileType: string;
//   supportingDocument?: SupportingDocument;
//   resource?: Resource;
// }
export interface ArenaOfExpertise {
  id: string;
  name: string;
  userArenaOfExpertises?: UserArenaOfExpertise[];
}
export interface ApplicationStatus {
  id: number;
  name: string;
}
