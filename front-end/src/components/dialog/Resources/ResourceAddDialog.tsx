import { useState, useRef, useEffect } from "react";
import Button from "../../../components/ui/Button";
import InputCustom from "../../../components/input/InputCustom";
import {
  ResourceType,
  CreateResourceRequest,
  EditResourceRequest,
} from "../../../types/resource";
import { courseService } from "../../../services/course.service";

interface Course {
  id: string;
  name: string;
}
interface ResourceFormPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    resource: CreateResourceRequest | EditResourceRequest
  ) => Promise<void>;
  initialData?: ResourceType;
  loading: boolean;
  categoryOptions: { value: string; label: string }[];
}

const ResourceFormPopup: React.FC<ResourceFormPopupProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading,
  categoryOptions,
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    resourceCategoryId: initialData?.resourceCategory.id || 0,
    typeOfResourceId: initialData?.typeOfResource.id || 0,
    courseId: initialData?.course.id.toString() || "",
    file: null as File | null,
    link: initialData?.document.data || "",
  });

  const [formErrors, setFormErrors] = useState({
    title: "",
    description: "",
    resourceCategoryId: "",
    typeOfResourceId: "",
    courseId: "",
    file: "",
    link: "",
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseData = await courseService.getMyCourseAssignment();
        setCourses(
          courseData.map((course: Course) => ({
            id: course.id,
            name: course.name,
          }))
        );
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "resourceCategoryId" || name === "typeOfResourceId"
          ? parseInt(value) || 0 // Convert string from select to number
          : value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, file }));
    setFormErrors((prev) => ({ ...prev, file: "" }));
  };

  const validateForm = () => {
    const errors = {
      title: "",
      description: "",
      resourceCategoryId: "",
      typeOfResourceId: "",
      courseId: "",
      file: "",
      link: "",
    };
    let isValid = true;

    if (!formData.title) {
      errors.title = "Title is required";
      isValid = false;
    } else if (formData.title.length > 100) {
      errors.title = "Title must not exceed 100 characters";
      isValid = false;
    }

    if (!formData.description) {
      errors.description = "Description is required";
      isValid = false;
    } else if (formData.description.length > 1000) {
      errors.description = "Description must not exceed 1000 characters";
      isValid = false;
    }

    if (!formData.resourceCategoryId) {
      errors.resourceCategoryId = "Resource category is required";
      isValid = false;
    }

    if (!formData.typeOfResourceId) {
      errors.typeOfResourceId = "Resource type is required";
      isValid = false;
    }

    if (!formData.courseId) {
      errors.courseId = "Course is required";
      isValid = false;
    }

    if (formData.typeOfResourceId === 1 || formData.typeOfResourceId === 2) {
      if (!formData.file && !initialData) {
        errors.file = "File is required for Pdf or Video";
        isValid = false;
      } else if (formData.file) {
        const allowedTypes =
          formData.typeOfResourceId === 1
            ? ["video/mp4", "video/mpeg", "video/webm"]
            : ["application/pdf"];
        if (!allowedTypes.includes(formData.file.type)) {
          errors.file = `Please upload a valid ${
            formData.typeOfResourceId === 1 ? "video" : "PDF"
          } file`;
          isValid = false;
        }
      }
    } else if (formData.typeOfResourceId === 3) {
      if (!formData.link) {
        errors.link = "Link is required";
        isValid = false;
      } else if (!/^(https?:\/\/)/i.test(formData.link)) {
        errors.link =
          "Please enter a valid URL starting with http:// or https://";
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data: CreateResourceRequest = {
      title: formData.title,
      description: formData.description,
      resourceCategoryId: formData.resourceCategoryId,
      typeOfResourceId: formData.typeOfResourceId,
      courseId: formData.courseId,
      file: formData.file || undefined,
      link: formData.typeOfResourceId === 3 ? formData.link : undefined,
    };

    await onSubmit(data);
    setFormData({
      title: "",
      description: "",
      resourceCategoryId: 0,
      typeOfResourceId: 0,
      courseId: "",
      file: null,
      link: "",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const categoryOptionsList = [
    { id: "", name: "Select a category" },
    ...categoryOptions
      .filter((option) => option.value !== "")
      .map((option) => ({
        id: option.value,
        name: option.label,
      })),
  ];

  const courseOptionsList = [
    { id: "", name: "Select a course" },
    ...courses.map((course) => ({
      id: course.id,
      name: course.name,
    })),
  ];

  const typeOptions = [
    { id: "", name: "Select a type" },
    { id: "1", name: "Video" },
    { id: "2", name: "Pdf" },
    { id: "3", name: "Link" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Edit Resource" : "Add Resource"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputCustom
            label="Title"
            name="title"
            type="text"
            value={formData.title}
            placeholder="Enter resource title"
            onChange={handleInputChange}
            errorMessage={formErrors.title}
            isRequired
          />
          <InputCustom
            label="Description"
            name="description"
            type="textarea"
            value={formData.description}
            placeholder="Enter resource description"
            onChange={handleInputChange}
            errorMessage={formErrors.description}
            isRequired
          />
          <InputCustom
            label="Course"
            name="courseId"
            type="select"
            value={formData.courseId}
            onChange={handleInputChange}
            errorMessage={formErrors.courseId}
            isRequired
            optionList={courseOptionsList}
          />
          <InputCustom
            label="Resource Category"
            name="resourceCategoryId"
            type="select"
            value={formData.resourceCategoryId.toString()} // Convert to string for select
            onChange={handleInputChange}
            errorMessage={formErrors.resourceCategoryId}
            isRequired
            optionList={categoryOptionsList}
          />
          <InputCustom
            label="Type of Resource"
            name="typeOfResourceId"
            type="select"
            value={formData.typeOfResourceId.toString()} // Convert to string for select
            onChange={handleInputChange}
            errorMessage={formErrors.typeOfResourceId}
            isRequired
            optionList={typeOptions}
          />
          {formData.typeOfResourceId === 1 ||
          formData.typeOfResourceId === 2 ? (
            <div>
              <label className="block text-base font-medium text-gray-300 mb-2">
                Upload File{" "}
                {initialData ? "" : <span className="text-red-500">*</span>}
              </label>
              <input
                type="file"
                ref={fileInputRef}
                accept={
                  formData.typeOfResourceId === 1 ? ".mp4,.mpeg,.webm" : ".pdf"
                }
                onChange={handleFileChange}
                className="w-full text-gray-300 bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {formErrors.file && (
                <p className="text-sm text-red-500 mt-1">{formErrors.file}</p>
              )}
              {formData.file && (
                <p className="text-sm text-gray-300 mt-1">
                  {formData.file.name}
                </p>
              )}
            </div>
          ) : formData.typeOfResourceId === 3 ? (
            <InputCustom
              label="Link"
              name="link"
              type="text"
              value={formData.link}
              placeholder="Enter resource URL"
              onChange={handleInputChange}
              errorMessage={formErrors.link}
              isRequired
            />
          ) : null}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Saving..." : initialData ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceFormPopup;
