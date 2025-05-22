import { EnumType } from "./commonType";

// src/types/approval.ts
export interface ApprovalType {
  id: string | number;
  // user: undefined;
  status: EnumType; // 1 = Pending, 2 = Approved 3= Rejected
  motivationStatement: string;
  submissionDate: string;
  lastStatusUpdateDate?: string;
  // admin?: undefined;
  adminComment?: string;
  rejectReason?: string;
  createAt?: string;
  approveDate?: string;
}
