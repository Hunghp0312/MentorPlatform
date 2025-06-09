import React, { useState, useEffect } from "react";
import { Clock, BarChart3, Users, BookOpen, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  learnerDashboardService,
  UpcomingSessionResponse,
  LearningProcessResponse,
  OnlineMentorsResponse,
  Course,
} from "../../services/learnerDashboard.service";
import { pathName } from "../../constants/pathName";

const LearnerDashboard: React.FC = () => {
  const [sessionsData, setSessionsData] =
    useState<UpcomingSessionResponse | null>(null);
  const [progressData, setProgressData] =
    useState<LearningProcessResponse | null>(null);
  const [mentorsData, setMentorsData] = useState<OnlineMentorsResponse | null>(
    null
  );
  const [coursesData, setCoursesData] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [sessions, progress, mentors, courses] = await Promise.all([
          learnerDashboardService.getUpcomingSession(),
          learnerDashboardService.getLearningProcess(),
          learnerDashboardService.getOnlineMentors(),
          learnerDashboardService.listCourses(),
        ]);
        setSessionsData(sessions);
        setProgressData(progress);
        setMentorsData(mentors);
        setCoursesData(courses.courseList);
      } catch (error) {
        console.error("Failed to fetch learner dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1e2432] flex items-center justify-center">
        <p className="text-white text-xl animate-pulse">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1e2432] text-white p-4 sm:p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100">
            Learner Dashboard
          </h1>
          <p className="text-slate-400 mt-1">
            Track your learning journey and connect with mentors
          </p>
        </header>

        {/* Top Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Upcoming Sessions Card */}
          <div className="bg-[#252d3d] rounded-lg p-6 flex flex-col">
            <div className="flex items-center text-orange-500 mb-4">
              <Clock className="w-6 h-6 mr-3" />
              <h2 className="font-semibold">Upcoming Sessions</h2>
            </div>
            <div className="flex-grow">
              <p className="text-5xl font-bold text-white">
                {sessionsData?.numberOfUpcomingSession ?? 0}
              </p>
              <p className="text-slate-400 mt-2 text-sm">
                {sessionsData && sessionsData.numberOfUpcomingSession > 0
                  ? `Next session: ${sessionsData.nextSessionDay}, ${sessionsData.nextSessionTime}`
                  : "No upcoming sessions"}
              </p>
            </div>
            <Link
              to={pathName.leanerSessionManagement}
              className="text-orange-500 text-sm mt-4 font-semibold hover:underline">
              View schedule ›
            </Link>
          </div>

          {/* Learning Progress Card */}
          <div className="bg-[#252d3d] rounded-lg p-6 flex flex-col">
            <div className="flex items-center text-orange-500 mb-4">
              <BarChart3 className="w-6 h-6 mr-3" />
              <h2 className="font-semibold">Learning Progress</h2>
            </div>
            <div className="flex-grow">
              <p className="text-5xl font-bold text-white">
                {progressData?.learningProgress ?? 0}%
              </p>
              <div className="w-full bg-slate-600 rounded-full h-2 mt-3">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${progressData?.learningProgress ?? 0}%`,
                  }}></div>
              </div>
            </div>
            <Link
              to={pathName.learnerCourse}
              className="text-orange-500 text-sm mt-4 font-semibold hover:underline">
              View details ›
            </Link>
          </div>

          {/* My Mentors Card */}
          <div className="bg-[#252d3d] rounded-lg p-6 flex flex-col">
            <div className="flex items-center text-orange-500 mb-4">
              <Users className="w-6 h-6 mr-3" />
              <h2 className="font-semibold">My Mentors</h2>
            </div>
            <div className="flex-grow">
              <p className="text-5xl font-bold text-white">
                {mentorsData?.numberOfMentors ?? 0}
              </p>
              <p className="text-slate-400 mt-2 text-sm">
                Active mentorship relationships
              </p>
            </div>
            <Link
              to={pathName.findmentor}
              className="text-orange-500 text-sm mt-4 font-semibold hover:underline">
              Find more mentors ›
            </Link>
          </div>
        </section>

        {/* Enrolled Courses Section */}
        <section>
          <h2 className="text-xl font-bold text-slate-100 mb-4">
            Recently Enrolled Courses
          </h2>
          <div className="bg-[#252d3d] rounded-lg">
            {coursesData.length > 0 ? (
              coursesData.map((course, index) => (
                <div
                  key={null}
                  className={`flex items-center p-4 ${
                    index < coursesData.length - 1
                      ? "border-b border-slate-700"
                      : ""
                  }`}>
                  <div className="flex-shrink-0 p-3 rounded-lg mr-4 bg-indigo-500/10">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold text-slate-100">
                      {course.courseName}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      {course.courseCategory}
                    </p>
                  </div>
                  <div className="flex items-center ml-4">
                    {course.isCompleted ? (
                      <span className="flex items-center text-green-400 text-sm">
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Completed
                      </span>
                    ) : (
                      <span className="flex items-center text-yellow-400 text-sm">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24">
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path
                            d="M12 8v4l2 2"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        In Progress
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-400">
                <p>You are not enrolled in any courses yet.</p>
              </div>
            )}
          </div>
          <div className="mt-4 text-right">
            <Link
              to={pathName.learnerCourse}
              className="text-orange-500 text-sm font-semibold hover:underline">
              View full courses &rsaquo;
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LearnerDashboard;
