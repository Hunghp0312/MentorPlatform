import { useState, useEffect, useRef } from "react";
import { CirclePlus, CircleMinus, Eye, Pencil } from "lucide-react";
import ExpandProfileSettings from "../../components/feature/ExpandProfileSettings";
import { mentorService } from "../../services/mentorapplication.service";
import { userService } from "../../services/user.service";
import DefaultImage from "../../assets/Profile_avatar_placeholder_large.png";
import {
  MentorCertification,
  MentorEducation,
  MentorWorkExperience,
  MentorCreateApplication,
  SupportingDocument,
  DocumentContent,
} from "../../types/mentorapplication";
import { User, UserApplication } from "../../types/user";
import CustomModal from "../../components/ui/Modal";
import EducationAddDialog from "../../components/dialog/Applications/EducationDialog";
import WorkExperienceAddDialog from "../../components/dialog/Applications/WorkExperienceDialog";
import CertificationAddDialog from "../../components/dialog/Applications/CertificationDialog";
import { EnumType } from "../../types/commonType";
import { toast } from "react-toastify";

interface MentorStatusType {
  mentorEducation: MentorEducation[];
  mentorWorkExperience: MentorWorkExperience[];
  certifications: MentorCertification[];
  mentorDocuments: SupportingDocument[];
  submissionDate?: string;
  approvalDate?: string;
  rejectedDate?: string;
  adminComment?: string;
  status?: string;
  userApplicationDetails?: User;
}

