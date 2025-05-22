import { ApprovalType } from "../types/approval";
import { EnumType } from "../types/commonType";

// Mock EnumType
export const statusPending: EnumType = { id: 1, name: "Pending" };
export const statusApproved: EnumType = { id: 2, name: "Approved" };
export const statusRejected: EnumType = { id: 3, name: "Rejected" };

// Mock ApprovalType
export const approval1: ApprovalType = {
  id: "app1",
  status: statusPending,
  motivationStatement:
    "I am passionate about mentoring and have 5 years of experience in software development.",
  submissionDate: "2025-01-15T10:00:00Z",
  lastStatusUpdateDate: "2025-01-16T12:00:00Z",
  adminComment: "Under review by admin team",
  rejectReason: undefined,
  createAt: "2025-01-15T09:00:00Z",
  approveDate: undefined,
};

export const approval2: ApprovalType = {
  id: "app2",
  status: statusApproved,
  motivationStatement:
    "Experienced data scientist eager to share knowledge with students.",
  submissionDate: "2025-02-20T08:30:00Z",
  lastStatusUpdateDate: "2025-02-22T15:00:00Z",
  adminComment: "Approved for mentoring program",
  rejectReason: undefined,
  createAt: "2025-02-20T07:00:00Z",
  approveDate: "2025-02-22T14:00:00Z",
};

export const approval3: ApprovalType = {
  id: "app3",
  status: statusRejected,
  motivationStatement: "I want to teach web development.",
  submissionDate: "2025-03-10T09:00:00Z",
  lastStatusUpdateDate: "2025-03-12T11:00:00Z",
  adminComment: "Application reviewed",
  rejectReason: "Insufficient experience details provided.",
  createAt: "2025-03-10T08:00:00Z",
  approveDate: undefined,
};

export const mockApprovals: ApprovalType[] = [approval1, approval2, approval3];
