import React, { useState, useEffect } from "react";
import { Search, Clock, Tag, BookOpen, Users } from "lucide-react";
import LoadingOverlay from "../../components/loading/LoadingOverlay";
import TableFooter from "../../components/table/TableFooter";
import { CourseFilterType, CourseType } from "../../types/course";
import { courseService } from "../../services/course.service";
import { getUserFromToken } from "../../utils/auth";
import { AxiosError } from "axios";
import { handleAxiosError } from "../../utils/handlerError";
import { UserComboboxFilter } from "../../types/user";
import { CategoryType } from "../../types/category";
import { categoryService } from "../../services/category.service";
import ComboBox from "../../components/input/ComboBox";
import Dropdown from "../../components/input/Dropdown";
import InputCustom from "../../components/input/InputCustom";
import useDebounce from "../../hooks/usedebounce";
import { userService } from "../../services/user.service";
import { useNavigate } from "react-router-dom";
enum Level {
  Beginner = "1",
  Intermediate = "2",
  Advanced = "3",
}
import { useLocation } from "react-router-dom";
import { pathName } from "../../constants/pathName";
const CoursesPage: React.FC = () => {
  const location = useLocation();
  // State
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryType[]>();
  const [mentors, setMentors] = useState<UserComboboxFilter[]>([]);
  // Pagination
  const [totalItems, setTotalItems] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const decodedToken = getUserFromToken();
  const role = decodedToken?.role;
  // Filter
  const [filter, setFilter] = useState<CourseFilterType>({
    categoryId: "",
    mentorId: role === "Mentor" ? decodedToken?.id || "" : "",
    levelId: "",
  });
  const searchDebounced = useDebounce(query.trim(), 500);
  const navigate = useNavigate();
  const levelOptions = [
    { value: "", label: "All levels" },
    { value: Level.Beginner, label: "Beginner" },
    { value: Level.Intermediate, label: "Intermediate" },
    { value: Level.Advanced, label: "Advanced" },
  ];

  // Data fetching
  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      let res = [];
      if (location.pathname === pathName.learnerCourse) {
        // Fetch courses for the learner's enrolled courses
        res = await courseService.getMyCourses(
          searchDebounced,
          filter,
          pageIndex,
          pageSize
        );
      } else if (location.pathname === pathName.learnerAllCourses) {
        // Add a delay to simulate loading for the skeleton UI
        res = await courseService.getPaginationCourses(
          searchDebounced,
          filter,
          pageIndex,
          pageSize
        );
      }
      setCourses(res.items);
      setTotalItems(res.totalItems);
    } catch (error) {
      if (error instanceof AxiosError) {
        handleAxiosError(error);
      } else {
        console.error("Error fetching courses:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setIsPageLoading(true);
      const res = await categoryService.getAllCategories();
      setCategories([
        { id: "", name: "All categories" },
        ...res.sort((a: CategoryType, b: CategoryType) =>
          a.name.localeCompare(b.name)
        ),
      ]);
    } catch (error) {
      if (error instanceof AxiosError) {
        handleAxiosError(error);
      } else {
        console.error("Error fetching categories:", error);
      }
    } finally {
      setIsPageLoading(false);
    }
  };

  const fetchMentors = async () => {
    try {
      setIsPageLoading(true);
      const res = await userService.getAllMentors();
      setMentors([
        { id: "", fullName: "All mentors" },
        ...res.sort((a: UserComboboxFilter, b: UserComboboxFilter) =>
          a.fullName.localeCompare(b.fullName)
        ),
      ]);
    } catch (error) {
      if (error instanceof AxiosError) {
        handleAxiosError(error);
      } else {
        console.error("Error fetching categories:", error);
      }
    } finally {
      setIsPageLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    fetchCategories();
    fetchMentors();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [pageIndex, pageSize, searchDebounced, filter, location.pathname]);

  const handleSearch = (
    event: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const newValue = event.target.value;
    if (newValue.length > 500) {
      setQuery(newValue.slice(0, 500));
      return;
    }
    setQuery(newValue);
  };
  useEffect(() => {
    if (searchDebounced) {
      setQuery(searchDebounced);
      setPageIndex(1);
    }
  }, [searchDebounced]);

  const handleSelect = (value: string, name: string) => {
    setFilter((prev) => ({ ...prev, [name]: value }));
    setPageIndex(1);
  };

  const getLevelColor = (levelId: number) => {
    switch (levelId) {
      case 1:
        return "bg-blue-600 text-blue-200"; // Beginner
      case 2:
        return "bg-yellow-600 text-yellow-200"; // Intermediate
      case 3:
        return "bg-red-600 text-red-200"; // Advanced
      default:
        return "bg-gray-600 text-gray-200";
    }
  };
  const handleViewCourse = (courseId: string) => {
    navigate(`/learner/course/${courseId}`);
  };
  if (isPageLoading) {
    return <LoadingOverlay />;
  }
  return (
    <div className="min-h-screen bg-slate-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {location.pathname === pathName.learnerAllCourses
                ? "All Courses"
                : "My Courses"}{" "}
            </h1>
            <p className="text-gray-400">
              {location.pathname === pathName.learnerCourse
                ? "View all the courses"
                : "View all my enroll courses"}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div
            className={`w-full ${role === "Admin" ? "md:w-2/5" : "md:w-3/5"}`}
          >
            <InputCustom
              placeholder="Search by title, description"
              icon={<Search className="h-4 w-4" />}
              label="Search"
              name="query"
              type="text"
              value={query}
              onChange={handleSearch}
            />
          </div>

          {/* Mentor Filter */}
          {role !== "Mentor" && (
            <div className="w-full md:w-1/5">
              <ComboBox
                label="Mentor"
                name="mentorId"
                value={filter.mentorId}
                onChange={handleSelect}
                options={
                  mentors?.map((item) => ({
                    value: item.id,
                    label: item.fullName,
                  })) || []
                }
                haveOptionAll
                dataTestId="course-mentor-filter"
              />
            </div>
          )}

          {/* Level Filter */}
          <div className="w-full md:w-1/5">
            <Dropdown
              label="Level"
              name="levelId"
              value={filter.levelId}
              options={levelOptions}
              onChange={handleSelect}
              haveOptionAll
              dataTestId="course-level-filter"
            />
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-1/5">
            <ComboBox
              label="Category"
              name="categoryId"
              value={filter.categoryId}
              onChange={handleSelect}
              options={
                categories?.map((item) => ({
                  value: item.id as string,
                  label: item.name,
                })) || []
              }
              haveOptionAll
              dataTestId="course-category-filter"
            />
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? // Skeleton loading for cards
              Array(6)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="bg-slate-800 border border-slate-700 rounded-lg p-6 flex flex-col h-full animate-pulse"
                  >
                    {/* Course Header Skeleton */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="h-14 w-3/4 bg-slate-700 rounded"></div>
                      <div className="h-6 w-16 bg-slate-700 rounded-full"></div>
                    </div>

                    {/* Course Info Skeleton */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-slate-700"></div>
                        <div className="h-4 w-24 bg-slate-700 rounded"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-slate-700"></div>
                        <div className="h-4 w-16 bg-slate-700 rounded"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-slate-700"></div>
                        <div className="h-4 w-20 bg-slate-700 rounded"></div>
                      </div>
                    </div>

                    {/* Level Badge Skeleton */}
                    <div className="mb-4">
                      <div className="h-6 w-20 bg-slate-700 rounded-full"></div>
                    </div>

                    {/* Description Skeleton */}
                    <div className="mb-4 space-y-2">
                      <div className="h-3 bg-slate-700 rounded w-full"></div>
                      <div className="h-3 bg-slate-700 rounded w-5/6"></div>
                      <div className="h-3 bg-slate-700 rounded w-4/6"></div>
                    </div>

                    {/* Tags Skeleton */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="h-6 w-16 bg-slate-700 rounded"></div>
                      <div className="h-6 w-16 bg-slate-700 rounded"></div>
                      <div className="h-6 w-16 bg-slate-700 rounded"></div>
                    </div>

                    {/* Button Skeleton */}
                    <div className="mt-auto">
                      <div className="h-10 w-full bg-slate-700 rounded-lg"></div>
                    </div>
                  </div>
                ))
            : courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors duration-200 flex flex-col h-full"
                >
                  {/* Course Header */}
                  <div className="flex justify-between items-start mb-0">
                    <h3 className="text-xl font-semibold text-white line-clamp-2 h-14">
                      {course.name}
                    </h3>
                    <div>
                      {course.isCompleted ? (
                        <span
                          className={`px-2 py-1 mb 5 rounded-full text-xs font-medium flex-shrink-0 bg-blue-600 text-gray-200`}
                        >
                          Completed
                        </span>
                      ) : (
                        course.isEnroll && (
                          <span
                            className={`px-2 py-1 mb 5 rounded-full text-xs font-medium flex-shrink-0 bg-blue-600 text-gray-200`}
                          >
                            Enrolled
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <BookOpen className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm truncate">
                        {course.category.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{course.duration}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-400">
                      <Users className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">
                        {course.studentCount} students
                      </span>
                    </div>
                  </div>

                  {/* Level Badge */}
                  <div className="mb-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(
                        course.level.id
                      )}`}
                    >
                      {course.level.name}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3 h-18">
                    {course.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-slate-700 text-gray-300 px-2 py-1 rounded text-xs flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                    {course.tags.length > 3 && (
                      <span className="bg-slate-700 text-gray-300 px-2 py-1 rounded text-xs">
                        +{course.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Action Buttons - using mt-auto to push to bottom */}
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => handleViewCourse(course.id)}
                      className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
        </div>

        {/* No Results */}
        {courses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No courses found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* Pagination */}
        <TableFooter
          className="mt-6"
          pageSize={pageSize}
          pageIndex={pageIndex}
          totalItems={totalItems}
          setPageSize={setPageSize}
          changePage={setPageIndex}
          pageSizeOptions={[6, 9, 12]}
        />
      </div>
    </div>
  );
};

export default CoursesPage;
