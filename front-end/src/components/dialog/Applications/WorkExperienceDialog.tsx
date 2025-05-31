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
  actionButtonText = initialData ? "Update" : "Save",
  isSubmitting = false,
}) => {
  const [formState, setFormState] = useState<MentorWorkExperience>({
    companyName: initialData?.companyName || "",
    position: initialData?.position || "",
    startDate: initialData?.startDate
      ? new Date(initialData.startDate).toISOString().slice(5, 7) +
        "/" +
        new Date(initialData.startDate).getFullYear()
      : "",
    endDate:
      initialData?.endDate && initialData.endDate !== "Present"
        ? new Date(initialData.endDate).toISOString().slice(5, 7) +
          "/" +
          new Date(initialData.endDate).getFullYear()
        : "",
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
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Months are 0-based in JS

    // Company Name and Position validation remain unchanged
    if (!formState.companyName.trim()) {
      newErrors.companyName = "Company name is required.";
      isValid = false;
    } else if (formState.companyName.length > 150) {
      newErrors.companyName = "Company name must not exceed 150 characters.";
      isValid = false;
    }

    if (!formState.position.trim()) {
      newErrors.position = "Job Title is required.";
      isValid = false;
    } else if (formState.position.length > 150) {
      newErrors.position = "Job Title must not exceed 150 characters.";
      isValid = false;
    }

    // Start Date Validation
    if (!formState.startDate.trim()) {
      newErrors.startDate = "Start date is required.";
      isValid = false;
    } else if (!/^\d{2}\/\d{4}$/.test(formState.startDate)) {
      newErrors.startDate = "Start date must be in MM/YYYY format.";
      isValid = false;
    } else {
      const [startMonth, startYear] = formState.startDate
        .split("/")
        .map(Number);
      if (startYear < 1900 || startYear > currentYear) {
        newErrors.startDate = `Start year must be between 1900 and ${currentYear}.`;
        isValid = false;
      } else if (startMonth < 1 || startMonth > 12) {
        newErrors.startDate = "Start month must be between 01 and 12.";
        isValid = false;
      } else if (startYear === currentYear && startMonth > currentMonth) {
        newErrors.startDate = "Start date cannot be in the future.";
        isValid = false;
      }
    }

    if (formState.endDate && !/^\d{2}\/\d{4}$/.test(formState.endDate)) {
      newErrors.endDate = "End date must be in MM/YYYY format.";
      isValid = false;
    } else if (formState.endDate) {
      const [endMonth, endYear] = formState.endDate.split("/").map(Number);
      const [startMonth, startYear] = formState.startDate
        .split("/")
        .map(Number);
      if (endYear < 1900 || endYear > currentYear + 5) {
        newErrors.endDate = `End year must be between 1900 and ${
          currentYear + 5
        }.`;
        isValid = false;
      } else if (endMonth < 1 || endMonth > 12) {
        newErrors.endDate = "End month must be between 01 and 12.";
        isValid = false;
      } else if (endYear < startYear) {
        newErrors.endDate = "End year cannot be before start year.";
        isValid = false;
      } else if (endYear === startYear && endMonth < startMonth + 1) {
        newErrors.endDate =
          "End date must be at least one month after start date.";
        isValid = false;
      }
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const [startMonth, startYear] = formState.startDate.split("/");
    const updatedFormState = {
      ...formState,
      startDate: `${startYear}-${startMonth}-01T00:00:00.000Z`,
      endDate: formState.endDate?.trim()
        ? (() => {
            const [endMonth, endYear] = formState.endDate.split("/");
            return `${endYear}-${endMonth}-01T00:00:00.000Z`;
          })()
        : null,
    };
    onSubmit(updatedFormState);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
          label="Start Date"
          name="startDate"
          type="text"
          value={formState.startDate}
          onChange={handleChange}
          isRequired
          placeholder="Enter date (MM/YYYY)"
          errorMessage={errors.startDate}
        />
      </div>
      <div className="grid grid-cols-1 gap-6">
        <InputCustom
          label="End Date"
          name="endDate"
          type="text"
          value={formState.endDate || ""}
          onChange={handleChange}
          placeholder="Enter date (MM/YYYY) or leave empty for Present"
          errorMessage={errors.endDate}
        />
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <Button
          id="cancel-workexperience-dialog-button"
          variant="secondary"
          size="md"
          className="font-bold text-white"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          id="submit-workexperience-dialog-button"
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