const MentorStatusProfile = () => {
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [mentorData, setMentorData] = useState<MentorStatusType>({
    mentorEducation: [],
    mentorWorkExperience: [],
    certifications: [],
    mentorDocuments: [],
    submissionDate: "",
    status: "",
  });
  const [saveState, setSaveState] = useState<MentorStatusType>({
    mentorEducation: [],
    mentorWorkExperience: [],
    certifications: [],
    mentorDocuments: [],
    submissionDate: "",
    status: "",
  });
  const [editedMentor, setEditedMentor] = useState<MentorStatusType>({
    mentorEducation: [],
    mentorWorkExperience: [],
    certifications: [],
    mentorDocuments: [],
    submissionDate: "",
    status: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [newEducation, setNewEducation] = useState<Partial<MentorEducation>>(
    {}
  );
  const [newWorkExperience, setNewWorkExperience] = useState<
    Partial<MentorWorkExperience>
  >({});
  const [newCertification, setNewCertification] = useState<
    Partial<MentorCertification>
  >({});
  const [openEducationDialog, setOpenEducationDialog] = useState(false);
  const [openWorkExperienceDialog, setOpenWorkExperienceDialog] =
    useState(false);
  const [openCertificationDialog, setOpenCertificationDialog] = useState(false);
  const [role, setRole] = useState<EnumType | undefined>(undefined);
  const [openDocumentViewer, setOpenDocumentViewer] = useState(false);
  const [documentData, setDocumentData] = useState<{
    fileContent: string;
    fileType: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editEducationIndex, setEditEducationIndex] = useState<number | null>(
    null
  );
  const [editWorkExperienceIndex, setEditWorkExperienceIndex] = useState<
    number | null
  >(null);
  const [editCertificationIndex, setEditCertificationIndex] = useState<
    number | null
  >(null);

  useEffect(() => {
    const fetchUserData = async (): Promise<UserApplication | null> => {
      try {
        const response = await userService.getCurrentUser();
        console.log("User Data:", response);
        const mappedUserData: UserApplication = {
          id: response.id,
          email: response.email,
          role: response.role,
          hasMentorApplication: response.hasMentorApplication,
          profile: {
            id: response.id,
            photoData: response.avatar || DefaultImage,
            fullName: response.fullName,
            professionalSkill: response.professionalSkills,
            industryExperience: response.industryExperience,
            userGoal: response.userGoal,
          },
          userAreaOfExpertises:
            response.areaOfExpertise?.map(
              (expertise: { id: number; name: string }) => ({
                userId: response.id,
                arenaOfExpertise: { name: expertise.name },
              })
            ) || [],
        };
        setRole(mappedUserData.role);
        console.log("Mapped User Data:", mappedUserData.role);
        return mappedUserData;
      } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
      }
    };

    const loadMyApplication = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await mentorService.getMyApplication();
        console.log("My Application Data:", response);

        const mappedDocuments: SupportingDocument[] =
          response.documentsDetails?.map((doc: DocumentContent) => ({
            id: doc.id,
            fileName: doc.fileName,
            fileType: doc.fileType,
            fileSize: doc.fileSize || 0,
            uploadedAt: doc.uploadedAt || new Date().toISOString(),
            documentContent: {
              fileName: doc.fileName,
              fileType: doc.fileType,
              fileContent: doc.fileContent,
            },
          })) || [];

        const mappedData: Partial<MentorStatusType> = {
          mentorEducation: response.educationDetails || [],
          mentorWorkExperience: response.workExperienceDetails || [],
          certifications: response.certifications || [],
          mentorDocuments: mappedDocuments,
          status: response.status,
        };

        setMentorData((prev) => ({
          ...prev,
          ...mappedData,
        }));
        setEditedMentor((prev) => ({
          ...prev,
          ...mappedData,
        }));

        setSaveState({
          mentorEducation: [...(mappedData.mentorEducation || [])],
          mentorWorkExperience: [...(mappedData.mentorWorkExperience || [])],
          certifications: [...(mappedData.certifications || [])],
          mentorDocuments: [...(mappedData.mentorDocuments || [])],
          submissionDate: mappedData.submissionDate || "",
          status: mappedData.status || "",
        });
      } catch {
        const emptyState = {
          mentorEducation: [],
          mentorWorkExperience: [],
          certifications: [],
          mentorDocuments: [],
          submissionDate: "",
          status: "",
        };

        setSaveState(emptyState);
        setMentorData((prev) => ({ ...prev, ...emptyState }));
        setEditedMentor((prev) => ({ ...prev, ...emptyState }));
        toast.error("Failed to load application data");
      } finally {
        setLoading(false);
      }
    };

    const fetchData = async () => {
      const userData = await fetchUserData();
      if (userData) {
        setMentorData((prev) => ({
          ...prev,
          userApplicationDetails: userData,
        }));
        console.log("User Data:", userData.hasMentorApplication);
        if (userData.hasMentorApplication) {
          await loadMyApplication();
        } else {
          const emptyState = {
            mentorEducation: [],
            mentorWorkExperience: [],
            certifications: [],
            mentorDocuments: [],
            submissionDate: "",
            status: "",
          };
          setSaveState(emptyState);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const allowedFileTypes = ["application/pdf", "image/jpeg", "image/png"];
      const maxFileSize = 5 * 1024 * 1024;

      if (!allowedFileTypes.includes(file.type)) {
        toast.error("Only support PDF, JPEG, or PNG.");
        return;
      }

      if (file.size > maxFileSize) {
        toast.error("Error: File size must not exceed 5MB.");
        return;
      }

      const newDocument: SupportingDocument = {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
        documentContent: {
          fileName: file.name,
          fileType: file.type,
          fileContent: "",
        },
      };

      setSelectedFiles((prev) => [...prev, file]);
      setEditedMentor((prev) => ({
        ...prev,
        mentorDocuments: [...prev.mentorDocuments, newDocument],
      }));
      setMentorData((prev) => ({
        ...prev,
        mentorDocuments: [...prev.mentorDocuments, newDocument],
      }));
    }
  };

  const handleOpenFileExplorer = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveDocument = async (index: number) => {
    const document = mentorData.mentorDocuments[index];
    const updatedDocuments = mentorData.mentorDocuments.filter(
      (_, i) => i !== index
    );

    if (mentorData.status === "Request Info" && document.id) {
      try {
        await mentorService.deleteFile(document.id);
        setEditedMentor((prev) => ({
          ...prev,
          mentorDocuments: updatedDocuments,
        }));
        setMentorData((prev) => ({
          ...prev,
          mentorDocuments: updatedDocuments,
        }));
        setSaveState((prev) => ({
          ...prev,
          mentorDocuments: updatedDocuments,
        }));
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
      } catch (error) {
        console.error("Error deleting file:", error);
        toast.error("Error: Failed to delete file.");
      }
    } else {
      setEditedMentor((prev) => ({
        ...prev,
        mentorDocuments: updatedDocuments,
      }));
      setMentorData((prev) => ({
        ...prev,
        mentorDocuments: updatedDocuments,
      }));
      setSaveState((prev) => ({
        ...prev,
        mentorDocuments: updatedDocuments,
      }));
      setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    }

    if (mentorData.mentorDocuments.length <= 1) {
      setSelectedFiles([]);
    }
  };

  const handleAddNewEducation = async (newEducation: MentorEducation) => {
    if (
      newEducation.institutionName &&
      newEducation.fieldOfStudy &&
      newEducation.graduationYear
    ) {
      setEditedMentor((prev) => {
        const updatedEducation = [...(prev.mentorEducation || [])];
        if (editEducationIndex !== null) {
          updatedEducation[editEducationIndex] = newEducation;
        } else {
          updatedEducation.push(newEducation);
        }
        return { ...prev, mentorEducation: updatedEducation };
      });
      setMentorData((prev) => {
        const updatedEducation = [...(prev.mentorEducation || [])];
        if (editEducationIndex !== null) {
          updatedEducation[editEducationIndex] = newEducation;
        } else {
          updatedEducation.push(newEducation);
        }
        return { ...prev, mentorEducation: updatedEducation };
      });
      setNewEducation({});
      setEditEducationIndex(null);
      setOpenEducationDialog(false);
    }
  };
  const handleAddWorkExperience = async (
    newWorkExperience: MentorWorkExperience
  ) => {
    if (
      newWorkExperience.companyName &&
      newWorkExperience.position &&
      newWorkExperience.startDate
    ) {
      setEditedMentor((prev) => {
        const updatedWorkExperience = [...(prev.mentorWorkExperience || [])];
        if (editWorkExperienceIndex !== null) {
          updatedWorkExperience[editWorkExperienceIndex] = newWorkExperience;
        } else {
          updatedWorkExperience.push(newWorkExperience);
        }
        return { ...prev, mentorWorkExperience: updatedWorkExperience };
      });
      setMentorData((prev) => {
        const updatedWorkExperience = [...(prev.mentorWorkExperience || [])];
        if (editWorkExperienceIndex !== null) {
          updatedWorkExperience[editWorkExperienceIndex] = newWorkExperience;
        } else {
          updatedWorkExperience.push(newWorkExperience);
        }
        return { ...prev, mentorWorkExperience: updatedWorkExperience };
      });
      setNewWorkExperience({});
      setEditWorkExperienceIndex(null);
      setOpenWorkExperienceDialog(false);
    }
  };
  const handleAddCertification = async (
    newCertification: MentorCertification
  ) => {
    if (
      newCertification.certificationName &&
      newCertification.issuingOrganization
    ) {
      setEditedMentor((prev) => {
        const updatedCertifications = [...(prev.certifications || [])];
        if (editCertificationIndex !== null) {
          updatedCertifications[editCertificationIndex] = newCertification;
        } else {
          updatedCertifications.push(newCertification);
        }
        return { ...prev, certifications: updatedCertifications };
      });
      setMentorData((prev) => {
        const updatedCertifications = [...(prev.certifications || [])];
        if (editCertificationIndex !== null) {
          updatedCertifications[editCertificationIndex] = newCertification;
        } else {
          updatedCertifications.push(newCertification);
        }
        return { ...prev, certifications: updatedCertifications };
      });
      setNewCertification({});
      setEditCertificationIndex(null);
      setOpenCertificationDialog(false);
    }
  };

  const handleOnEducationClose = () => {
    setOpenEducationDialog(false);
    setNewEducation({});
    setEditEducationIndex(null);
  };

  const handleOnWorkExperienceClose = () => {
    setOpenWorkExperienceDialog(false);
    setNewWorkExperience({});
    setEditWorkExperienceIndex(null);
  };

  const handleOnCertificationClose = () => {
    setOpenCertificationDialog(false);
    setNewCertification({});
    setEditCertificationIndex(null);
  };

  const handleViewDocument = (fileContent: string, fileType: string) => {
    console.log("handleViewDocument called", {
      fileType,
      fileContentLength: fileContent?.length,
    });
    if (!fileContent) {
      console.error("File content is missing or empty");
      toast.error("Error: File content is missing or empty.");
      return;
    }
    if (!fileType) {
      console.error("File type is missing");
      toast.error("Error: File type is missing.");
      return;
    }
    try {
      const isValidBase64 = /^[A-Za-z0-9+/=]+$/.test(fileContent);
      if (!isValidBase64) {
        console.error("Invalid Base64 string detected");
        toast.error("Error: Invalid Base64 string detected.");
        return;
      }
      setDocumentData({ fileContent, fileType });
      setOpenDocumentViewer(true);
    } catch (error) {
      console.error("Error in handleViewDocument:", error);
      toast.error("Error in handle view document.");
    }
  };

  const handleCloseDocumentViewer = () => {
    setOpenDocumentViewer(false);
    setDocumentData(null);
  };

  const handleRemoveEducation = (index: number) => {
    setEditedMentor((prev) => ({
      ...prev,
      mentorEducation: prev.mentorEducation.filter((_, i) => i !== index),
    }));
    setMentorData((prev) => ({
      ...prev,
      mentorEducation: prev.mentorEducation.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveWorkExperience = (index: number) => {
    setEditedMentor((prev) => ({
      ...prev,
      mentorWorkExperience: prev.mentorWorkExperience.filter(
        (_, i) => i !== index
      ),
    }));
    setMentorData((prev) => ({
      ...prev,
      mentorWorkExperience: prev.mentorWorkExperience.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleRemoveCertification = (index: number) => {
    setEditedMentor((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
    setMentorData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  const handleSubmitApplication = async () => {
    if (
      !editedMentor ||
      editedMentor.mentorDocuments.length === 0 ||
      editedMentor.mentorEducation.length === 0 ||
      editedMentor.mentorWorkExperience.length === 0 ||
      editedMentor.certifications.length === 0
    ) {
      toast.error("Error: Application data is missing.");
      return;
    }

    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn gửi đơn đăng ký không?"
    );
    if (!confirmed) {
      return;
    }

    const application: MentorCreateApplication = {
      mentorEducations: editedMentor.mentorEducation,
      mentorWorkExperiences: editedMentor.mentorWorkExperience,
      mentorCertifications: editedMentor.certifications,
    };

    try {
      if (mentorData.status === "") {
        await mentorService.submitCompleteApplication(application);

        for (const file of selectedFiles) {
          await mentorService.uploadFile(file);
        }
        toast.success("Upload application successfully.");
      } else if (mentorData.status === "Request Info") {
        await mentorService.updateMyApplication(application);

        const newFiles = selectedFiles.filter(
          (_, index) => !mentorData.mentorDocuments[index]?.id
        );
        for (const file of newFiles) {
          await mentorService.uploadFile(file);
        }
        toast.success("Update application successfully.");
      }

      setIsEditing(false);
      setSelectedFiles([]);

      const response = await mentorService.getMyApplication();
      const mappedDocuments: SupportingDocument[] =
        response.documentsDetails?.map((doc: DocumentContent) => ({
          id: doc.id,
          fileName: doc.fileName,
          fileType: doc.fileType,
          fileSize: doc.fileSize || 0,
          uploadedAt: doc.uploadedAt || new Date().toISOString(),
          documentContent: {
            fileName: doc.fileName,
            fileType: doc.fileType,
            fileContent: doc.fileContent,
          },
        })) || [];

      const mappedData: MentorStatusType = {
        mentorEducation: response.educationDetails || [],
        mentorWorkExperience: response.workExperienceDetails || [],
        certifications: response.certifications || [],
        mentorDocuments: mappedDocuments,
        status: response.status,
        userApplicationDetails: mentorData.userApplicationDetails,
      };

      setMentorData(mappedData);
      setEditedMentor({ ...mappedData });
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Error submitting application");
      throw error;
    }
  };

  const handleSave = () => {
    if (editedMentor) {
      const updatedData = {
        ...mentorData,
        mentorEducation: [...(editedMentor.mentorEducation || [])],
        mentorWorkExperience: [...(editedMentor.mentorWorkExperience || [])],
        certifications: [...(editedMentor.certifications || [])],
        mentorDocuments: [...(editedMentor.mentorDocuments || [])],
      };

      setMentorData(updatedData);

      setSaveState({
        mentorEducation: [...(editedMentor.mentorEducation || [])],
        mentorWorkExperience: [...(editedMentor.mentorWorkExperience || [])],
        certifications: [...(editedMentor.certifications || [])],
        mentorDocuments: [...(editedMentor.mentorDocuments || [])],
      });

      setIsEditing(false);
      setError(null);
    }
  };

  const handleCancel = () => {
    const restoredData = {
      ...mentorData,
      mentorEducation: [...(saveState.mentorEducation || [])],
      mentorWorkExperience: [...(saveState.mentorWorkExperience || [])],
      certifications: [...(saveState.certifications || [])],
      mentorDocuments: [...(saveState.mentorDocuments || [])],
    };

    setMentorData(restoredData);

    setEditedMentor({
      ...saveState,
      mentorEducation: [...(saveState.mentorEducation || [])],
      mentorWorkExperience: [...(saveState.mentorWorkExperience || [])],
      certifications: [...(saveState.certifications || [])],
      mentorDocuments: [...(saveState.mentorDocuments || [])],
    });

    setIsEditing(false);
    setError(null);
    setNewEducation({});
    setNewWorkExperience({});
    setNewCertification({});
    setSelectedFiles([]);
  };

  const additionalSettingsContent = (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
          Education(s)
          {isEditing && (
            <button
              id="open-education-dialog-icon"
              onClick={() => setOpenEducationDialog(true)}
              className="ml-1"
            >
              <CirclePlus
                size={20}
                className="text-green-500 hover:text-green-600"
              />
            </button>
          )}
        </h3>
        <div className="bg-gray-700 p-4 rounded-lg">
          {mentorData?.mentorEducation?.length > 0 ? (
            mentorData.mentorEducation.map((education, index) => (
              <div
                key={index}
                className="flex justify-between py-2 border-b-1 border-gray-500 last:border-b-0 items-center"
              >
                <div className="flex w-full justify-between items-start">
                  <div className="flex flex-col max-w-[75%]">
                    <h5 className="font-medium break-words overflow-wrap-anywhere">
                      {education.fieldOfStudy}
                    </h5>
                    <p className="text-[12px] text-gray-400">
                      {education.institutionName}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 min-w-[100px] justify-end">
                    <span className="text-sm text-gray-400">
                      {education.graduationYear ?? "N/A"}
                    </span>
                    {isEditing && (
                      <>
                        <button
                          id={`edit-education-icon-${index}`}
                          onClick={() => {
                            setEditEducationIndex(index);
                            setNewEducation(education);
                            setOpenEducationDialog(true);
                          }}
                        >
                          <Pencil
                            size={20}
                            className="text-blue-500 hover:text-blue-600"
                          />
                        </button>
                        <button
                          id={`remove-education-icon-${index}`}
                          onClick={() => handleRemoveEducation(index)}
                        >
                          <CircleMinus
                            size={20}
                            className="text-red-500 hover:text-red-600"
                          />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-200">No education provided.</p>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
          Work Experience(s)
          {isEditing && (
            <button
              id="open-work-experience-dialog-icon"
              onClick={() => setOpenWorkExperienceDialog(true)}
              className="ml-1"
            >
              <CirclePlus
                size={20}
                className="text-green-500 hover:text-green-600"
              />
            </button>
          )}
        </h3>
        <div className="bg-gray-700 p-4 rounded-lg">
          {mentorData?.mentorWorkExperience?.length > 0 ? (
            mentorData.mentorWorkExperience.map((experience, index) => (
              <div
                key={index}
                className="flex justify-between py-2 border-b-1 border-gray-500 last:border-b-0 items-center"
              >
                <div className="flex w-full justify-between items-start">
                  <div className="flex flex-col max-w-[75%]">
                    <h5 className="font-medium break-words overflow-wrap-anywhere">
                      {experience.position}
                    </h5>
                    <p className="text-[12px] text-gray-400">
                      {experience.companyName}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">
                      {new Date(experience.startDate).toISOString().slice(5, 7)}
                      /{new Date(experience.startDate).getFullYear()} –{" "}
                      {experience.endDate
                        ? `${new Date(experience.endDate)
                            .toISOString()
                            .slice(5, 7)}/${new Date(
                            experience.endDate
                          ).getFullYear()}`
                        : "Present"}
                    </span>
                    {isEditing && (
                      <>
                        <button
                          id={`edit-workexperience-icon-${index}`}
                          onClick={() => {
                            setEditWorkExperienceIndex(index);
                            setNewWorkExperience({
                              ...experience,
                              startDate: `${new Date(experience.startDate)
                                .toISOString()
                                .slice(5, 7)}/${new Date(
                                experience.startDate
                              ).getFullYear()}`,
                              endDate: experience.endDate
                                ? `${new Date(experience.endDate)
                                    .toISOString()
                                    .slice(5, 7)}/${new Date(
                                    experience.endDate
                                  ).getFullYear()}`
                                : "",
                            });
                            setOpenWorkExperienceDialog(true);
                          }}
                        >
                          <Pencil
                            size={20}
                            className="text-blue-500 hover:text-blue-600"
                          />
                        </button>
                        <button
                          id={`remove-workexperience-icon-${index}`}
                          onClick={() => handleRemoveWorkExperience(index)}
                        >
                          <CircleMinus
                            size={20}
                            className="text-red-500 hover:text-red-600"
                          />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-200">
              No work experience provided.
            </p>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
          Certification(s)
          {isEditing && (
            <button
              id="open-certification-dialog-icon"
              onClick={() => setOpenCertificationDialog(true)}
              className="ml-1"
            >
              <CirclePlus
                size={20}
                className="text-green-500 hover:text-green-600"
              />
            </button>
          )}
        </h3>
        <div className="bg-gray-700 p-4 rounded-lg">
          {mentorData?.certifications?.length > 0 ? (
            mentorData.certifications.map((certificate, index) => (
              <div
                key={index}
                className="flex justify-between py-2 border-b-1 border-gray-500 last:border-b-0 items-center"
              >
                <div className="flex w-full justify-between items-start">
                  <div className="flex flex-col max-w-[75%]">
                    <h5 className="font-medium break-words overflow-wrap-anywhere">
                      {certificate.certificationName}
                    </h5>
                    <p className="text-[12px] text-gray-400">
                      {certificate.issuingOrganization}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isEditing && (
                      <>
                        <button
                          id={`edit-certification-icon-${index}`}
                          onClick={() => {
                            setEditCertificationIndex(index);
                            setNewCertification(certificate);
                            setOpenCertificationDialog(true);
                          }}
                        >
                          <Pencil
                            size={20}
                            className="text-blue-500 hover:text-blue-600"
                          />
                        </button>
                        <button
                          id={`remove-certification-icon-${index}`}
                          onClick={() => handleRemoveCertification(index)}
                        >
                          <CircleMinus
                            size={20}
                            className="text-red-500 hover:text-red-600"
                          />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-200">No certifications provided.</p>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
          Documents
          {isEditing && mentorData.mentorDocuments.length < 5 && (
            <button
              id="open-file-explorer-icon"
              onClick={() => handleOpenFileExplorer()}
              className="ml-1"
            >
              <CirclePlus
                size={20}
                className="text-green-500 hover:text-green-600"
              />
            </button>
          )}
          <input
            id="document-file-input"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,image/jpeg,image/png"
            style={{ display: "none" }}
          />
        </h3>
        <div className="bg-gray-700 p-4 rounded-lg">
          {mentorData.mentorDocuments.length > 0 ? (
            mentorData.mentorDocuments.map((document, index) => (
              <div
                key={index}
                className="flex justify-between py-2 border-b-1 border-gray-500 last:border-b-0"
              >
                <div className="flex flex-col">
                  <h5 className="font-medium">{document.fileName}</h5>
                  <p className="text-[12px] text-gray-400">
                    {document.fileType.split("/")[1] || document.fileType}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {mentorData.status !== "" && document.id && (
                    <button
                      id={`view-document-icon-${index}`}
                      onClick={() =>
                        handleViewDocument(
                          document.documentContent?.fileContent || "",
                          document.fileType
                        )
                      }
                    >
                      <Eye
                        size={20}
                        className="text-blue-500 hover:text-blue-600"
                      />
                    </button>
                  )}
                  {isEditing && (
                    <button
                      id={`remove-document-icon-${index}`}
                      onClick={() => handleRemoveDocument(index)}
                    >
                      <CircleMinus
                        size={20}
                        className="text-red-500 hover:text-red-600"
                      />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-200">No documents provided.</p>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) return <div>Loading...</div>;
  if (!mentorData) return <div>No data available</div>;

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-200">
              Your Application
            </h1>
            <button
              id="edit-application-button"
              onClick={() => setIsEditing(true)}
              className={`px-4 py-2 rounded-md transition-colors ${
                mentorData.status === "" || mentorData.status === "Request Info"
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
              disabled={
                mentorData.status !== "" && mentorData.status !== "Request Info"
              }
            >
              Edit Application
            </button>
          </div>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                <img
                  src={
                    mentorData.userApplicationDetails?.profile?.photoData ||
                    DefaultImage
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-medium text-gray-200">
                  {mentorData.userApplicationDetails?.profile?.fullName ||
                    "N/A"}
                </h2>
                <div className="mt-1 flex items-center">
                  <span className="bg-orange-500 text-xs text-white px-2.5 py-1 rounded-full capitalize">
                    {role?.name}
                  </span>
                  <span className="pr-1"></span>
                  <span
                    className={`text-xs text-white px-2.5 py-1 rounded-full capitalize ${
                      mentorData.status === "Approved"
                        ? "bg-green-500"
                        : mentorData.status === "Rejected"
                        ? "bg-red-500"
                        : mentorData.status === "Submitted"
                        ? "bg-yellow-500"
                        : mentorData.status === "Request Info"
                        ? "bg-blue-500"
                        : mentorData.status === "Under Review"
                        ? "bg-purple-500"
                        : ""
                    }`}
                  >
                    {mentorData.status}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">
                Areas of expertise
              </h3>
              <p className="text-sm text-gray-200">
                {mentorData.userApplicationDetails?.userAreaOfExpertises?.map(
                  (expertise, index) => (
                    <span
                      key={index}
                      className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm mr-2"
                    >
                      {expertise.arenaOfExpertise?.name}
                    </span>
                  )
                )}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">
                Professional skills
              </h3>
              <p className="text-sm text-gray-200">
                {mentorData.userApplicationDetails?.profile
                  ?.professionalSkill || "No skills provided"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">
                Industry experience
              </h3>
              <p className="text-sm text-gray-200">
                {mentorData.userApplicationDetails?.profile
                  ?.industryExperience || "No experience provided"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">
                Motivation
              </h3>
              <p className="text-sm text-gray-200">
                {mentorData.userApplicationDetails?.profile?.userGoal ||
                  "No Motivation provided"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Email</h3>
              <p className="text-sm text-gray-200">
                {mentorData.userApplicationDetails?.email ||
                  "No email provided"}
              </p>
            </div>
            <ExpandProfileSettings
              title="Additional Profile"
              additionalSettings={additionalSettingsContent}
              isExpanded={isExpanded}
              onToggle={() => setIsExpanded((prev) => !prev)}
            />
            <CustomModal
              isOpen={openEducationDialog}
              onClose={handleOnEducationClose}
              title={
                editEducationIndex !== null ? "Edit Education" : "Add Education"
              }
              size="md"
            >
              <EducationAddDialog
                onClose={handleOnEducationClose}
                onSubmit={handleAddNewEducation}
                initialData={
                  editEducationIndex !== null
                    ? (newEducation as MentorEducation)
                    : undefined
                }
                actionButtonText={
                  editEducationIndex !== null
                    ? "Update Education"
                    : "Add Education"
                }
                isSubmitting={false}
              />
            </CustomModal>
            <CustomModal
              isOpen={openCertificationDialog}
              onClose={handleOnCertificationClose}
              title={
                editCertificationIndex !== null
                  ? "Edit Certification"
                  : "Add Certification"
              }
              size="md"
            >
              <CertificationAddDialog
                onClose={handleOnCertificationClose}
                onSubmit={handleAddCertification}
                initialData={
                  editCertificationIndex !== null
                    ? (newCertification as MentorCertification)
                    : undefined
                }
                actionButtonText={
                  editCertificationIndex !== null
                    ? "Update Certification"
                    : "Add Certification"
                }
                isSubmitting={false}
              />
            </CustomModal>
            <CustomModal
              isOpen={openWorkExperienceDialog}
              onClose={handleOnWorkExperienceClose}
              title={
                editWorkExperienceIndex !== null
                  ? "Edit Work Experience"
                  : "Add Work Experience"
              }
              size="md"
            >
              <WorkExperienceAddDialog
                onClose={handleOnWorkExperienceClose}
                onSubmit={handleAddWorkExperience}
                initialData={
                  editWorkExperienceIndex !== null
                    ? (newWorkExperience as MentorWorkExperience)
                    : undefined
                }
                actionButtonText={
                  editWorkExperienceIndex !== null
                    ? "Update Work Experience"
                    : "Add Work Experience"
                }
                isSubmitting={false}
              />
            </CustomModal>
            <CustomModal
              isOpen={openDocumentViewer}
              onClose={handleCloseDocumentViewer}
              title="View Document"
              size="xl"
            >
              {documentData && (
                <div className="w-full h-[70vh]">
                  <embed
                    src={`data:${documentData.fileType};base64,${documentData.fileContent}`}
                    type={documentData.fileType}
                    width="100%"
                    height="100%"
                  />
                </div>
              )}
            </CustomModal>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            {isEditing ? (
              <>
                <button
                  id="save-button"
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
                >
                  Save
                </button>
                <button
                  id="cancel-button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                id="submit-application-button"
                onClick={() => handleSubmitApplication()}
                className={`px-4 py-2 rounded-md transition-colors ${
                  mentorData.status === "" ||
                  mentorData.status === "Request Info"
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
                disabled={
                  mentorData.status !== "" &&
                  mentorData.status !== "Request Info"
                }
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MentorStatusProfile;
