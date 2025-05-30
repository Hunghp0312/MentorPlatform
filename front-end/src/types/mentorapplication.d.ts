export interface MentorCertification {
  certificationName: string;
  issuingOrganization: string;
}

export interface MentorWorkExperience {
  companyName: string;
  position: string;
  startDate: string;
  endDate?: string | null;
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
}
export interface SupportingDocument {
  id?: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  fileContent?: string;
  documentContent: {
    fileName: string;
    fileType: string;
    fileContent: string;
  };
}

export interface DocumentContent {
  id: string;
  fileName: string;
  fileType: string;
  fileSize?: number;
  uploadedAt?: string;
  fileContent: string;
}

export interface ApplicationStatus {
  id: number;
  name: string;
}
