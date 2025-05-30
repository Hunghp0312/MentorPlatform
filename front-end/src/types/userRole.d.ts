import { EnumType, Role } from "./commonType";

export interface userType {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  role: Role;
  status: EnumType;
  joinDate: string;
  lastActiveDate: string;
  industryExperience?: string;
  professionalSkills?: string;
  areaOfExpertise?: Enum[];
}

export interface userListPage {
  items: UserTyppe[];
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface userPaginationRequest {
  RoleId: number | null;
  Query: string | null;
  PageIndex: number | null;
  PageSize: number | null;
}

export interface userChangeStatusRequest {
  UserId: string;
}
