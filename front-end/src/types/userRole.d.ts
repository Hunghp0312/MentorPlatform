// Define a generic type for ID/Name pairs, now ID can be number or string
export interface IdNameType<TId = string | number, TName = string> {
  id: TId;
  name: TName;
}

// Keep these enums for the string values of names, useful for frontend logic
export enum UserRoleName {
  MENTOR = "Mentor",
  LEARNER = "Learner",
  ADMIN = "Admin",
}

export enum UserStatusName {
  ACTIVE = "Active",
  PENDING = "Pending",
  DEACTIVATED = "Deactivated",
}

export interface UserType {
  id: string; // Main user ID is still a string (GUID)
  fullName: string;
  email: string;
  avatar?: string;
  role: IdNameType<number, UserRoleName>; // role.id is now number
  status: IdNameType<number, UserStatusName>; // status.id is now number
  joinDate: string; // ISO date string
  lastActiveDate: string; // ISO date string
  industryExperience?: string;
  professionalSkills?: string;
  areaOfExpertise?: IdNameType<number, string>[]; // areaOfExpertise[].id is now number
}

export interface UserFilterType {
  roleName?: UserRoleName | ""; // Filter by role name
}

export interface UserSortConfigType {
  key: string; // e.g., 'fullName', 'role.name', 'joinDate'
  direction: "asc" | "desc";
}

// For Edit User Dialog
export interface UserUpdateType {
  fullName?: string;
  email?: string;
  roleId?: number; // API expects the numeric ID of the role for updates
  // statusId?: number; // If status is editable through this form and expects numeric ID
  // areaOfExpertiseIds?: number[]; // If editable
}
