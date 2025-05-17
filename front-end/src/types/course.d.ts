export interface CourseType {
  id: string;
  categoryId: string;
  categoryName: string; // Added category name field
  status: number; // 1: Active, 0: Inactive
  level: number; // 1: Beginner, 2: Intermediate, 3: Advanced
  title: string;
  duration: string;
  created: string;
  lastUpdated: string;
  description: string;
  tags: string[];
  students: number; // Number of enrolled students
  completion: number; // Completion rate percentage
}
export interface CourseFilterType {
  categoryId: string;
  mentorId: string;
  level: string;
}
export interface CourseCreateUpdateType {
  title: string;
  categoryId: string;
  status: number; // 0: Draft, 1: Publish, 2: Archived
  level: number | string; // 1: Beginner, 2: Intermediate, 3: Advanced
  duration: string;
  description: string;
  tags: string[];
}
