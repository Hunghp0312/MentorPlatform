import React, { useState } from "react";
import InputCustom from "../../input/InputCustom";
import { MentorCertification } from "../../../types/mentorapplication";
// import InputCheckbox from "../input/InputCheckbox";
import Button from "../../ui/Button";
import loading from "../../../assets/loadingIcon.svg";
interface CertificationAddDialogProps {
  onClose: () => void;
  onSubmit: (certification: MentorCertification) => void;
  initialData?: MentorCertification;
  actionButtonText?: string;
  isSubmitting?: boolean;
}

const CertificationAddDialog: React.FC<CertificationAddDialogProps> = ({
  onClose,
  onSubmit,
  initialData,
  actionButtonText = "Save",
  isSubmitting = false,
}) => {
  const [formState, setFormState] = useState<MentorCertification>({
    certificationName: initialData?.certificationName || "",
    issuingOrganization: initialData?.issuingOrganization || "",
  });
  const [errors, setErrors] = useState({
    certificationName: "",
    issuingOrganization: "",
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
      certificationName: "",
      issuingOrganization: "",
    };

    if (!formState.certificationName.trim()) {
      newErrors.certificationName = "Certification name is required.";
      isValid = false;
    } else if (formState.certificationName.length > 100) {
      newErrors.certificationName =
        "Certification name must not exceed 100 characters.";
      isValid = false;
    }

    if (!formState.issuingOrganization.trim()) {
      newErrors.issuingOrganization = "Organization is required.";
      isValid = false;
    } else if (formState.issuingOrganization.length > 100) {
      newErrors.issuingOrganization =
        "Organization must not exceed 100 characters.";
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
          label="Certification Name"
          name="certificationName"
          type="text"
          value={formState.certificationName}
          onChange={handleChange}
          isRequired
          placeholder="Enter certification name"
          errorMessage={errors.certificationName}
        />
      </div>
      <div className="grid grid-cols-1 gap-6">
        {/* Major Field */}
        <InputCustom
          label="Organization"
          name="issuingOrganization"
          type="text"
          value={formState.issuingOrganization}
          onChange={handleChange}
          isRequired
          placeholder="Enter organization"
          errorMessage={errors.issuingOrganization}
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

export default CertificationAddDialog;
