import React, { useEffect, useState } from "react";
import { CourseType } from "../../types/course";
import InputCustom from "../input/InputCustom";
import InputTag from "../input/InputTag";
import { categoryService } from "../../services/category.service";

interface CourseDialogProps {
  onClose: () => void;
  // onSubmit: (category: { name: string; description: string }) => void;
  initialData?: CourseType;
  actionButtonText?: string;
  isSubmitting: boolean;
}

const CategoryAddDialog: React.FC<CourseDialogProps> = ({
  onClose,
  // onSubmit,
  initialData,
  actionButtonText = "Save",
  isSubmitting = false,
}) => {
  const [formState, setFormState] = useState({
    title: initialData?.title || "",
    categoryId: initialData?.categoryId || "",
    status: initialData?.status || 0,
    level: initialData?.level || 0,
    duration: initialData?.duration || "",
    tags: initialData?.tags || [],
    description: initialData?.description || "",
  });
  const [categories, setCategories] = useState([]);
  // const [errors, setErrors] = useState({
  //   title: "",
  //   categoryId: "",
  //   status: 0,
  //   difficulty: 0,
  //   duration: 0,
  //   tags: [],
  //   description: "",
  // });

  const [errors, setErrors] = useState<Record<string, string>>({
    title: "",
    categoryId: "",
    status: "",
    level: "",
    duration: "",
    tags: "",
    description: "",
  });
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAllCategories();
        setCategories(res.data);
        if (!initialData) {
          setFormState((prevState) => ({
            ...prevState,
            categoryId: res.data[0]?.id || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
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
    if (!formState.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (
      formState.title.trim().length < 1 ||
      formState.title.trim().length > 100
    ) {
      newErrors.title = "Title must be between 1 and 100 characters";
    }
    if (!formState.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (
      formState.description.trim().length < 1 ||
      formState.description.trim().length > 1000
    ) {
      newErrors.description =
        "Description must be between 1 and 1000 characters";
    }
    if (
      formState.duration.trim().length < 6 ||
      formState.duration.trim().length > 100
    ) {
      newErrors.duration = "Duration must be between 6 and 100 characters";
    }
    if (formState.tags.length === 0) {
      newErrors.tags = "At least one tag is required";
    }
    if (![0, 1, 2].includes(Number(formState.level))) {
      newErrors.level = "Please select a valid difficulty level";
    }
    if (![0, 1].includes(Number(formState.status))) {
      newErrors.status = "Please select a valid status";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  //   const validateForm = () => {
  //   const newErrors: Record<string, string> = {};

  //   if (!formState.title.trim()) {
  //     newErrors.title = "Title is required";
  //   }

  //   if (!formState.categoryId) {
  //     newErrors.categoryId = "Category is required";
  //   }

  //   if (!formState.description.trim()) {
  //     newErrors.description = "Description is required";
  //   }

  //   // if (formState.duration.length <= 0) {
  //   //   newErrors.duration = "Duration must be greater than 0";
  //   // }

  //   if (formState.tags.length === 0) {
  //     newErrors.tags = "At least one tag is required";
  //   }

  //   if (![0, 1, 2].includes(Number(formState.level))) {
  //     newErrors.level = "Please select a valid difficulty level";
  //   }

  //   if (![0, 1].includes(Number(formState.status))) {
  //     newErrors.status = "Please select a valid status";
  //   }

  //   return Object.keys(newErrors).length === 0;
  // };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    onClose();
  };
  if (!open) return null;
  const levelOptions = [
    { id: 0, name: "Beginner" },
    { id: 1, name: "Intermediate" },
    { id: 2, name: "Advanced" },
  ];
  const statusOptions = [
    { id: 0, name: "Draft" },
    { id: 1, name: "Publish" },
    { id: 2, name: "" },
  ];
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* <ComboBox
        options={categories}
        onChange={(s) => console.log(s)}
      ></ComboBox> */}
      {/* <div className="text-white">{JSON.stringify(formState)}</div> */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title Field */}
        <InputCustom
          label="Title"
          name="title"
          type="text"
          value={formState.title}
          onChange={handleChange}
          isRequired
          placeholder="Enter title of the book"
          errorMessage={errors.title}
        ></InputCustom>
        {/* Author Field */}
        <InputCustom
          label="Category"
          name="categoryId"
          optionList={categories}
          type="select"
          value={formState.categoryId}
          onChange={handleChange}
          isRequired
          errorMessage={errors.categoryId}
        ></InputCustom>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Published Date Field */}
        <InputCustom
          label="Status"
          type="select"
          value={formState.status}
          onChange={handleChange}
          name="status"
          optionList={statusOptions}
        ></InputCustom>
        {/* Category Field */}
        <InputCustom
          type="select"
          value={formState.level}
          onChange={handleChange}
          name="level"
          label="Level"
          optionList={levelOptions}
        ></InputCustom>
      </div>
      {/* Description Field */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Published Date Field */}
        <InputCustom
          label="Duration"
          type="text"
          value={formState.duration}
          onChange={handleChange}
          name="duration"
        ></InputCustom>
        {/* Category Field */}
        <InputTag
          label="Tags"
          tags={formState.tags}
          setTags={(tags) => {
            setFormState((prevState) => ({
              ...prevState,
              tags: tags,
            }));
          }}
        ></InputTag>
      </div>
      <InputCustom
        name="description"
        type="textarea"
        value={formState.description}
        onChange={handleChange}
        label="Description"
        isRequired
        placeholder="Enter book description"
        errorMessage={errors.description}
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
        <button
          type="submit"
          className={`px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-500 flex items-center ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting}
        >
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
        </button>
      </div>
    </form>
  );
};

export default CategoryAddDialog;
