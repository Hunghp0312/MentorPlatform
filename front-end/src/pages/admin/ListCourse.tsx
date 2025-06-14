import { Edit, Search, Trash2, View } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

// Components
import Button from "../../components/ui/Button";
import DataTable, { DataColumn } from "../../components/table/CustomTable";
import InputCustom from "../../components/input/InputCustom";
import CourseDialog from "../../components/dialog/CourseDialog";
import CustomModal from "../../components/ui/Modal";
import Dropdown from "../../components/input/Dropdown";
import ComboBox from "../../components/input/ComboBox";
import CourseViewDialog from "../../components/dialog/CourseViewDialog";

// Services & Hooks
import { courseService } from "../../services/course.service";
import { categoryService } from "../../services/category.service";
import useDebounce from "../../hooks/usedebounce";

// Types & Utilities
import {
  CourseCreateUpdateType,
  CourseFilterType,
  CourseType,
} from "../../types/course";
import { CategoryType } from "../../types/category";
import { handleAxiosError } from "../../utils/handlerError";
import LoadingOverlay from "../../components/loading/LoadingOverlay";
import { userService } from "../../services/user.service";
import { UserComboboxFilter } from "../../types/user";
import { getUserFromToken } from "../../utils/auth";

enum Level {
  Beginner = "1",
  Intermediate = "2",
  Advanced = "3",
}

