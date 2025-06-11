export interface DashboardStats {
  totalUsers: number;
  totalMentors: number;
  totalLearners: number;
  totalCourses: number;
  pendingApprovals: number;
  totalResources: number;
  addedUsersThisMonth: number;
  userGrowthPercent: number;
  addedCoursesThisWeek: number;
  addedResourcesThisWeek: number;
  addedResourcesThisMonth: number;
  addedCoursesThisMonth: number;
  resourceGrowthPercent: number;
  courseGrowthPercent: number;
}

export interface PerformanceMetrics {
  mentorRetention: number;
  resourceDownloads: number;
  newUsers30d: number;
}
