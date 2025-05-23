// src/types/approval.ts
export interface ApprovalType {
  id: string | number;
  name: string;
  email: string;
  expertiseAreas: string[]; // For detailed view
  status: "pending" | "approved" | "rejected"; // 1 = Pending, 2 = Approved
  submittedDate: string;
  profileImage: string;
  experience: string;
  documents: { name: string; type: "PDF" | "JPG"; url: string }[];
  adminNotes?: string;
}

// export interface ApprovalCreateType {
//   name: string;
//   email: string;
//   profileImage: string;
//   //skills: string;
//   expertiseAreas: string[];
//   professionalExperience: string;
//   status: "pending" | "approved" | "rejected";
//   submittedDate: string;
//   documents: { name: string; type: "PDF" | "JPG"; url: string }[];
//   adminNotes?: string;
// }
