import { Edit, CheckCircle, Trash2 } from "lucide-react";
import { DataColumn } from "../components/table/CustomTable";
import { CategoryType } from "../types/category";
// Create mock data array
export const mockCategories: CategoryType[] = [
  {
    id: 1,
    name: "Leadership Coaching",
    description:
      "Courses related to developing leadership skills and strategies",
    courses: 23,
    status: 0,
  },
  {
    id: 2,
    name: "Communication Skills",
    description: "Effective communication in professional settings",
    courses: 17,
    status: 1,
  },
  {
    id: 3,
    name: "Public Speaking",
    description:
      "Techniques to improve public speaking and presentation skills",
    courses: 8,
    status: 0,
  },
  {
    id: 4,
    name: "Time Management",
    description: "Strategies for better time management and productivity",
    courses: 12,
    status: 0,
  },
  {
    id: 5,
    name: "Career Development",
    description: "Resources for career advancement and job hunting",
    courses: 15,
    status: 1,
  },
  {
    id: 6,
    name: "Technical Skills",
    description: "Programming and technical skill development courses",
    courses: 31,
    status: 1,
  },
  {
    id: 7,
    name: "Project Management",
    description: "Methodologies and tools for effective project management",
    courses: 19,
    status: 1,
  },
  {
    id: 8,
    name: "Data Analysis",
    description: "Techniques for analyzing and visualizing data",
    courses: 14,
    status: 0,
  },
  {
    id: 9,
    name: "Creative Writing",
    description: "Courses to improve writing skills for various purposes",
    courses: 7,
    status: 1,
  },
  {
    id: 10,
    name: "Financial Literacy",
    description: "Understanding personal and business finance concepts",
    courses: 11,
    status: 0,
  },
];

// Example usage with DataTable component
export const getCategoryColumns: DataColumn<CategoryType>[] = [
  {
    header: "NAME",
    accessor: "name",
    align: "left",
    width: "20%"

  },
  {
    header: "DESCRIPTION",
    accessor: "description",
    align: "left",
    width: "40%"

  },
  {
    header: "COURSES",
    accessor: "courses",
    align: "center",
    width: "10%",
  },
  {
    header: "STATUS",
    accessor: (category: CategoryType) => (
      <div className="flex justify-center">
        {category.status === 1 ? (
          <span className="text-green-500 font-medium">Active</span>
        ) : (
          <span className="text-gray-400 font-medium">Inactive</span>
        )}
      </div>
    ),
    align: "center",
    width: "15%",
  },
];

export const getCategoryActions = (
  handleEdit: (category: CategoryType) => void,
  handleChangeStatus: (category: CategoryType) => void,
  handleDelete: (category : CategoryType) => void
) => [
  {
    icon: <Edit className="h-4 w-4" />,
    onClick: handleEdit,
    className: "bg-blue-600 hover:bg-blue-700 text-white",
  },
  {
    icon: <CheckCircle className="h-4 w-4" />,
    onClick: handleChangeStatus,
    className: "bg-amber-600 hover:bg-amber-700 text-white"
  },
  {
    icon: <Trash2 className="h-4 w-4" />,
    onClick: handleDelete,
    className: "bg-red-600 hover:bg-red-700 text-white"
  },
];
