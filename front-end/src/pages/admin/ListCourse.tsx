import { Edit, Search, Trash2, View } from "lucide-react";
import Button from "../../components/ui/Button";
import DataTable, { DataColumn } from "../../components/table/CustomTable";
import { useEffect, useState } from "react";
import {
  CourseCreateUpdateType,
  CourseFilterType,
  CourseType,
} from "../../types/course";
import InputCustom from "../../components/input/InputCustom";
import CourseDialog from "../../components/dialog/CourseDialog";
import CustomModal from "../../components/ui/Modal";
import { courseService } from "../../services/course.service";
import useDebounce from "../../hooks/usedebounce";
import { CategoryType } from "../../types/category";
import { categoryService } from "../../services/category.service";
import { handleAxiosError } from "../../utils/handlerError";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import Dropdown from "../../components/input/Dropdown";
import ComboBox from "../../components/input/ComboBox";
enum Level {
  Beginner = "0",
  Intermediate = "1",
  Advanced = "2",
}

const ListCourse = () => {
  // const [courses, setCourses] = useState<CourseType[]>(mockCourses);
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [initialData, setInitialData] = useState<CourseType | undefined>(
    undefined
  );
  const [query, setQuery] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  // Pagination state
  const [totalItems, setTotalItems] = useState(0);
  const searchDebounced = useDebounce(query, 500);
  const [filter, setFilter] = useState<CourseFilterType>({
    categoryId: "",
    mentorId: "",
    level: "",
  });
  const [categories, setCategories] = useState<CategoryType[]>();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const optionTest = [
    { id: "0", name: "All" },
    { id: "1", name: "Hungpro 123" },
    { id: "2", name: "Hung dep zai" },
    { id: "3", name: "Hung no1" },
  ];
  const levelOptions = [
    { value: "", label: "All" },
    { value: Level.Beginner, label: "Beginner" },
    { value: Level.Intermediate, label: "Intermediate" },
    { value: Level.Advanced, label: "Advanced" },
  ];
  // const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmitting = false;
  // Handlers
  const handleView = (course: CourseType) => {
    setInitialData(course);
    setIsFormOpen(true);
  };

  const handleEdit = (course: CourseType) => {
    setInitialData(course);
    setIsFormOpen(true);
  };

  const handleDelete = async (course: CourseType) => {
    try {
      await courseService.deleteCourse(course.id);
      toast.success(`Course ${course.title} deleted successfully`);
    } catch (error) {
      if (error instanceof AxiosError) {
        handleAxiosError(error);
      } else {
        console.error("Error creating course:", error);
      }
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAllCategories();
        setCategories([{ id: "", name: "All" }, ...res.data]);
      } catch (error) {
        if (error instanceof AxiosError) {
          handleAxiosError(error);
        } else {
          console.error("Error creating course:", error);
        }
      }
    };
    fetchCategories();
  }, []);
  useEffect(() => {
    const fetchCourses = async () => {
      const res = await courseService.getPaginationCourses(
        searchDebounced,
        filter,
        pageIndex,
        pageSize
      );
      setCourses(res.data.items);
      setTotalItems(res.data.totalItems);
    };
    fetchCourses();
  }, [pageIndex, pageSize, searchDebounced, filter]);
  function handleSearch(
    event: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ): void {
    setQuery(event.target.value);
    setPageIndex(1);
  }

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setInitialData(undefined);
  };
  const handleFilter = (
    event: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ): void => {
    const { name, value } = event.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
    setPageIndex(1);
  };
  const handleSubmitEdit = async (
    course: CourseCreateUpdateType
  ): Promise<void> => {
    if (initialData) {
      try {
        await courseService.editCourse(initialData.id, course);
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
    }
  };
  const handleSubmitAdd = async (
    course: CourseCreateUpdateType
  ): Promise<void> => {
    try {
      await courseService.createCourse(course);
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

  // actions
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

  // Define the columns for the DataTable
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
  const handleSelect = (value: string, name: string) => {
    setFilter((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <main className="p-4 container mx-auto ">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-3xl font-bold ">Course Management</h2>
          <Button
            variant="primary"
            size="md"
            className="font-bold text-white"
            onClick={() => setIsFormOpen(true)}
          >
            Add New Course
          </Button>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
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

          <div className="w-full md:w-1/5">
            <InputCustom
              label="Mentor"
              name="mentorId"
              type="select"
              optionList={optionTest}
              value={filter.mentorId}
              onChange={handleFilter}
            />
          </div>

          <div className="w-full md:w-1/5">
            <Dropdown
              label="Level"
              name="level"
              value={filter.level}
              options={levelOptions}
              onChange={handleSelect}
            />
          </div>

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
            />
          </div>
        </div>
        <DataTable
          data={courses}
          columns={courseColumns}
          keyField="id"
          actions={courseActions}
          pagination
          pageSize={pageSize}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          totalItems={totalItems}
        />
      </div>
      <CustomModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title="Hungpro"
      >
        <CourseDialog
          initialData={initialData}
          onSubmit={handleSubmitAddEditBook}
          onClose={handleCloseForm}
          isSubmitting={isSubmitting}
        ></CourseDialog>
      </CustomModal>
    </main>
  );
};

export default ListCourse;
