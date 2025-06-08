import { CategoryType } from "./category";
import { EnumType } from "./commonType";

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
  students: number;
  completion: number;
}
export interface CourseFilterType {
  categoryId: string;
  mentorId: string;
  levelId: string;
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
  students: number;
  completion: number;
}


export interface CourseKPIsType {
  totalCourses: number;
  activeStudents: number;
  publishedCourses: number;
}

export interface CourseListItemType {
  name: string;
  courseStatus: string;
  courseLevel: string;
  created: string;
  categoryName: string;
  numberOfStudent: number;
  completePercent: number;
}

export interface CourseDashboardResponseType {
  courseKPIs: CourseKPIsType;
  courses: CourseListItemType[];
}