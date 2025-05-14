import { Edit, CheckCircle, Trash2 } from "lucide-react";
import { DataColumn } from "../components/table/CustomTable";
import { CourseType } from "../types/course";

// Define CourseType to match your data structure
// You may want to create this type in a separate file

export const mockCourses: CourseType[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    categoryId: "c550e840-e29b-41d4-a716-446655440001",
    categoryName: "Leadership Coaching",
    status: 1, // 1: Active, 0: Inactive
    difficulty: 2, // 1: Beginner, 2: Intermediate, 3: Advanced
    title: "Leadership Fundamentals",
    duration: "4 weeks",
    created: "2024-11-15T10:30:00",
    lastUpdated: "2025-01-10T14:45:00",
    description:
      "Learn the core principles of effective leadership in modern organizations",
    tags: ["leadership", "management", "soft-skills"],
    students: 245,
    completion: 87,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    categoryId: "c550e840-e29b-41d4-a716-446655440001",
    categoryName: "Leadership Coaching",
    status: 1,
    difficulty: 3,
    title: "Advanced Leadership Techniques",
    duration: "6 weeks",
    created: "2024-10-05T08:20:00",
    lastUpdated: "2025-02-18T11:30:00",
    description:
      "Master complex leadership challenges and strategic decision-making",
    tags: ["leadership", "strategy", "executive"],
    students: 142,
    completion: 72,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    categoryId: "c550e840-e29b-41d4-a716-446655440002",
    categoryName: "Communication Skills",
    status: 1,
    difficulty: 1,
    title: "Communication Basics",
    duration: "2 weeks",
    created: "2024-09-22T14:15:00",
    lastUpdated: "2025-03-01T09:45:00",
    description: "Develop essential communication skills for workplace success",
    tags: ["communication", "basics", "workplace"],
    students: 378,
    completion: 94,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    categoryId: "c550e840-e29b-41d4-a716-446655440006",
    categoryName: "Technical Skills",
    status: 0,
    difficulty: 3,
    title: "Advanced React Development",
    duration: "8 weeks",
    created: "2024-08-10T11:20:00",
    lastUpdated: "2025-01-05T16:30:00",
    description:
      "Master advanced React concepts including hooks, context API, and performance optimization",
    tags: ["react", "javascript", "frontend", "technical"],
    students: 215,
    completion: 63,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    categoryId: "c550e840-e29b-41d4-a716-446655440007",
    categoryName: "Project Management",
    status: 1,
    difficulty: 2,
    title: "Agile Project Management",
    duration: "5 weeks",
    created: "2024-07-20T09:10:00",
    lastUpdated: "2025-02-28T13:45:00",
    description:
      "Implement effective agile methodologies in your team's workflow",
    tags: ["agile", "scrum", "project-management"],
    students: 305,
    completion: 79,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    categoryId: "c550e840-e29b-41d4-a716-446655440003",
    categoryName: "Public Speaking",
    status: 0,
    difficulty: 1,
    title: "Public Speaking Essentials",
    duration: "3 weeks",
    created: "2024-12-05T15:30:00",
    lastUpdated: "2025-01-20T10:15:00",
    description:
      "Overcome fear and develop confidence in public speaking situations",
    tags: ["public-speaking", "communication", "confidence"],
    students: 182,
    completion: 85,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    categoryId: "c550e840-e29b-41d4-a716-446655440004",
    categoryName: "Time Management",
    status: 1,
    difficulty: 2,
    title: "Effective Time Management",
    duration: "2 weeks",
    created: "2024-11-01T08:45:00",
    lastUpdated: "2025-03-10T14:20:00",
    description:
      "Learn practical strategies to manage time and increase productivity",
    tags: ["time-management", "productivity", "organization"],
    students: 412,
    completion: 91,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440007",
    categoryId: "c550e840-e29b-41d4-a716-446655440008",
    categoryName: "Data Analysis",
    status: 1,
    difficulty: 3,
    title: "Data Analysis with Python",
    duration: "6 weeks",
    created: "2024-10-15T11:30:00",
    lastUpdated: "2025-02-05T09:40:00",
    description:
      "Master data analysis techniques using Python and popular libraries",
    tags: ["python", "data-analysis", "pandas", "technical"],
    students: 257,
    completion: 68,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440008",
    categoryId: "c550e840-e29b-41d4-a716-446655440010",
    categoryName: "Financial Literacy",
    status: 0,
    difficulty: 2,
    title: "Personal Finance Management",
    duration: "4 weeks",
    created: "2024-09-10T10:20:00",
    lastUpdated: "2025-01-15T15:10:00",
    description:
      "Learn to manage personal finances, investments, and plan for the future",
    tags: ["finance", "budgeting", "investments"],
    students: 173,
    completion: 77,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440009",
    categoryId: "c550e840-e29b-41d4-a716-446655440009",
    categoryName: "Creative Writing",
    status: 1,
    difficulty: 1,
    title: "Creative Writing Foundations",
    duration: "3 weeks",
    created: "2024-08-22T13:40:00",
    lastUpdated: "2025-03-05T11:25:00",
    description: "Develop core creative writing skills across multiple genres",
    tags: ["writing", "creativity", "storytelling"],
    students: 194,
    completion: 83,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440010",
    categoryId: "c550e840-e29b-41d4-a716-446655440005",
    categoryName: "Career Development",
    status: 1,
    difficulty: 2,
    title: "Career Transition Strategies",
    duration: "4 weeks",
    created: "2024-07-05T09:30:00",
    lastUpdated: "2025-02-12T16:45:00",
    description:
      "Navigate career changes with confidence and strategic planning",
    tags: ["career", "job-search", "professional-development"],
    students: 286,
    completion: 81,
  },
];

