export interface MentorCertification {
  certificationName: string;
  issuingOrganization: string;
}

export interface MentorWorkExperience {
  companyName: string;
  position: string;
  startDate: string; // ISO string for DateTime
  endDate: string | null; // ISO string for DateTime
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
  //mentorDocuments: SupportingDocument[];
}
export interface SupportingDocument {
  id?: string; // Thêm id để lưu fileId (GUID từ BE)
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
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
