import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  FileText,
  Video,
  Clock,
  Users,
  Tag,
  Calendar,
  File,
  Image,
  Archive,
  Play,
  Download,
} from "lucide-react";
import LoadingOverlay from "../../components/loading/LoadingOverlay";
import { Link, useNavigate, useParams } from "react-router-dom";
import { courseService } from "../../services/course.service";
import { CourseDetailType } from "../../types/course";
import { ResourceType } from "../../types/resource";
import { toast } from "react-toastify";
import { resourceService } from "../../services/resource.service";

const CourseDetailPage: React.FC = () => {
  const navigate = useNavigate();

  const [course, setCourse] = useState<CourseDetailType>();
  const [activeTab, setActiveTab] = useState<"overview" | "resources">(
    "overview"
  );
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams<{ id: string }>();
  const getResourceIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-5 h-5 text-red-400" />;
      case "pdf":
        return <FileText className="w-5 h-5 text-red-400" />;
      case "document":
        return <File className="w-5 h-5 text-blue-400" />;
      case "image":
        return <Image className="w-5 h-5 text-green-400" />;
      case "archive":
        return <Archive className="w-5 h-5 text-purple-400" />;
      default:
        return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "bg-green-600 text-green-100";
      case "Draft":
        return "bg-yellow-600 text-yellow-100";
      case "Archived":
        return "bg-gray-600 text-gray-100";
      default:
        return "bg-gray-600 text-gray-100";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-blue-600 text-blue-100";
      case "Intermediate":
        return "bg-purple-600 text-purple-100";
      case "Advanced":
        return "bg-red-600 text-red-100";
      default:
        return "bg-gray-600 text-gray-100";
    }
  };

  useEffect(() => {
    // Simulate data fetching
    const fetchData = async () => {
      setLoading(true);
      // Simulate network delay
      const res = await courseService.getCourseById(id!);
      setCourse(res); // Replace with actual API call
      setLoading(false);
    };

    fetchData();
  }, []);
  const handleResourceAction = async (resource: ResourceType) => {
    await resourceService.downloadResourceFile(resource.fileId);
    // Handle resource action based on type
  };
  const handleEnrollCourse = async () => {
    // Handle course enrollment logic
    try {
      const res = await courseService.enrollCourse(id!);
      if (res) {
        console.log("Enrolled in course:", course?.name);
        // Optionally, redirect or show success message
      } else {
        console.error("Failed to enroll in course");
      }
      setCourse((prev) => ({
        ...prev!,
        isEnroll: true,
      })); // Update course state to reflect enrollment
      toast.success("Successfully enrolled in the course!");
    } catch (error) {
      console.error("Error enrolling in course:", error);
      toast.error("Failed to enroll in the course. Please try again.");
    }
  };
  const handleFinishCourse = async () => {
    // Handle course completion logic
    try {
      // Simulate API call to finish course
      const res = await courseService.finishCourse(id!);
      setCourse((prev) => ({
        ...prev!,
        isCompleted: true,
      })); // Update course state to reflect completion
      if (res) {
        console.log("Course marked as completed:", course?.name);
        // Optionally, redirect or show success message
      } else {
        console.error("Failed to mark course as completed");
      }
      toast.success("Course marked as completed!");
    } catch (error) {
      console.error("Error finishing course:", error);
      toast.error("Failed to mark course as completed. Please try again.");
    }
  };
  if (loading || !course) {
    return <LoadingOverlay />;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  function handleNavigateBack() {
    navigate(-1);
  }

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={handleNavigateBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Courses
        </button>

        {/* Course Header */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Course Info */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      course.status.name
                    )}`}
                  >
                    {course.status.name}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(
                      course.level.name
                    )}`}
                  >
                    {course.level.name}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {course.category.name}
                  </span>
                </div>
                {!course.isEnroll ? (
                  <button
                    onClick={handleEnrollCourse}
                    className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200"
                  >
                    Enroll Now
                  </button>
                ) : !course.isCompleted ? (
                  <button
                    onClick={handleFinishCourse}
                    className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200"
                  >
                    Finish Course
                  </button>
                ) : (
                  "Completed"
                )}
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                {course.name}
              </h1>

              <p className="text-gray-300 text-lg mb-6">{course.description}</p>

              {/* Course Stats */}
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center gap-2 text-gray-400">
                  <Users className="w-5 h-5" />
                  <span>{course.studentCount} students</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-5 h-5" />
                  <span>{course.duration}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-5 h-5" />
                  <span>
                    Updated {new Date(course.created).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Instructor */}

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-slate-700 text-gray-300 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex border-b border-slate-700">
            {[
              { key: "overview", label: "Overview" },
              { key: "resources", label: "All Resources" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() =>
                  setActiveTab(tab.key as "overview" | "resources")
                }
                className={`px-6 py-3 font-medium transition-colors duration-200 border-b-2 ${
                  activeTab === tab.key
                    ? "text-orange-400 border-orange-400"
                    : "text-gray-400 border-transparent hover:text-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Mentor Information */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-white">
                    Mentor Information
                  </h2>
                  {course.mentor?.id && (
                    <Link
                      to={`/mentor-profile/${course.mentor.id}`}
                      className="text-orange-400 hover:text-orange-300 flex items-center gap-1 text-sm"
                    >
                      View Profile <ArrowLeft className="w-3 h-3 rotate-180" />
                    </Link>
                  )}
                </div>
                <div className="flex items-center gap-4 mb-4">
                  {course.mentor?.avatar ? (
                    <img
                      src={course.mentor.avatar}
                      alt="Mentor Avatar"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {course.mentor?.fullName || "Course Mentor"}
                    </h3>
                    <p className="text-gray-300">
                      {course.mentor?.email || "No email provided"}
                    </p>
                  </div>
                </div>
                <div className="text-gray-300">
                  <p>
                    {course.mentor?.bio || "No mentor biography available."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "resources" && (
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                All Course Resources
              </h2>
              <div className="space-y-4">
                {course.resources.map((resource: ResourceType) => (
                  <div
                    key={resource.resourceId}
                    className="flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      {getResourceIcon(resource.typeOfResource.name)}
                      <div>
                        <h5 className="text-white font-medium">
                          {resource.title}
                        </h5>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <span className="text-orange-400">
                            {resource.resourceCategory.name}
                          </span>
                          <span>•</span>
                        </div>
                        {resource.description && (
                          <p className="text-sm text-gray-400 mt-1">
                            {resource.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleResourceAction(resource)}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                    >
                      {resource.typeOfResource.name === "video" ? (
                        <>
                          <Play className="w-4 h-4" />
                          Play
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Download
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
