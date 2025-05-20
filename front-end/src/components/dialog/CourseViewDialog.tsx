import React, { useEffect, useState } from "react";
import { CourseDetailType, CourseType } from "../../types/course";
import Button from "../ui/Button";
import { courseService } from "../../services/course.service";
import LoadingOverlay from "../loading/LoadingOverlay";
import { format } from "date-fns";

interface CourseViewDialogProps {
  onClose: () => void;
  courseData: CourseType;
  onEdit?: () => void;
}

const CourseViewDialog: React.FC<CourseViewDialogProps> = ({
  onClose,
  courseData,
  onEdit,
}) => {
  const [courseDetails, setCourseDetails] =
    useState<CourseDetailType>(courseData);
  const [isLoading, setIsLoading] = useState(true);
  // Map level value to label
  const getLevelLabel = (level: number): string => {
    switch (level) {
      case 1:
        return "Beginner";
      case 2:
        return "Intermediate";
      case 3:
        return "Advanced";
      default:
        return "Unknown";
    }
  };
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setIsLoading(true);
        // Simulate an API call to fetch course details
        const res = await courseService.getCourseById(courseData.id);
        setCourseDetails(res);
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourseDetails();
  }, [courseData]);
  // Map status value to label
  const getStatusLabel = (status: number): string => {
    switch (status) {
      case 1:
        return "Draft";
      case 2:
        return "Published";
      case 3:
        return "Archived";
      default:
        return "Unknown";
    }
  };
  const viewBlock = (label: string, title: string | number) => {
    return (
      <div>
        <label className="block text-sm font-medium mb-1">{label}</label>
        <div className="text-lg rounded-md">{title}</div>
      </div>
    );
  };
  if (isLoading) {
    return <LoadingOverlay />;
  }
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title Field */}
        {viewBlock("Title", courseDetails.name)}

        {/* Category Field */}
        {viewBlock("Category", courseDetails.category?.name)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Field */}
        {viewBlock("Status", getStatusLabel(courseDetails.status.id))}

        {/* Level Field */}
        {viewBlock("Level", getLevelLabel(courseDetails.level.id))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Duration Field */}
        {viewBlock("Duration", courseDetails.duration)}

        {/* Tags Field */}
        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <div className="rounded-md">
            <div className="flex flex-wrap gap-2">
              {courseDetails.tags &&
                courseDetails.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-600 text-gray-200 px-2 py-1 rounded-md text-xs flex items-center"
                  >
                    {tag}
                  </span>
                ))}
              {(!courseDetails.tags || courseDetails.tags.length === 0) && (
                <span className="text-gray-500">No tags</span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Field */}
        {viewBlock("Created", format(courseDetails.created, "dd/MM/yyyy"))}

        {/* Level Field */}
        {viewBlock(
          "Last Updated",
          format(courseDetails.lastUpdated, "dd/MM/yyyy")
        )}
      </div>
      {/* Description Field */}
      {viewBlock("Description", courseDetails.description)}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Field */}
        {viewBlock("Enrolled Students", courseDetails.students)}

        {/* Level Field */}
        {viewBlock("Completion Rate", courseDetails.completion)}
      </div>
      {/* Action Button */}
      <div className="flex justify-end pt-4 gap-4">
        <Button variant="secondary" size="md" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" size="md" onClick={onEdit}>
          Edit
        </Button>
      </div>
    </div>
  );
};

export default CourseViewDialog;