// Table columns configuration
export const getCourseColumns: DataColumn<CourseType>[] = [
  {
    header: "TITLE",
    accessor: "title",
    align: "left",
    width: "20%",
  },
  {
    header: "CATEGORY",
    accessor: "categoryName",
    align: "left",
    width: "20%",
  },
  {
    header: "STUDENTS",
    accessor: "students",
    align: "center",
    width: "10%",
  },
  {
    header: "COMPLETION",
    accessor: (course: CourseType) => (
      <div className="flex items-center justify-center">
        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
          <div
            className={`h-2 rounded-full ${
              course.completion >= 80
                ? "bg-green-500"
                : course.completion >= 60
                ? "bg-amber-500"
                : "bg-red-500"
            }`}
            style={{ width: `${course.completion}%` }}
          ></div>
        </div>
        <span>{course.completion}%</span>
      </div>
    ),
    align: "center",
    width: "20%",
  },
  {
    header: "STATUS",
    accessor: (course: CourseType) => (
      <div className="flex justify-center">
        {course.status === 1 ? (
          <span className="text-green-500 font-medium">Active</span>
        ) : (
          <span className="text-gray-400 font-medium">Inactive</span>
        )}
      </div>
    ),
    align: "center",
    width: "20%",
  },
];

// Action buttons for the table
export const getCourseActions = (
  handleEdit: (course: CourseType) => void,
  handleDelete: (course: CourseType) => void
) => [
  {
    icon: <Edit className="h-4 w-4" />,
    onClick: handleEdit,
    className: "bg-blue-600 hover:bg-blue-700 text-white",
  },
  {
    icon: <CheckCircle className="h-4 w-4" />,
    onClick: (course) => console.log(`Toggle status for ${course.title}`),
    className: "bg-amber-600 hover:bg-amber-700 text-white",
  },
  {
    icon: <Trash2 className="h-4 w-4" />,
    onClick: handleDelete,
    className: "bg-red-600 hover:bg-red-700 text-white",
  },
];
