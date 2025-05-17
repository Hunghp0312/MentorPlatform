import React from "react";
import { CourseType } from "../../types/course";
import Button from "../ui/Button";

interface CourseViewDialogProps {
  onClose: () => void;
  courseData: CourseType;
  categoryName?: string;
  onEdit?: () => void;
}

const CourseViewDialog: React.FC<CourseViewDialogProps> = ({
  onClose,
  courseData,
  categoryName,
  onEdit,
}) => {
  // Map level value to label
  const getLevelLabel = (level: number): string => {
    switch (level) {
      case 0:
        return "Beginner";
      case 1:
        return "Intermediate";
      case 2:
        return "Advanced";
      default:
        return "Unknown";
    }
  };

  // Map status value to label
  const getStatusLabel = (status: number): string => {
    switch (status) {
      case 0:
        return "Draft";
      case 1:
        return "Published";
      case 2:
        return "Archived";
      default:
        return "Unknown";
    }
  };
  const viewBlock = (label: string, title: string) => {
    return (
      <div>
        <label className="block text-sm font-medium mb-1">{label}</label>
        <div className="text-lg rounded-md">{title}</div>
      </div>
    );
  };
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold border-b pb-2">Course Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title Field */}
        {viewBlock("Title", courseData.title)}

        {/* Category Field */}
        {viewBlock("Category", categoryName || courseData.categoryName)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Field */}
        {viewBlock("Status", getStatusLabel(courseData.status))}

        {/* Level Field */}
        {viewBlock("Level", getLevelLabel(courseData.level))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Duration Field */}
        {viewBlock("Duration", courseData.duration)}

        {/* Tags Field */}
        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <div className="rounded-md">
            <div className="flex flex-wrap gap-2">
              {courseData.tags &&
                courseData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-600 text-gray-200 px-2 py-1 rounded-md text-xs flex items-center"
                  >
                    {tag}
                  </span>
                ))}
              {(!courseData.tags || courseData.tags.length === 0) && (
                <span className="text-gray-500">No tags</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description Field */}
      {viewBlock("Description", courseData.description)}

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
