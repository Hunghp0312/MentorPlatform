import { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  Clock,
  TrendingUp,
  Download,
  UserPlus,
  Loader,
  AlertCircle,
} from "lucide-react";
import { adminDashboardService } from "../../services/adminDashboard.service";
import { DashboardStats, PerformanceMetrics } from "../../types/dashboard";
import { useNavigate } from "react-router-dom";
import { pathName } from "../../constants/pathName";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch both data sources in parallel
        const [statsResponse, metricsResponse] = await Promise.all([
          adminDashboardService.getDashboardStats(),
          adminDashboardService.getDashboardPreformance(),
        ]);

        setStats(statsResponse);
        setMetrics(metricsResponse);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-orange-500 mx-auto" />
          <p className="mt-4 text-slate-300">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center p-6">
        <div className="bg-slate-700 rounded-lg p-6 max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Error</h2>
          <p className="text-slate-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-400">
            Platform metrics and statistics overview
          </p>
        </div>

        {/* Main Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Total Users Card */}
          <div className="bg-slate-700 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Users className="w-5 h-5 text-orange-500 mr-2" />
              <h3
                className="text-orange-500 font-medium"
                onClick={() => navigate(pathName.userList)}
                style={{ cursor: "pointer" }}
              >
                Total Users
              </h3>
            </div>
            <div className="mb-3">
              <span className="text-4xl font-bold text-white">
                {stats?.totalUsers || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-slate-400 text-sm">
                <span className="text-blue-400">
                  {stats?.totalMentors || 0} Mentors
                </span>
                <span className="mx-2">•</span>
                <span className="text-green-400">
                  {stats?.totalLearners || 0} Learners
                </span>
              </div>
              <span
                className={`${
                  stats?.userGrowthPercent && stats.userGrowthPercent > 0
                    ? "text-green-400"
                    : "text-red-600"
                } text-sm font-medium`}
              >
                {stats?.userGrowthPercent != undefined &&
                  stats?.userGrowthPercent > 0 &&
                  "+"}
                {stats?.userGrowthPercent || 0}% this month
              </span>
            </div>
          </div>

          {/* Resources Card */}
          <div className="bg-slate-700 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <BookOpen className="w-5 h-5 text-orange-500 mr-2" />
              <h3
                className="text-orange-500 font-medium"
                onClick={() => navigate(pathName.adminResource)}
                style={{ cursor: "pointer" }}
              >
                Resources
              </h3>
            </div>
            <div className="mb-3">
              <span className="text-4xl font-bold text-white">
                {stats?.totalResources || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">
                {stats?.addedResourcesThisWeek} added this week
              </span>
              <span
                className={`${
                  stats?.resourceGrowthPercent &&
                  stats?.resourceGrowthPercent > 0
                    ? "text-green-400"
                    : "text-red-600"
                } text-sm font-medium`}
              >
                {stats?.resourceGrowthPercent != undefined &&
                  stats?.resourceGrowthPercent > 0 &&
                  "+"}
                {stats?.resourceGrowthPercent || 0}% this month
              </span>
            </div>
          </div>

          {/* Sessions Card */}
          <div className="bg-slate-700 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <BookOpen className="w-5 h-5 text-orange-500 mr-2" />
              <h3
                className="text-orange-500 font-medium"
                onClick={() => navigate(pathName.adminCourse)}
                style={{ cursor: "pointer" }}
              >
                Courses
              </h3>
            </div>
            <div className="mb-3">
              <span className="text-4xl font-bold text-white">
                {stats?.totalCourses || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">
                {stats?.addedCoursesThisMonth || 0} added this month
              </span>
              <span
                className={`${
                  stats?.courseGrowthPercent && stats?.courseGrowthPercent > 0
                    ? "text-green-400"
                    : "text-red-600"
                } text-sm font-medium`}
              >
                {stats?.courseGrowthPercent != undefined &&
                  stats?.courseGrowthPercent > 0 &&
                  "+"}
                {stats?.courseGrowthPercent || 0}% this month
              </span>
            </div>
          </div>

          {/* Pending Approvals Card */}
          <div className="bg-slate-700 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Clock className="w-5 h-5 text-orange-500 mr-2" />
              <h3
                className="text-orange-500 font-medium"
                onClick={() => navigate(`${pathName.approval}?status=pending`)}
                style={{ cursor: "pointer" }}
              >
                Pending Approvals
              </h3>
            </div>
            <div className="mb-3">
              <span className="text-4xl font-bold text-white">
                {stats?.pendingApprovals || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Platform Performance Section */}
        <div className="bg-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">
            Platform Performance
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mentor Retention */}
            <div>
              <div className="flex items-center mb-2">
                <TrendingUp className="w-4 h-4 text-slate-400 mr-1" />
                <span className="text-slate-400 text-sm">Mentor Retention</span>
              </div>
              <span className="text-2xl font-bold text-white">
                {metrics?.mentorRetention || 0}%
              </span>
            </div>

            {/* Resource Downloads */}
            <div>
              <div className="flex items-center mb-2">
                <Download className="w-4 h-4 text-slate-400 mr-1" />
                <span className="text-slate-400 text-sm">
                  Resource Downloads
                </span>
              </div>
              <span className="text-2xl font-bold text-white">
                {metrics?.resourceDownloads || 0}
              </span>
            </div>

            {/* New Users */}
            <div>
              <div className="flex items-center mb-2">
                <UserPlus className="w-4 h-4 text-slate-400 mr-1" />
                <span className="text-slate-400 text-sm">New Users (30d)</span>
              </div>
              <span className="text-2xl font-bold text-white">
                +{metrics?.newUsers30d || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