const ListCourse = () => {
  // State
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [initialData, setInitialData] = useState<CourseType | undefined>(
    undefined
  );
  const [query, setQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryType[]>();
  const isSubmitting = false;
  const [mentors, setMentors] = useState<UserComboboxFilter[]>([]);
  // Pagination
  const [totalItems, setTotalItems] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const decodedToken = getUserFromToken();
  const role = decodedToken?.role;
  // Filter
  const [filter, setFilter] = useState<CourseFilterType>({
    categoryId: "",
    mentorId: role === "Mentor" ? decodedToken?.id || "" : "",
    levelId: "",
  });
  const searchDebounced = useDebounce(query.trim(), 500);

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
      const res = await courseService.getPaginationCourses(
        searchDebounced,
        filter,
        pageIndex,
        pageSize
      );
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
  }, [pageIndex, pageSize, searchDebounced, filter]);

  const handleView = (course: CourseType) => {
    setIsViewOpen(true);
    setInitialData(course);
  };

  const handleEdit = (course: CourseType) => {
    setInitialData(course);
    setIsFormOpen(true);
  };

  const handleDelete = async (course: CourseType) => {
    if (
      window.confirm(
        `Are you sure you want to delete the course "${course.name}"?`
      )
    ) {
      try {
        await courseService.deleteCourse(course.id);
        toast.success(`Course ${course.name} deleted successfully`);
        fetchCourses();
      } catch (error) {
        if (error instanceof AxiosError) {
          handleAxiosError(error);
        } else {
          console.error("Error deleting course:", error);
        }
      }
    }
  };

  const handleCloseView = () => {
    setInitialData(undefined);
    setIsViewOpen(false);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setInitialData(undefined);
  };

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

  const handleSubmitEdit = async (
    course: CourseCreateUpdateType
  ): Promise<void> => {
    if (initialData) {
      try {
        const response = await courseService.editCourse(initialData.id, course);
        const newCourse = response;
        fetchCourses();
        toast.success(`Course ${newCourse.name} updated successfully`);
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          handleAxiosError(error);
        } else {
          console.error("Error updating course:", error);
        }
      } finally {
        setIsFormOpen(false);
        setInitialData(undefined);
      }
    }
  };

  const handleSubmitAdd = async (
    course: CourseCreateUpdateType
  ): Promise<void> => {
    try {
      const response = await courseService.createCourse(course);
      const newCourse = response;
      fetchCourses();
      toast.success(`Course ${newCourse.name} created successfully`);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        handleAxiosError(error);
      } else {
        console.error("Error creating course:", error);
      }
    } finally {
      setIsFormOpen(false);
      setInitialData(undefined);
    }
  };

  const handleSubmitAddEditBook = async (
    course: CourseCreateUpdateType
  ): Promise<void> => {
    if (initialData) {
      handleSubmitEdit(course);
    } else {
      handleSubmitAdd(course);
    }
  };
  const handleEnrollCourse = (course: CourseType) => {
    setInitialData(course);
    setIsFormOpen(true);
  };
  // Table Configuration
  const courseActions = [
    {
      icon: <View className="h-4 w-4" />,
      onClick: handleView,
      className: "bg-blue-600 hover:bg-blue-700 text-white",
      buttonName: "view",
    },
    {
      icon: <Edit className="h-4 w-4" />,
      onClick: handleEdit,
      className: "bg-amber-600 hover:bg-amber-700 text-white",
      buttonName: "edit",
    },
    {
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleDelete,
      className: "bg-red-600 hover:bg-red-700 text-white",
      buttonName: "delete",
    },
  ];
  const learnerCourseActions = [
    {
      icon: <View className="h-4 w-4" />,
      onClick: handleEnrollCourse,
      className: "bg-blue-600 hover:bg-blue-700 text-white",
      buttonName: "view",
    },
  ];

  const courseColumns: DataColumn<CourseType>[] = [
    {
      header: "TITLE",
      accessor: (course: CourseType) => (
        <div>
          <div className="font-medium">{course.name}</div>
          <div className="text-xs text-gray-400">
            {course.duration} •{" "}
            {course.level.id === 1
              ? "Beginner"
              : course.level.id === 2
              ? "Intermediate"
              : "Advanced"}
          </div>
        </div>
      ),
      align: "left",
      width: "20%",
    },
    {
      header: "CATEGORY",
      accessor: (course: CourseType) => (
        <div className="font-medium">{course.category?.name}</div>
      ),
      align: "left",
      width: "20%",
    },
    {
      header: "STUDENTS",
      accessor: (course: CourseType) => (
        <div className="font-medium">{course.studentCount ?? 0}</div>
      ),
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
                Math.round(course.completion) >= 80
                  ? "bg-green-500"
                  : Math.round(course.completion) >= 60
                  ? "bg-amber-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${Math.round(course.completion)}%` }}
            ></div>
          </div>
          <span>{Math.round(course.completion) ?? 0}%</span>
        </div>
      ),
      align: "center",
      width: "20%",
    },
    {
      header: "STATUS",
      accessor: (course: CourseType) => (
        <div className="flex justify-center">
          {course.status.id === 1 ? (
            <span className="text-gray-400 font-medium">Draft</span>
          ) : course.status.id === 2 ? (
            <span className="text-green-500 font-medium">Published</span>
          ) : (
            <span className="text-amber-500 font-medium">Archived</span>
          )}
        </div>
      ),
      align: "center",
      width: "20%",
    },
  ];
  if (isPageLoading) {
    return <LoadingOverlay />;
  }
  // Render
  return (
    <main className="p-4 container mx-auto">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-3xl font-bold">Course Management</h2>
          {decodedToken?.role === "Mentor" && (
            <Button
              variant="primary"
              size="md"
              className="font-bold text-white"
              onClick={() => setIsFormOpen(true)}
              dataTestId="add-course-button"
            >
              Add New Course
            </Button>
          )}
        </div>

        {/* Filters */}
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

        {/* Data Table */}
        <DataTable
          data={courses}
          columns={courseColumns}
          keyField="id"
          isLoading={isLoading}
          actions={role !== "Learner" ? courseActions : learnerCourseActions}
          pagination
          pageSize={pageSize}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          totalItems={totalItems}
          emptyMessage="No results found"
        />
      </div>

      {/* Add/Edit Modal */}
      <CustomModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={initialData ? "Edit Course" : "Add Course"}
      >
        <CourseDialog
          initialData={initialData}
          onSubmit={handleSubmitAddEditBook}
          onClose={handleCloseForm}
          isSubmitting={isSubmitting}
          actionButtonText={initialData ? "Update Course" : "Add Course"}
        />
      </CustomModal>

      {/* View Modal */}
      <CustomModal
        isOpen={isViewOpen}
        onClose={handleCloseView}
        title="Course Details"
      >
        {initialData && (
          <CourseViewDialog
            onClose={handleCloseView}
            courseData={initialData}
            onEdit={() => {
              handleEdit(initialData);
              setIsViewOpen(false);
            }}
          />
        )}
      </CustomModal>
    </main>
  );
};

export default ListCourse;
