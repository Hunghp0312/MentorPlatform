// src/types/approval.ts
export interface ApprovalType {
  id: string | number;
  name: string;
  email: string;
  skills: string; // Displayed in list
  expertiseAreas: string[]; // For detailed view
  professionalExperience: string;
  status: number; // 1 = Pending, 2 = Approved
  submittedDate: string;
  documents: { name: string; type: "PDF" | "JPG"; url: string }[];
  adminNotes?: string;
}

export interface ApprovalCreateType {
  name: string;
  email: string;
  skills: string;
  expertiseAreas: string[];
  professionalExperience: string;
  status: number;
  submittedDate: string;
  documents: { name: string; type: "PDF" | "JPG"; url: string }[];
  adminNotes?: string;
}
