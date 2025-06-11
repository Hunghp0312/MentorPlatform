import { CategoryType } from "./category";
import { EnumType } from "./commonType";
import { ResourceType } from "./resource";

export interface CourseType {
  id: string;
  category: CategoryType;
  status: EnumType; // 1: Draft, 2: Publish, 3: Archived
  level: EnumType; // 1: Beginner, 2: Intermediate, 3: Advanced
  name: string;
  duration: string;
  created: string;
  lastUpdated: string;
  description: string;
  tags: string[];
  studentCount: number;
  completion: number;
  isEnroll: boolean;
  isCompleted: boolean;
}
export interface CourseFilterType {
  categoryId: string;
  mentorId: string;
  levelId: string;
}
export interface MentorType {
  id: string;
  fullName: string;
  email: string;
  avatar: string;
  bio: string;
  industryExperience: string;
}
export interface CourseCreateUpdateType {
  name: string;
  categoryId: string;
  statusId: int; // 1: Draft, 2: Publish, 3: Archived
  levelId: int; // 1: Beginner, 2: Intermediate, 3: Advanced
  duration: string;
  description: string;
  tags: string[];
}

export interface CourseDetailType {
  id: string;
  name: string;
  category: CategoryType;
  status: EnumType;
  level: EnumType;
  duration: string;
  created: string;
  lastUpdated: string;
  description: string;
  tags: string[];
  studentCount: number;
  completion: number;
  isEnroll: boolean;
  isCompleted: boolean;
  resources: ResourceType[];
  mentor: MentorType;
}

export interface CourseKPIsType {
  totalCourses: number;
  studentEnrollments: number;
  publishedCourses: number;
  averageCompletion: number;
}

export interface CourseListItemType {
  name: string;
  courseStatus: string;
  courseLevel: string;
  duration: string;
  categoryName: string;
  numberOfStudent: number;
  completePercent: number;
}

export interface CourseDashboardResponseType {
  courseKPIs: CourseKPIsType;
  courses: CourseListItemType[];
}

export interface LearnerCourseResponse {
  id: string;
  title: string;
  category: string;
  status: "Draft" | "Published" | "Archived";
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  tags: string[];
  description: string;
  instructor: string;
  students: number;
  createdAt: string;
}
