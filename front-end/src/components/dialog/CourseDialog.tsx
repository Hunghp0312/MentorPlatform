import React, { useState } from "react";
import { CourseType } from "../../types/course";
import InputCustom from "../input/InputCustom";
import InputTag from "../input/InputTag";
import { ComboBox } from "../input/ComboBox";

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
    difficulty: initialData?.difficulty || 0,
    duration: initialData?.duration || 0,
    tags: initialData?.tags || [],
    description: initialData?.description || "",
  });
  // const [errors, setErrors] = useState({
  //   title: "",
  //   categoryId: "",
  //   status: 0,
  //   difficulty: 0,
  //   duration: 0,
  //   tags: [],
  //   description: "",
  // });
  const errors = {
    title: "",
    categoryId: "",
    status: 0,
    difficulty: 0,
    duration: 0,
    tags: [],
    description: "",
  };

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
  };
  const handleSubmit = () => {
    onClose();
  };
  const categories = [
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

  if (!open) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <ComboBox
        options={categories}
        onChange={(s) => console.log(s)}
      ></ComboBox>
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
          name="author"
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
          value={formState.categoryId}
          onChange={handleChange}
          name="categoryId"
          optionList={categories}
        ></InputCustom>
        {/* Category Field */}
        <InputCustom
          type="select"
          value={formState.categoryId}
          onChange={handleChange}
          name="categoryId"
          label="Difficulty"
          optionList={categories}
        ></InputCustom>
      </div>
      {/* Description Field */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Published Date Field */}
        <InputCustom
          label="Duration"
          type="text"
          value={formState.categoryId}
          onChange={handleChange}
          name="categoryId"
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
