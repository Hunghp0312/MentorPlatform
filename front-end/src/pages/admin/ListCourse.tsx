import { Search } from "lucide-react";
import Button from "../../components/ui/Button";
import DataTable from "../../components/table/CustomTable";
import { useEffect, useState } from "react";
import { getCourseActions, getCourseColumns } from "../../data/_mockcourse";
import { CourseFilterType, CourseType } from "../../types/course";
import InputCustom from "../../components/input/InputCustom";
import CourseDialog from "../../components/dialog/CourseDialog";
import CustomModal from "../../components/ui/Modal";
import { courseService } from "../../services/course.service";
import useDebounce from "../../hooks/usedebounce";
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
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const optionTest = [
    { id: "1", name: "Leadership Coaching" },
    { id: "2", name: "Technical Skills" },
    { id: "3", name: "Communication Skills" },
    { id: "4", name: "Time Management" },
    { id: "5", name: "Emotional Intelligence" },
    { id: "6", name: "Conflict Resolution" },
    { id: "7", name: "Project Management" },
    { id: "8", name: "Critical Thinking" },
    { id: "9", name: "Team Building" },
    { id: "10", name: "Adaptability" },
    { id: "11", name: "Strategic Planning" },
    { id: "12", name: "Customer Service" },
  ];
  const levelOptions = [
    { id: "0", name: "Beginner" },
    { id: "1", name: "Intermediate" },
    { id: "2", name: "Advanced" },
  ];
  // const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmitting = false;
  // Handlers
  const handleEdit = (course: CourseType) => {
    setInitialData(course);
    setIsFormOpen(true);
  };

  const handleDelete = (course: CourseType) => {
    console.log(course);
  };
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
          <InputCustom
            placeholder="Search by title, description"
            icon={<Search className="h-4 w-4" />}
            label="Search"
            name="query"
            type="text"
            value={query}
            onChange={handleSearch}
          />
          <InputCustom
            label="Mentor"
            name="mentorId"
            type="select"
            optionList={optionTest}
            value={query}
            onChange={handleFilter}
          />
          <InputCustom
            label="Level"
            name="level"
            type="select"
            value={filter.level}
            optionList={levelOptions}
            onChange={handleFilter}
          />
          <InputCustom
            label="Category"
            name="categoryId"
            type="select"
            value={query}
            optionList={optionTest}
            onChange={handleFilter}
          />
        </div>
        <DataTable
          data={courses}
          columns={getCourseColumns}
          keyField="id"
          actions={getCourseActions(handleEdit, handleDelete)}
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
          // onSubmit={handleSubmitAddEditBook}
          onClose={handleCloseForm}
          isSubmitting={isSubmitting}
        ></CourseDialog>
      </CustomModal>
    </main>
  );
};

export default ListCourse;
