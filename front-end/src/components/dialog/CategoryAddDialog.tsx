import React, { useState } from "react";
import InputCustom from "../input/InputCustom";
import { CategoryType } from "../../types/category";
import InputCheckbox from "../input/InputCheckbox";
import Button from "../ui/Button";
import loading from "../../assets/loadingIcon.svg";
interface CategoryAddDialogProps {
  onClose: () => void;
  onSubmit: (category: CategoryType) => void;
  initialData?: CategoryType;
  actionButtonText?: string;
  isSubmitting: boolean;
}

const CategoryAddDialog: React.FC<CategoryAddDialogProps> = ({
  onClose,
  onSubmit,
  initialData,
  actionButtonText = "Save",
  isSubmitting = false,
}) => {
  const [formState, setFormState] = useState<CategoryType>({
    id: initialData?.id || "",
    name: initialData?.name || "",
    description: initialData?.description || "",
    status: initialData?.status.id === 2 ? 2 : 1,
    courseCount: initialData?.courseCount || 0,
  });

  const [errors, setErrors] = useState({
    name: "",
    description: "",
  });

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
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    console.log(checked);

    setFormState((prevState) => ({
      ...prevState,
      [name]: checked ? 2 : 1,
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "", description: "" };

    if (!formState.name.trim()) {
      newErrors.name = "Name is required.";
      isValid = false;
    } else if (formState.name.length > 100) {
      newErrors.name = "Name must not exceed 100 characters.";
      isValid = false;
    }

    if (formState.description.length > 1000) {
      newErrors.description = "Description must not exceed 1000 characters.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    } else {
      onSubmit(formState);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-6">
        {/* Name Field */}
        <InputCustom
          label="Name"
          name="name"
          type="text"
          value={formState.name}
          onChange={handleChange}
          isRequired
          placeholder="Enter category name"
          errorMessage={errors.name}
        />
      </div>
      <div className="grid grid-cols-1 gap-6">
        {/* Description Field */}
        <InputCustom
          label="Description"
          name="description"
          type="textarea"
          value={formState.description}
          onChange={handleChange}
          placeholder="Enter category description"
          errorMessage={errors.description}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Status Field */}
        <InputCheckbox
          label="Active"
          name="status"
          onChange={handleCheckboxChange}
          checked={formState.status === 2}
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-4">
        <Button
          variant="secondary"
          size="md"
          className="font-bold text-white"
          onClick={onClose}
          disabled={isSubmitting}
          dataTestId="cancel-button"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="md"
          type="submit"
          disabled={isSubmitting}
          dataTestId="submit-button"
        >
          {isSubmitting ? (
            <>
              <span className="flex items-center space-x-2">
                <img src={loading} alt="loadingicon" />
                <span>Saving...</span>
              </span>
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
