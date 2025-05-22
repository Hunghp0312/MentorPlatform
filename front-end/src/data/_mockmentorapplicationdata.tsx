import {
  MentorCertificationType,
  MentorEducationType,
  MentorWorkExperienceType,
  SupportingDocumentType,
} from "../types/mentor";
import { approval1, approval2 } from "./_mockapproval";

// Mock MentorCertificationType
export const certification1: MentorCertificationType = {
  id: "cert1",
  mentorApplication: approval1,
  certificationName: "AWS Certified Solutions Architect",
  issuingOrganization: "Amazon Web Services",
  credentialUrl:
    "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
};

export const certification2: MentorCertificationType = {
  id: "cert2",
  mentorApplication: approval2,
  certificationName: "Certified ScrumMaster",
  issuingOrganization: "Scrum Alliance",
  credentialUrl: undefined,
};

// Mock MentorEducationType
export const education1: MentorEducationType = {
  id: "edu1",
  mentorApplication: approval1,
  institutionName: "University of Technology",
  fieldOfStudy: "Computer Science",
  graduationYear: "2018",
};

export const education2: MentorEducationType = {
  id: "edu2",
  mentorApplication: approval2,
  institutionName: "National University",
  fieldOfStudy: "Data Science",
  graduationYear: undefined, // Đang học hoặc chưa tốt nghiệp
};

// Mock MentorWorkExperienceType
export const workExperience1: MentorWorkExperienceType = {
  id: "exp1",
  mentorApplication: approval1,
  companyName: "Tech Corp",
  position: "Senior Software Engineer",
  startDate: "2020-06-01T00:00:00Z",
  endDate: undefined, // Đang làm việc
  description: "Led a team of developers to build scalable web applications.",
};

export const workExperience2: MentorWorkExperienceType = {
  id: "exp2",
  mentorApplication: approval2,
  companyName: "Data Insights Ltd",
  position: "Data Scientist",
  startDate: "2019-03-01T00:00:00Z",
  endDate: "2024-12-31T00:00:00Z",
  description: "Developed machine learning models for predictive analytics.",
};

// Mock SupportingDocumentType
export const document1: SupportingDocumentType = {
  id: "doc1",
  mentorApplication: approval1,
  fileName: "resume.pdf",
  fileType: "application/pdf",
  fileSize: 1024000, // 1MB
  fileContent: ["data:application/pdf;base64,..."], // Base64 encoded content
  uploadedAt: "2025-01-15T11:00:00Z",
};

export const document2: SupportingDocumentType = {
  id: "doc2",
  mentorApplication: approval2,
  fileName: "certificate.png",
  fileType: "image/png",
  fileSize: 512000, // 500KB
  fileContent: ["data:image/png;base64,..."],
  uploadedAt: "2025-02-20T09:00:00Z",
};

// Export mock data for use
export const mockCertifications: MentorCertificationType[] = [
  certification1,
  certification2,
];
export const mockEducations: MentorEducationType[] = [education1, education2];
export const mockWorkExperiences: MentorWorkExperienceType[] = [
  workExperience1,
  workExperience2,
];
export const mockDocuments: SupportingDocumentType[] = [document1, document2];
