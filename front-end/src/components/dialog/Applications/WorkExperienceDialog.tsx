import React, { useState } from "react";
import InputCustom from "../../input/InputCustom";
import { MentorWorkExperience } from "../../../types/mentorapplication";
import Button from "../../ui/Button";
import loading from "../../../assets/loadingIcon.svg";

interface WorkExperienceAddDialogProps {
  onClose: () => void;
  onSubmit: (education: MentorWorkExperience) => void;
  initialData?: MentorWorkExperience;
  actionButtonText?: string;
  isSubmitting?: boolean;
}

const WorkExperienceAddDialog: React.FC<WorkExperienceAddDialogProps> = ({
  onClose,
  onSubmit,
  initialData,
  actionButtonText = "Save",
  isSubmitting = false,
}) => {
  const [formState, setFormState] = useState<MentorWorkExperience>({
    companyName: initialData?.companyName || "",
    position: initialData?.position || "",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
  });
  const [errors, setErrors] = useState({
    companyName: "",
    position: "",
    startDate: "",
    endDate: "",
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
      companyName: "",
      position: "",
      startDate: "",
      endDate: "",
    };

    if (!formState.companyName.trim()) {
      newErrors.companyName = "Company name is required.";
      isValid = false;
    } else if (formState.companyName.length > 100) {
      newErrors.companyName = "Company name must not exceed 100 characters.";
      isValid = false;
    }

    if (!formState.position.trim()) {
      newErrors.position = "Position is required.";
      isValid = false;
    } else if (formState.position.length > 100) {
      newErrors.position = "Position must not exceed 100 characters.";
      isValid = false;
    }

    if (!formState.startDate.trim()) {
      newErrors.startDate = "Start year is required.";
      isValid = false;
    } else if (!/^\d{4}$/.test(formState.startDate)) {
      newErrors.startDate = "Start year must be a valid 4-digit number.";
      isValid = false;
    }

    if (
      formState.endDate &&
      formState.endDate !== "Present" &&
      !/^\d{4}$/.test(formState.endDate)
    ) {
      newErrors.endDate = "End year must be a valid 4-digit number.";
      isValid = false;
    } else if (
      formState.endDate &&
      formState.endDate !== "Present" &&
      Number(formState.endDate) < Number(formState.startDate)
    ) {
      newErrors.endDate = "End year cannot be earlier than start year.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const updatedFormState = {
      ...formState,
      endDate: formState.endDate?.trim() === "" ? "Present" : formState.endDate,
    };
    onSubmit(updatedFormState);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-6">
        <InputCustom
          label="Company Name"
          name="companyName"
          type="text"
          value={formState.companyName}
          onChange={handleChange}
          isRequired
          placeholder="Enter company name"
          errorMessage={errors.companyName}
        />
      </div>
      <div className="grid grid-cols-1 gap-6">
        <InputCustom
          label="Position"
          name="position"
          type="text"
          value={formState.position}
          onChange={handleChange}
          isRequired
          placeholder="Enter your position"
          errorMessage={errors.position}
        />
      </div>
      <div className="grid grid-cols-1 gap-6">
        <InputCustom
          label="Year Start"
          name="startDate"
          type="text"
          value={formState.startDate}
          onChange={handleChange}
          isRequired
          placeholder="Enter year (e.g., 2023)"
          errorMessage={errors.startDate}
        />
      </div>
      <div className="grid grid-cols-1 gap-6">
        <InputCustom
          label="Year End"
          name="endDate"
          type="text"
          value={formState.endDate || ""}
          onChange={handleChange}
          placeholder="Enter year (e.g., 2023) or leave empty for Present"
          errorMessage={errors.endDate}
        />
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <Button
          variant="secondary"
          size="md"
          className="font-bold text-white"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
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

export default WorkExperienceAddDialog;
