import React, { useState } from "react";
import InputCustom from "../../input/InputCustom";
import { MentorEducation } from "../../../types/mentorapplication";
import Button from "../../ui/Button";
import loading from "../../../assets/loadingIcon.svg";
interface EducationAddDialogProps {
  onClose: () => void;
  onSubmit: (education: MentorEducation) => void;
  initialData?: MentorEducation;
  actionButtonText?: string;
  isSubmitting?: boolean;
}

const EducationAddDialog: React.FC<EducationAddDialogProps> = ({
  onClose,
  onSubmit,
  initialData,
  actionButtonText = "Save",
  isSubmitting = false,
}) => {
  const [formState, setFormState] = useState<MentorEducation>({
    institutionName: initialData?.institutionName || "",
    fieldOfStudy: initialData?.fieldOfStudy || "",
    graduationYear: initialData?.graduationYear ?? undefined,
  });
  const [errors, setErrors] = useState({
    institutionName: "",
    fieldOfStudy: "",
    graduationYear: "",
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
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      institutionName: "",
      fieldOfStudy: "",
      graduationYear: "",
    };

    if (!formState.institutionName.trim()) {
      newErrors.institutionName = "Institution name is required.";
      isValid = false;
    } else if (formState.institutionName.length > 100) {
      newErrors.institutionName =
        "Institution name must not exceed 100 characters.";
      isValid = false;
    }

    if (!formState.fieldOfStudy.trim()) {
      newErrors.fieldOfStudy = "Field Of Study is required.";
      isValid = false;
    } else if (formState.fieldOfStudy.length > 100) {
      newErrors.fieldOfStudy = "Field Of Study must not exceed 100 characters.";
      isValid = false;
    }

    if (!formState.graduationYear?.toString().trim()) {
      newErrors.graduationYear = "Year is required.";
      isValid = false;
    } else if (!/^\d{4}$/.test(formState.graduationYear.toString())) {
      newErrors.graduationYear = "Year must be a valid 4-digit number.";
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
        {/* School Name Field */}
        <InputCustom
          label="Institution Name"
          name="institutionName"
          type="text"
          value={formState.institutionName}
          onChange={handleChange}
          isRequired
          placeholder="Enter school name"
          errorMessage={errors.institutionName}
        />
      </div>
      <div className="grid grid-cols-1 gap-6">
        {/* Major Field */}
        <InputCustom
          label="Field Of Study"
          name="fieldOfStudy"
          type="text"
          value={formState.fieldOfStudy}
          onChange={handleChange}
          isRequired
          placeholder="Enter major"
          errorMessage={errors.fieldOfStudy}
        />
      </div>
      <div className="grid grid-cols-1 gap-6">
        {/* Year Field */}
        <InputCustom
          label="Graduation Year"
          name="graduationYear"
          type="text"
          value={formState.graduationYear?.toString() || ""}
          onChange={handleChange}
          isRequired
          placeholder="Enter year (e.g., 2023)"
          errorMessage={errors.graduationYear}
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-4">
        <Button
          id="cancel-education-dialog-button"
          variant="secondary"
          size="md"
          className="font-bold text-white"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          id="submit-education-dialog-button"
          variant="primary"
          size="md"
          type="submit"
          disabled={isSubmitting}
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

export default EducationAddDialog;
