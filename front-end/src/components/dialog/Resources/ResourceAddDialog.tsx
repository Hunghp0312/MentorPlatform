import { useState, useRef, useEffect } from "react";
import Button from "../../../components/ui/Button";
import InputCustom from "../../../components/input/InputCustom";
import {
  ResourceType,
  CreateResourceRequest,
  EditResourceRequest,
} from "../../../types/resource";
import { courseService } from "../../../services/course.service";
import CustomModal from "../../ui/Modal";

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
  userRole: string | null;
}

const ResourceAddDialog: React.FC<ResourceFormPopupProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading,
  categoryOptions,
  userRole,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    resourceCategoryId: 0,
    typeOfResourceId: 0,
    courseId: "",
    file: null as File | null,
    url: "",
  });

  const [formErrors, setFormErrors] = useState({
    title: "",
    description: "",
    resourceCategoryId: "",
    typeOfResourceId: "",
    courseId: "",
    file: "",
    url: "",
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditable = userRole === "Mentor";

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        resourceCategoryId: initialData.resourceCategory.id || 0,
        typeOfResourceId: initialData.typeOfResource.id || 0,
        courseId: initialData.courseId || "", // Ensure courseId is set
        file: null,
        url: initialData.link || "",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      setFormData({
        title: "",
        description: "",
        resourceCategoryId: 0,
        typeOfResourceId: 0,
        courseId: "",
        file: null,
        url: "",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [initialData]);

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
          ? parseInt(value) || 0
          : value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditable) return;
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
      url: "",
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
      if (!formData.file && !initialData?.fileId) {
        errors.file = "File is required for Pdf or Video";
        isValid = false;
      } else if (formData.file) {
        const allowedTypes =
          formData.typeOfResourceId === 1 ? ["video/mp4"] : ["application/pdf"];
        if (!allowedTypes.includes(formData.file.type)) {
          errors.file = `Please upload a valid ${
            formData.typeOfResourceId === 1 ? "video" : "PDF"
          } file`;
          isValid = false;
        }
        if (formData.file.size > 5 * 1024 * 1024) {
          errors.file = `File size must not exceed 5MB`;
          isValid = false;
        }
        if (
          formData.typeOfResourceId === 2 &&
          formData.file.name.toLowerCase().endsWith(".mp4")
        ) {
          errors.file = "Please upload a PDF file!";
          isValid = false;
        }
        if (
          formData.typeOfResourceId === 1 &&
          formData.file.name.toLowerCase().endsWith(".pdf")
        ) {
          errors.file = "Please upload a mp4 file!";
          isValid = false;
        }
      } else if (initialData && initialData.fileId) {
        const originalType = initialData.typeOfResource.id;
        const newType = formData.typeOfResourceId;
        if (
          originalType !== newType &&
          (originalType === 1 || originalType === 2) &&
          (newType === 1 || newType === 2)
        ) {
          errors.file =
            newType === 1
              ? "Please upload a Mp4 file!"
              : "Please upload a PDF file!";
          isValid = false;
        }
      }
    } else if (formData.typeOfResourceId === 3) {
      if (!formData.url) {
        errors.url = "Link is required";
        isValid = false;
      } else if (!/^(https?:\/\/)/i.test(formData.url)) {
        errors.url =
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

    const data: CreateResourceRequest | EditResourceRequest = {
      title: formData.title,
      description: formData.description,
      resourceCategoryId: formData.resourceCategoryId,
      typeOfResourceId: formData.typeOfResourceId,
      courseId: formData.courseId,
      file: formData.file || undefined,
      url: formData.typeOfResourceId === 3 ? formData.url : undefined,
    };

    await onSubmit(data);
    setFormData({
      title: "",
      description: "",
      resourceCategoryId: 0,
      typeOfResourceId: 0,
      courseId: "",
      file: null,
      url: "",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOnClose = () => {
    onClose();
    setFormData({
      title: "",
      description: "",
      resourceCategoryId: 0,
      typeOfResourceId: 0,
      courseId: "",
      file: null,
      url: "",
    });
    setFormErrors({
      title: "",
      description: "",
      resourceCategoryId: "",
      typeOfResourceId: "",
      courseId: "",
      file: "",
      url: "",
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
    <CustomModal
      isOpen={isOpen}
      onClose={handleOnClose}
      title={initialData ? "Edit Resource" : "Add Resource"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-1">
        <InputCustom
          label="Title"
          name="title"
          type="text"
          value={formData.title}
          placeholder="Enter resource title"
          onChange={handleInputChange}
          errorMessage={formErrors.title}
          isRequired
          disabled={!isEditable}
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
          disabled={!isEditable}
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
          disabled={!!initialData || !isEditable}
        />
        <div className="flex gap-2">
          <div className="flex-1">
            <InputCustom
              label="Category"
              name="resourceCategoryId"
              type="select"
              value={formData.resourceCategoryId.toString()}
              onChange={handleInputChange}
              errorMessage={formErrors.resourceCategoryId}
              isRequired
              optionList={categoryOptionsList}
              disabled={!isEditable}
            />
          </div>
          <div className="flex-1">
            <InputCustom
              label="Type"
              name="typeOfResourceId"
              type="select"
              value={formData.typeOfResourceId.toString()}
              onChange={handleInputChange}
              errorMessage={formErrors.typeOfResourceId}
              isRequired
              optionList={typeOptions}
              disabled={!isEditable}
            />
          </div>
        </div>
        {formData.typeOfResourceId === 1 || formData.typeOfResourceId === 2 ? (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Upload File{" "}
              {initialData ? "" : <span className="text-red-500">*</span>}
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept={formData.typeOfResourceId === 1 ? ".mp4" : ".pdf"}
              onChange={handleFileChange}
              className="w-full text-sm text-gray-300 bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={!isEditable}
            />
            {formErrors.file && (
              <p className="text-xs text-red-500 mt-1">{formErrors.file}</p>
            )}
            {formData.file && (
              <p className="text-xs text-gray-300 mt-1">
                {formData.file.name} (
                {(formData.file.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            )}
            {initialData?.fileName && !formData.file && (
              <p className="text-xs text-gray-300 mt-1">
                Current: {initialData.fileName}
              </p>
            )}
          </div>
        ) : formData.typeOfResourceId === 3 ? (
          <InputCustom
            label="Link"
            name="url"
            type="text"
            value={formData.url}
            placeholder="Enter resource URL"
            onChange={handleInputChange}
            errorMessage={formErrors.url}
            isRequired
            disabled={!isEditable}
          />
        ) : null}
        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="secondary" onClick={handleOnClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !isEditable}
          >
            {loading ? "Saving..." : initialData ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </CustomModal>
  );
};

export default ResourceAddDialog;
