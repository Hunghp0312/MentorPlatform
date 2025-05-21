import React, { useEffect, useState } from "react";
import { CourseCreateUpdateType, CourseType } from "../../types/course";
import InputCustom from "../input/InputCustom";
import InputTag from "../input/InputTag";
import { categoryService } from "../../services/category.service";
import ComboBox from "../input/ComboBox";
import LoadingOverlay from "../loading/LoadingOverlay";
import { CategoryType } from "../../types/category";
import Dropdown from "../input/Dropdown";
import Button from "../ui/Button";

interface CourseDialogProps {
  onClose: () => void;
  onSubmit: (course: CourseCreateUpdateType) => void;
  initialData?: CourseType;
  actionButtonText?: string;
  isSubmitting: boolean;
}

const CategoryAddDialog: React.FC<CourseDialogProps> = ({
  onClose,
  onSubmit,
  initialData,
  actionButtonText = "Save",
  isSubmitting = false,
}) => {
  const [formState, setFormState] = useState<CourseCreateUpdateType>({
    name: initialData?.name ?? "",
    categoryId: initialData?.category.id ?? "",
    statusId: initialData?.status.id ?? 1,
    levelId: initialData?.level.id !== undefined ? initialData.level.id : "",
    duration: initialData?.duration ?? "",
    tags: initialData?.tags ?? [],
    description: initialData?.description ?? "",
  });
  const [categories, setCategories] = useState<CategoryType[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({
    title: "",
    categoryId: "",
    status: "",
    level: "",
    duration: "",
    tags: "",
    description: "",
  });
  // Loading
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const res = await categoryService.getAllCategories();
        setCategories([
          { id: "", name: "" },
          ...res.sort((a: CategoryType, b: CategoryType) =>
            a.name.localeCompare(b.name)
          ),
        ]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, [initialData]);
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    // Title validate
    if (formState.name.length < 1 || formState.name.length > 100) {
      newErrors.name = "Title must be between 1 and 100 characters";
    }
    if (!formState.name) {
      newErrors.name = "Please fill out this field";
    }
    // Category validate
    if (formState.categoryId === "") {
      newErrors.categoryId = "Please select an item in the list";
    }
    if (formState.levelId === "") {
      newErrors.levelId = "Please select an item in the list";
    }
    if (
      formState.description.length < 1 ||
      formState.description.length > 1000
    ) {
      newErrors.description =
        "Description must be between 1 and 1000 characters";
    }
    if (!formState.description) {
      newErrors.description = "Please fill out this field";
    }
    if (formState.duration.length < 6 || formState.duration.length > 100) {
      newErrors.duration = "Duration must be between 6 and 100 characters";
    }
    if (!formState.duration) {
      newErrors.duration = "Please fill out this field";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    onSubmit(formState);
  };
  if (!open) return null;
  const levelOptions = [
    { value: "", label: "Select a level" },
    { value: 1, label: "Beginner" },
    { value: 2, label: "Intermediate" },
    { value: 3, label: "Advanced" },
  ];
  const statusOptions = [
    { value: 1, label: "Draft" },
    { value: 2, label: "Published" },
    { value: 3, label: "Archived" },
  ];
  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value.trim(),
    }));
    if (value.trim() === "") {
      setErrors((prev) => ({ ...prev, [name]: "Please fill out this field" }));
    }
  };
  const handleComboboxChange = (value: string, name: string) => {
    let fieldValue;
    if (name === "status" || name === "level") {
      fieldValue = Number(value);
    } else {
      fieldValue = value;
    }
    setFormState((prevState) => ({
      ...prevState,
      [name]: fieldValue,
    }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  if (isLoading) {
    return <LoadingOverlay />;
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title Field */}
        <InputCustom
          label="Title"
          name="name"
          type="text"
          value={formState.name}
          onChange={handleChange}
          isRequired
          placeholder="Enter title of the course"
          errorMessage={errors.name}
          onBlur={handleBlur}
        ></InputCustom>
        {/* Category Field */}
        <ComboBox
          label="Category"
          name="categoryId"
          value={formState.categoryId}
          onChange={handleComboboxChange}
          options={categories.map((item) => ({
            value: item.id as string,
            label: item.name,
          }))}
          placeholder="Select a category"
          errorMessage={errors.categoryId}
          isRequired
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Field */}
        <Dropdown
          label="Status"
          name="statusId"
          value={String(formState.statusId)}
          onChange={handleComboboxChange}
          options={statusOptions.map((item) => ({
            value: String(item.value),
            label: item.label,
          }))}
          errorMessage={errors.statusId}
          isRequired
        ></Dropdown>
        {/* Level Field */}
        <Dropdown
          label="Level"
          name="levelId"
          value={String(formState.levelId)}
          onChange={handleComboboxChange}
          options={levelOptions.map((item) => ({
            value: String(item.value),
            label: item.label,
          }))}
          errorMessage={errors.levelId}
          isRequired
        ></Dropdown>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Duration Field */}
        <InputCustom
          label="Duration"
          type="text"
          value={formState.duration}
          onChange={handleChange}
          name="duration"
          errorMessage={errors.duration}
          isRequired
          placeholder="Enter duration of course"
          onBlur={handleBlur}
        ></InputCustom>
        {/* Tags Field */}
        <InputTag
          label="Tags"
          tags={formState.tags}
          setTags={(tags) => {
            setErrors((prev) => ({ ...prev, ["tags"]: "" }));
            setFormState((prevState) => ({
              ...prevState,
              tags: tags,
            }));
          }}
          setErrorMessage={(message) =>
            setErrors((prev) => ({ ...prev, ["tags"]: message }))
          }
          errorMessage={errors.tags}
        ></InputTag>
      </div>
      {/* Description Field */}
      <InputCustom
        name="description"
        type="textarea"
        value={formState.description}
        onChange={handleChange}
        label="Description"
        isRequired
        placeholder="Enter book description"
        errorMessage={errors.description}
        onBlur={handleBlur}
      ></InputCustom>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          className="px-4 py-2 bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-600"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <Button variant="primary" size="md" type="submit">
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </>
          ) : (
            actionButtonText
          )}
        </Button>
      </div>
    </form>
  );
};

export default CategoryAddDialog;
