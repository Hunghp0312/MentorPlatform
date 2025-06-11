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
  fileContent: string;
  uploadedAt: string;
  documentContent: {
    fileName: string;
    fileType: string;
    fileContent: string;
  };
  tempId?: string;
}

export interface DocumentContent {
  fileId: string;
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

interface ExpertiseArea {
  id: number;
  name: string;
}

interface Document {
  fileId: string;
  fileName: string;
  fileContent: string;
  fileType: string;
}

interface Education {
  institutionName: string;
  fieldOfStudy: string;
  graduationYear: number;
}

interface WorkExperience {
  companyName: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Certification {
  certificationName: string;
  issuingOrganization: string;
}

interface TeachingApproachResponse {
  id: number;
  name: string;
}

interface MentorProfileDetails {
  photoData: string;
  fullName: string;
  email: string;
  applicantUserId: string;
  lastStatusUpdateDate: string;
  bio: string;
  expertiseAreas: ExpertiseArea[];
  professionExperience: string;
  documents: Document[];
  mentorEducations: Education[];
  mentorWorkExperiences: WorkExperience[];
  mentorCertifications: Certification[];
  teachingApproachResponses: TeachingApproachResponse[];
}

interface TimeBlock {
  id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

interface AvailabilityDay {
  date: string;
  dayName: string;
  workStartTime: string | null;
  workEndTime: string | null;
  sessionDurationMinutes: number | null;
  bufferMinutes: number | null;
  timeBlocks: TimeBlock[];
}

interface MentorAvailabilitySchedule {
  weekStartDate: string;
  weekEndDate: string;
  mentorId: string;
  days: AvailabilityDay[];
}
