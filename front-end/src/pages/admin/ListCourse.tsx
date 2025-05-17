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

enum Level {
  Beginner = "0",
  Intermediate = "1",
  Advanced = "2",
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
  const [categories, setCategories] = useState<CategoryType[]>();
  const isSubmitting = false;

  // Pagination
  const [totalItems, setTotalItems] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Filter
  const [filter, setFilter] = useState<CourseFilterType>({
    categoryId: "",
    mentorId: "",
    level: "",
  });
  const searchDebounced = useDebounce(query, 500);

  // Constants
  const optionTest = [
    { id: "", name: "All" },
    { id: "73fba208-a6bf-481c-8c82-24fd5ba9a531", name: "Uncle Bob" },
    { id: "4e28540d-6b6b-44da-bc92-7989bcc20201", name: "Mark Zuckerberg" },
    { id: "ca4f1d7d-ced8-473a-bfd0-c7900a098153", name: "Bill Gate" },
  ];

  const levelOptions = [
    { value: "", label: "All" },
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
      setCourses(res.data.items);
      setTotalItems(res.data.totalItems);
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
      const res = await categoryService.getAllCategories();
      setCategories([
        { id: "", name: "All" },
        ...res.data.sort((a: CategoryType, b: CategoryType) =>
          a.name.localeCompare(b.name)
        ),
      ]);
    } catch (error) {
      if (error instanceof AxiosError) {
        handleAxiosError(error);
      } else {
        console.error("Error fetching categories:", error);
      }
    }
  };

  // Effects
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [pageIndex, pageSize, searchDebounced, filter]);

  // Handlers
  const addWithLimit = (newElement: CourseType) => {
    setCourses((prevList) => {
      const updatedList = [...prevList];
      if (updatedList.length >= pageSize) {
        updatedList.pop(); // remove last
      }
      updatedList.unshift(newElement); // add to front
      return updatedList;
    });
  };

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
        `Are you sure you want to delete the course "${course.title}"?`
      )
    ) {
      try {
        await courseService.deleteCourse(course.id);
        toast.success(`Course ${course.title} deleted successfully`);
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
    setQuery(event.target.value);
    setPageIndex(1);
  };

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
        const newCourse = response.data;
        setCourses((prevList) => {
          const updatedList = [...prevList];
          const index = updatedList.findIndex(
            (item) => item.id === newCourse.id
          );
          if (index !== -1) {
            updatedList[index] = newCourse;
          }
          return updatedList;
        });
        toast.success(`Course ${newCourse.title} updated successfully`);
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
      const newCourse = response.data;
      addWithLimit(newCourse);
      toast.success(`Course ${newCourse.title} created successfully`);
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

  // Table Configuration
  const courseActions = [
    {
      icon: <View className="h-4 w-4" />,
      onClick: handleView,
      className: "bg-blue-600 hover:bg-blue-700 text-white",
    },
    {
      icon: <Edit className="h-4 w-4" />,
      onClick: handleEdit,
      className: "bg-amber-600 hover:bg-amber-700 text-white",
    },
    {
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleDelete,
      className: "bg-red-600 hover:bg-red-700 text-white",
    },
  ];

  const courseColumns: DataColumn<CourseType>[] = [
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
          {course.status === 0 ? (
            <span className="text-gray-400 font-medium">Draft</span>
          ) : course.status === 1 ? (
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

  // Render
  return (
    <main className="p-4 container mx-auto">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-3xl font-bold">Course Management</h2>
          <Button
            variant="primary"
            size="md"
            className="font-bold text-white"
            onClick={() => setIsFormOpen(true)}
          >
            Add New Course
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="w-full md:w-2/5">
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
          <div className="w-full md:w-1/5">
            <ComboBox
              label="Mentor"
              name="mentorId"
              value={filter.mentorId}
              onChange={handleSelect}
              options={
                optionTest?.map((item) => ({
                  value: item.id,
                  label: item.name,
                })) || []
              }
              haveOptionAll
            />
          </div>

          {/* Level Filter */}
          <div className="w-full md:w-1/5">
            <Dropdown
              label="Level"
              name="level"
              value={filter.level}
              options={levelOptions}
              onChange={handleSelect}
              haveOptionAll
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
            />
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          data={courses}
          columns={courseColumns}
          keyField="id"
          isLoading={isLoading}
          actions={courseActions}
          pagination
          pageSize={pageSize}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          totalItems={totalItems}
        />
      </div>

      {/* Add/Edit Modal */}
      <CustomModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title="Course Form"
      >
        <CourseDialog
          initialData={initialData}
          onSubmit={handleSubmitAddEditBook}
          onClose={handleCloseForm}
          isSubmitting={isSubmitting}
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
