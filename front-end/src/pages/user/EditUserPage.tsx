import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, Save, ArrowLeft } from "lucide-react";

// Components
import InputCustom from "../../components/input/InputCustom";
import MultiSelectButtons from "../../components/register/child/MultiSelectButtons";
import InputCheckbox from "../../components/input/InputCheckbox";
import Dropdown from "../../components/input/Dropdown";

// Types
import { UserUpdateRequest } from "../../types/user";

// Services
import { userService } from "../../services/user.service";
import { pathName } from "../../constants/pathName";
import { EnumType } from "../../types/commonType";
import { getUserFromToken } from "../../utils/auth";
import LoadingOverlay from "../../components/loading/LoadingOverlay";

// Constants for form options
const teachingApproachOptions = [
  { value: "1", label: "Hands-On Practice" },
  { value: "2", label: "Theory-Based" },
  { value: "3", label: "Project-Led Mentoring" },
  { value: "4", label: "Step-by-Step Tutorials" },
];

const availabilityOptions = [
  { value: "1", label: "Weekdays" },
  { value: "2", label: "Weekends" },
  { value: "3", label: "Mornings" },
  { value: "4", label: "Afternoons" },
  { value: "5", label: "Evenings" },
];

const topicOptions = [
  { value: "1", label: "Career Development" },
  { value: "2", label: "Technical Skills" },
  { value: "3", label: "Leadership" },
  { value: "4", label: "Communication" },
  { value: "5", label: "Work-Life Balance" },
  { value: "6", label: "Industry Insights" },
  { value: "7", label: "Networking" },
  { value: "8", label: "Entrepreneurship" },
];

const learningStyleOptions = [
  { value: "1", label: "Visual (seeing)" },
  { value: "2", label: "Auditory (hearing)" },
  { value: "3", label: "Reading/Writing" },
  { value: "4", label: "Kinesthetic (doing)" },
];

const areaExpertiseOptions = [
  { value: "1", label: "Programming" },
  { value: "2", label: "Design" },
  { value: "3", label: "Leadership" },
  { value: "4", label: "Data Science" },
  { value: "5", label: "Project Management" },
  { value: "6", label: "Marketing" },
  { value: "7", label: "Business" },
  { value: "8", label: "Communication" },
];

const sessionFrequencyOptions = [
  { value: "1", label: "Weekly" },
  { value: "2", label: "Bi-weekly" },
  { value: "3", label: "Monthly" },
  { value: "4", label: "As Needed" },
];

const sessionDurationOptions = [
  { value: "1", label: "30 Minutes" },
  { value: "2", label: "45 Minutes" },
  { value: "3", label: "1 Hour" },
  { value: "4", label: "1.5 Hours" },
  { value: "5", label: "2 Hours" },
];

const communicationMethodOptions = [
  { value: 1, label: "Video Call" },
  { value: 2, label: "Audio Call" },
  { value: 3, label: "Text Chat" },
];

const EditUserPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // Form errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // User data state
  const [userData, setUserData] = useState<UserUpdateRequest>({
    fullName: "",
    bio: "",
    phoneNumber: null,
    professionalSkill: null,
    industryExperience: "",
    teachingApproaches: [],
    userProfileAvailabilities: [],
    userTopicOfInterests: [],
    userLearningStyles: [],
    userGoal: null,
    sessionFrequencyId: 1,
    sessionDurationId: 3, // Default to 1 hour
    privacyProfile: false,
    messagePermission: true,
    notificationsEnabled: true,
    communicationMethod: 1, // Default to video call
    userAreaExpertises: [],
  });
  const decodedToken = getUserFromToken();
  const { id } = useParams<{ id: string }>();
  // Load user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await userService.getUserById(id!);

        // Map API response to form state
        setUserData({
          ...userData,
          ...response,
        });
        setUserData((prevData) => ({
          ...prevData,
          userAreaExpertises: response.areaOfExpertises.map(
            (expertise: EnumType) => expertise.id
          ),
          userProfileAvailabilities: response.profileAvailabilities.map(
            (availability: EnumType) => availability.id
          ),
          userTopicOfInterests: response.topicOfInterests.map(
            (topic: EnumType) => topic.id
          ),
          userLearningStyles: response.learningStyles.map(
            (style: EnumType) => style.id
          ),
          teachingApproaches: response.teachingApproaches.map(
            (approach: EnumType) => approach.id
          ),
          sessionFrequencyId: response.sessionFrequency.id || 1,
          communicationMethod: response.communicationMethod.id || 1,
          sessionDurationId: response.sessionDuration.id || 3,
        }));
        // Set image preview if user has a profile photo
        if (response.photoData) {
          setImagePreview(response.photoData);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle text input changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      const isValid = /^[0-9+\s]*$/.test(value);
      if (!isValid && value.length > 0) {
        return;
      }
      if (value.length > 15) {
        setUserData({ ...userData, [name]: value.slice(0, 15) });
        return;
      }
    }
    if (name === "fullName" && value.length > 100) {
      setUserData({ ...userData, [name]: value.slice(0, 100) });
      return;
    }
    if (name === "bio" && value.length > 1000) {
      setUserData({ ...userData, [name]: value.slice(0, 1000) });
      return;
    }
    if (name === "professionalSkill" && value.length > 100) {
      setUserData({ ...userData, [name]: value.slice(0, 100) });
      return;
    }
    if (name === "industryExperience" && value.length > 50) {
      setUserData({ ...userData, [name]: value.slice(0, 50) });
      return;
    }
    setUserData({ ...userData, [name]: value });

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setUserData({ ...userData, [name]: checked });
  };

  // Handle dropdown select changes
  const handleSelectChange = (name: string, value: string | number) => {
    setUserData({ ...userData, [name]: Number(value) });

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Handle multi-select changes
  const handleMultiSelectChange = (name: string, selectedValues: number[]) => {
    setUserData({ ...userData, [name]: selectedValues });

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Handle file upload for profile picture
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Validate file type and size
      const validTypes = ["image/jpeg", "image/png"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setErrors({
          ...errors,
          photoData: "Only JPEG and PNG images are allowed.",
        });
        return;
      }

      if (file.size > maxSize) {
        setErrors({
          ...errors,
          photoData:
            "Please select a .png, jpeg, or .jpg file with a maximum of 5MB",
        });
        return;
      }

      // Clear error if validation passes
      setErrors({ ...errors, photoData: "" });

      // Update form data
      setUserData({ ...userData, photoData: file });

      // Preview image
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove profile picture
  const handleRemoveImage = () => {
    setImagePreview(null);
    setUserData({ ...userData, photoData: undefined });

    // Clear any file input
    const fileInput = document.getElementById("photoData") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate required fields

    if (
      userData.fullName.trim().length < 2 ||
      userData.fullName.trim().length > 100
    ) {
      newErrors.fullName = "Full name must be between 2-100 characters.";
    }
    if (!userData.fullName.trim()) {
      newErrors.fullName = "Please fill in your full name";
    }
    if (userData.bio.trim().length > 1000) {
      newErrors.bio = "Bio must be less than 1000 characters";
    }
    if (!userData.bio?.trim()) {
      newErrors.bio = "Bio is required";
    }
    if (
      userData.professionalSkill &&
      userData.professionalSkill.trim().length > 50
    ) {
      newErrors.professionalSkill =
        "Professional skill must be less than 50 characters";
    }
    if (!userData.professionalSkill?.trim()) {
      newErrors.professionalSkill = "Professional skills are required";
    }
    if (
      userData.phoneNumber &&
      /^\+?[1-9]\d{1,14}$/.test(userData.phoneNumber) === false
    ) {
      newErrors.phoneNumber =
        "Invalid phone number format. Use E.164 format (e.g., +1234567890)";
    }
    if (userData.phoneNumber && userData.phoneNumber.trim().length > 15) {
      newErrors.phoneNumber = "Phone number must be less than 15 characters";
    }
    if (
      userData.industryExperience &&
      userData.industryExperience.trim().length > 50
    ) {
      newErrors.industryExperience =
        "Industry experience must be less than 50 characters";
    }
    if (!userData.industryExperience || !userData.industryExperience.trim()) {
      newErrors.industryExperience = "Industry experience is required";
    }

    if (!userData.communicationMethod) {
      newErrors.communicationMethod =
        "Preferred communication method is required";
    }
    if (!userData.sessionFrequencyId || userData.sessionFrequencyId <= 0) {
      newErrors.sessionFrequencyId = "Session frequency is required";
    }
    if (!userData.sessionDurationId || userData.sessionDurationId <= 0) {
      newErrors.sessionDurationId = "Session duration is required";
    }
    if (!userData.userGoal?.trim()) {
      newErrors.userGoal = "Your goals are required";
    }
    // Validate arrays that must have at least one item
    if (userData.userProfileAvailabilities.length === 0) {
      newErrors.userProfileAvailabilities =
        "Select at least one availability option";
    }

    if (userData.userTopicOfInterests.length === 0) {
      newErrors.userTopicOfInterests = "Select at least one topic of interest";
    }

    if (userData.userAreaExpertises.length === 0) {
      newErrors.userAreaExpertises = "Select at least one area of expertise";
    }
    if (
      userData.userLearningStyles.length === 0 &&
      decodedToken?.role === "Learner"
    ) {
      newErrors.userLearningStyles = "Select at least one learning style";
    }
    if (
      userData.teachingApproaches.length === 0 &&
      decodedToken?.role === "Mentor"
    ) {
      newErrors.teachingApproaches = "Select at least one teaching approach";
    }

    // Update errors state
    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to the first field with an error
      const errorFields = Object.keys(errors);
      if (errorFields.length > 0) {
        const firstErrorField = document.querySelector(
          `#${CSS.escape(errorFields[0])}`
        );
        if (firstErrorField) {
          firstErrorField.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        } else {
          window.scrollTo(0, 0); // Fallback if element not found
        }
      }
      return;
    }

    try {
      setIsSaving(true);

      // Create FormData object to handle file upload
      const formData = new FormData();
      // Append file if it exists
      if (userData.photoData) {
        formData.append("photoData", userData.photoData);
      }

      // Append all other fields
      Object.entries(userData).forEach(([key, value]) => {
        if (key !== "photoData") {
          if (Array.isArray(value)) {
            value.forEach((item) => {
              formData.append(`${key}[]`, item.toString());
            });
          } else if (value !== null && value !== undefined) {
            formData.append(key, value.toString());
          }
        }
      });

      // Send update request
      await userService.updateUserProfile(formData, id!);

      toast.success("Profile updated successfully!");
      navigate(pathName.home);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update your profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }
  const handleToggleSelect = (
    label: string,
    options: { value: string; label: string }[],
    fieldName: string
  ) => {
    const option = options.find((opt) => opt.label === label);
    if (option) {
      const currentValues = [
        ...((userData[fieldName as keyof typeof userData] as number[]) || []),
      ];
      const optionValue = option.value.toString();
      const index = currentValues.findIndex(
        (val) => val.toString() === optionValue
      );

      if (index > -1) {
        currentValues.splice(index, 1);
      } else {
        currentValues.push(parseInt(optionValue));
      }

      handleMultiSelectChange(fieldName, currentValues);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-8">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="mb-8">
            <button
              onClick={() => navigate(pathName.home)}
              className="flex items-center text-gray-300 mb-4 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Back</span>
            </button>
            <h1 className="text-2xl font-bold text-white">Edit Your Profile</h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8 text-white">
            {/* Basic Information Section */}
            <section>
              <h2 className="text-xl font-semibold border-b border-gray-700 pb-2 mb-6">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Picture */}
                <div className="md:col-span-1">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-gray-600">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-400 text-4xl">👤</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <label
                        htmlFor="photoData"
                        className="py-2 px-4 bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm rounded-md cursor-pointer text-center transition-colors"
                      >
                        Choose Photo
                      </label>
                      <input
                        type="file"
                        id="photoData"
                        name="photoData"
                        accept="image/jpeg,image/png"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      {imagePreview && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="py-2 px-4 border border-red-400 text-red-400 text-sm rounded-md hover:bg-red-900 hover:border-red-300 hover:text-red-300 transition-colors"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>

                    {errors.photoData && (
                      <p className="text-sm text-red-400">{errors.photoData}</p>
                    )}
                  </div>
                </div>

                {/* Profile Details */}
                <div className="md:col-span-2 space-y-4">
                  <InputCustom
                    label="Full Name"
                    name="fullName"
                    type="text"
                    value={userData.fullName}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    isRequired
                    errorMessage={errors.fullName}
                    className="bg-gray-700 border-gray-600"
                  />
                  <InputCustom
                    label="Phone Number"
                    name="phoneNumber"
                    type="text"
                    value={userData.phoneNumber || ""}
                    onChange={handleInputChange}
                    placeholder="Your phone number"
                    errorMessage={errors.phoneNumber}
                    className="bg-gray-700 border-gray-600"
                  />

                  <InputCustom
                    label="Bio"
                    name="bio"
                    type="textarea"
                    value={userData.bio || ""}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    className="min-h-[100px] bg-gray-700 border-gray-600"
                    errorMessage={errors.bio}
                  />

                  <InputCustom
                    label="Professional Skills"
                    name="professionalSkill"
                    type="text"
                    value={userData.professionalSkill || ""}
                    onChange={handleInputChange}
                    placeholder="e.g. JavaScript, Python, Project Management"
                    className="bg-gray-700 border-gray-600"
                    errorMessage={errors.professionalSkill}
                  />

                  <InputCustom
                    label="Industry Experience"
                    name="industryExperience"
                    type="text"
                    value={userData.industryExperience || ""}
                    onChange={handleInputChange}
                    placeholder="e.g. 5 years in Software Development"
                    className="bg-gray-700 border-gray-600"
                    errorMessage={errors.industryExperience}
                  />
                </div>
              </div>
            </section>
            {/* <div className="grid grid-cols-2 gap-4 w-full">
              {rolesData.map((roleOpt) => (
                <RoleSelectionCard
                  key={roleOpt.name} // Role enum values are numbers, good for keys
                  role={roleOpt}
                  isSelected={role === roleOpt.name}
                  onClick={() => onRoleChange(roleOpt.name)}
                />
              ))}
            </div> */}
            {/* Areas of Expertise Section */}
            <div>
              <MultiSelectButtons
                label="Areas of Expertise"
                options={areaExpertiseOptions.map((option) => option.label)}
                selectedOptions={userData.userAreaExpertises
                  .map((val) => {
                    const option = areaExpertiseOptions.find(
                      (opt) => opt.value === val.toString()
                    );
                    return option?.label || "";
                  })
                  .filter(Boolean)}
                onToggleSelect={(label) =>
                  handleToggleSelect(
                    label,
                    areaExpertiseOptions,
                    "userAreaExpertises"
                  )
                }
                isRequired
                id="userAreaExpertises"
              />
              {errors.userAreaExpertises && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.userAreaExpertises}
                </p>
              )}
            </div>

            <div className="space-y-6">
              {decodedToken?.role === "Mentor" && (
                <div>
                  <MultiSelectButtons
                    label="Teaching Approaches"
                    options={teachingApproachOptions.map(
                      (option) => option.label
                    )}
                    selectedOptions={userData.teachingApproaches
                      .map((val) => {
                        const option = teachingApproachOptions.find(
                          (opt) => opt.value === val.toString()
                        );
                        return option?.label || "";
                      })
                      .filter(Boolean)}
                    onToggleSelect={(label) =>
                      handleToggleSelect(
                        label,
                        teachingApproachOptions,
                        "teachingApproaches"
                      )
                    }
                    isRequired
                    id="teachingApproaches"
                    gridColsClass="grid-cols-2 sm:grid-cols-4"
                  />
                  {errors.teachingApproaches && (
                    <p className="text-sm text-red-400 mt-1">
                      {errors.teachingApproaches}
                    </p>
                  )}
                </div>
              )}
              {decodedToken?.role === "Learner" && (
                <div>
                  <MultiSelectButtons
                    label="Learning Styles"
                    options={learningStyleOptions.map((option) => option.label)}
                    selectedOptions={userData.userLearningStyles
                      .map((val) => {
                        const option = learningStyleOptions.find(
                          (opt) => opt.value === val.toString()
                        );
                        return option?.label || "";
                      })
                      .filter(Boolean)}
                    onToggleSelect={(label) =>
                      handleToggleSelect(
                        label,
                        learningStyleOptions,
                        "userLearningStyles"
                      )
                    }
                    isRequired
                    id="userLearningStyles"
                    gridColsClass="grid-cols-2 sm:grid-cols-4"
                  />
                  {errors.userLearningStyles && (
                    <p className="text-sm text-red-400 mt-1">
                      {errors.userLearningStyles}
                    </p>
                  )}
                </div>
              )}
              <div>
                <MultiSelectButtons
                  label="Availability"
                  options={availabilityOptions.map((option) => option.label)}
                  selectedOptions={userData.userProfileAvailabilities
                    .map((val) => {
                      const option = availabilityOptions.find(
                        (opt) => opt.value === val.toString()
                      );
                      return option?.label || "";
                    })
                    .filter(Boolean)}
                  onToggleSelect={(label) =>
                    handleToggleSelect(
                      label,
                      availabilityOptions,
                      "userProfileAvailabilities"
                    )
                  }
                  isRequired
                  id="userProfileAvailabilities"
                  gridColsClass="grid-cols-2 sm:grid-cols-4"
                />
                {errors.userProfileAvailabilities && (
                  <p className="text-sm text-red-400 mt-1">
                    {errors.userProfileAvailabilities}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-base font-medium text-gray-300 mb-2">
                  Preferred Communication Method{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                  id="communicationMethod"
                >
                  {communicationMethodOptions.map((option) => (
                    <button
                      type="button"
                      key={option.value}
                      className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border font-medium transition-colors text-sm focus:outline-none focus:ring-2 ${
                        userData.communicationMethod === option.value
                          ? "bg-orange-500 text-white border-orange-500 ring-orange-500"
                          : "bg-gray-700 border-gray-600 hover:bg-gray-650 text-gray-300 hover:text-white ring-gray-600 focus:ring-orange-500"
                      }`}
                      onClick={() =>
                        handleSelectChange("communicationMethod", option.value)
                      }
                    >
                      {/* If option has IconComponent property, uncomment the following line */}
                      {/* {option.IconComponent && <option.IconComponent size={18} />} */}
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
                {errors.communicationMethod && (
                  <p className="text-sm text-red-400 mt-1">
                    {errors.communicationMethod}
                  </p>
                )}
              </div>
              {/* {preferredCommunicationError && <p className="text-sm text-red-500 mt-1">{preferredCommunicationError}</p>} */}
            </div>

            <div className="space-y-6">
              <div>
                <MultiSelectButtons
                  label="Topics of Interest"
                  options={topicOptions.map((option) => option.label)}
                  selectedOptions={userData.userTopicOfInterests
                    .map((val) => {
                      const option = topicOptions.find(
                        (opt) => opt.value === val.toString()
                      );
                      return option?.label || "";
                    })
                    .filter(Boolean)}
                  onToggleSelect={(label) =>
                    handleToggleSelect(
                      label,
                      topicOptions,
                      "userTopicOfInterests"
                    )
                  }
                  isRequired
                  id="availability"
                  gridColsClass="grid-cols-2 sm:grid-cols-4"
                />
                {errors.userTopicOfInterests && (
                  <p className="text-sm text-red-400 mt-1">
                    {errors.userTopicOfInterests}
                  </p>
                )}
              </div>

              <InputCustom
                label="Your Goals"
                name="userGoal"
                type="textarea"
                value={userData.userGoal || ""}
                onChange={handleInputChange}
                placeholder="What are you hoping to achieve?"
                className="min-h-[100px] bg-gray-700 border-gray-600"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Dropdown
                  label="Session Frequency"
                  name="sessionFrequencyId"
                  options={sessionFrequencyOptions}
                  value={userData.sessionFrequencyId.toString()}
                  onChange={(value) =>
                    handleSelectChange("sessionFrequencyId", value)
                  }
                  isRequired
                  className="bg-gray-700 border-gray-600"
                />

                <Dropdown
                  label="Session Duration"
                  name="sessionDurationId"
                  options={sessionDurationOptions}
                  value={userData.sessionDurationId.toString()}
                  onChange={(value) =>
                    handleSelectChange("sessionDurationId", value)
                  }
                  isRequired
                  className="bg-gray-700 border-gray-600"
                />
              </div>
            </div>

            <div className="space-y-5 pt-3">
              <InputCheckbox
                label="Make profile private (only visible to connections)"
                name="privacyProfile"
                checked={userData.privacyProfile}
                onChange={handleCheckboxChange}
              />
              <p className="-mt-4 ml-[calc(1rem+8px)] text-xs text-gray-400">
                Only approved connections can view your full profile details
              </p>

              <InputCheckbox
                label="Allow others to message me"
                name="messagePermission"
                checked={userData.messagePermission}
                onChange={handleCheckboxChange}
              />
              <p className="-mt-4 ml-[calc(1rem+8px)] text-xs text-gray-400">
                Let others initiate contact with you through messages
              </p>

              <InputCheckbox
                label="Enable notifications"
                name="notificationsEnabled"
                checked={userData.notificationsEnabled}
                onChange={handleCheckboxChange}
              />
              <p className="-mt-4 ml-[calc(1rem+8px)] text-xs text-gray-400">
                Get email and in-app notifications for messages, session
                requests, and updates
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-700">
              <button
                type="button"
                onClick={() => navigate(pathName.home)}
                className="w-full sm:w-auto flex-1 py-3 px-5 border border-gray-600 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 font-semibold transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto flex-1 py-3 px-5 bg-orange-500 hover:bg-orange-600 rounded-lg text-white font-semibold transition-colors disabled:opacity-70"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2 inline-block" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2 inline-block" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUserPage;
