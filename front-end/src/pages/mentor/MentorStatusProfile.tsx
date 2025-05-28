import { useState, useEffect, useRef } from "react";
import { CirclePlus, CircleMinus, Eye } from "lucide-react";
import ExpandProfileSettings from "../../components/feature/ExpandProfileSettings";
import { mentorService } from "../../services/mentorapplication.service";
import { userService } from "../../services/user.service";
import {
  MentorCertification,
  MentorEducation,
  MentorWorkExperience,
  MentorCreateApplication,
  SupportingDocument,
} from "../../types/mentorapplication";
import { User, UserApplication } from "../../types/user";
import CustomModal from "../../components/ui/Modal";
import EducationAddDialog from "../../components/dialog/Applications/EducationDialog";
import WorkExperienceAddDialog from "../../components/dialog/Applications/WorkExperienceDialog";
import CertificationAddDialog from "../../components/dialog/Applications/CertificationDialog";
import { EnumType } from "../../types/commonType";

interface MentorStatusType {
  mentorEducation: MentorEducation[];
  mentorWorkExperience: MentorWorkExperience[];
  certifications: MentorCertification[];
  mentorDocuments: SupportingDocument | null;
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
    mentorDocuments: null,
    submissionDate: "",
    status: "",
  });
  const [editedMentor, setEditedMentor] = useState<MentorStatusType>({
    mentorEducation: [],
    mentorWorkExperience: [],
    certifications: [],
    mentorDocuments: null,
    submissionDate: "",
    status: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
  // useEffect(() => {
  //   setLoading(true);
  //   const initialMentor: MentorStatusType = {
  //     id: mockUser1.id ?? "", // Fallback to empty string if id is undefined
  //     name: mockUser1.userProfile?.fullName ?? "Unknown Name", // Fallback for name
  //     email: mockUser1.email ?? "", // Fallback for email
  //     expertiseAreas:
  //       mockUser1.userAreaOfExpertises
  //         ?.map((expertise) => expertise.AreaOfExpertise?.name ?? "")
  //         .filter((name) => name !== "") ?? [], // Filter out empty strings, fallback to empty array
  //     status:
  //       mockUser1.mentorApplications?.applicationStatus?.name ?? "unknown", // Fallback for status
  //     profileImage: mockUser1.userProfile?.photoData ?? "", // Fallback for profileImage
  //     professionalSkill: mockUser1.userProfile?.professionalSkill ?? "", // Fallback for professionalSkill
  //     industryExperience: mockUser1.userProfile?.industryExperience ?? "", // Fallback for industryExperience
  //     mentorEducation: mockUser1.mentorApplications?.mentorEducations ?? [], // Fallback for mentorEducation
  //     mentorWorkExperience:
  //       mockUser1.mentorApplications?.mentorWorkExperiences ?? [], // Fallback for mentorWorkExperience
  //     certifications: mockUser1.mentorApplications?.mentorCertifications ?? [], // Fallback for certifications
  //   };
  //   setMentorData(initialMentor);
  //   setEditedMentor({ ...initialMentor });
  //   setLoading(false);
  // }, []);
  // Khởi tạo dữ liệu ban đầu (có thể để rỗng vì không dùng mockUser1)
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
            photoData: response.avatar || undefined,
            fullName: response.fullName,
            professionalSkill: response.professionalSkills,
            industryExperience: response.industryExperience,
          },
          userArenaOfExpertises:
            response.areaOfExpertise?.map((expertise: string) => ({
              userId: response.id,
              arenaOfExpertise: { name: expertise },
            })) || [],
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

        let mappedDocument = null;
        if (response.documentsDetails?.[0]) {
          const doc = response.documentsDetails[0];
          mappedDocument = {
            fileName: doc.fileName,
            fileType: doc.fileType,
            fileSize: doc.fileSize || 0,
            uploadedAt: doc.uploadedAt || new Date().toISOString(),
            documentContent: {
              fileName: doc.fileName,
              fileType: doc.fileType,
              fileContent: doc.fileContent,
            },
          };
        }

        const mappedData: Partial<MentorStatusType> = {
          mentorEducation: response.educationDetails || [],
          mentorWorkExperience: response.workExperienceDetails || [],
          certifications: response.certifications || [],
          mentorDocuments: mappedDocument,
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
      } catch {
        setError("Failed to load application data");
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
      setSelectedFile(file);
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
      setEditedMentor((prev) => ({
        ...prev,
        mentorDocuments: newDocument,
      }));
      setMentorData((prev) => ({
        ...prev,
        mentorDocuments: newDocument,
      }));
    }
  };

  const handleOpenFileExplorer = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveDocument = () => {
    setEditedMentor((prev) => ({
      ...prev,
      mentorDocuments: null,
    }));
    setMentorData((prev) => ({
      ...prev,
      mentorDocuments: null,
    }));
    setSelectedFile(null);
  };

  const handleAddNewEducation = async (newEducation: MentorEducation) => {
    if (
      newEducation.institutionName &&
      newEducation.fieldOfStudy &&
      newEducation.graduationYear
    ) {
      setEditedMentor((prev) => ({
        ...prev,
        mentorEducation: [...(prev.mentorEducation || []), newEducation],
      }));
      setMentorData((prev) => ({
        ...prev,
        mentorEducation: [...(prev.mentorEducation || []), newEducation],
      }));
      setNewEducation({});
      setOpenEducationDialog(false);
    }
  };

  const handleOnEducationClose = () => {
    setOpenEducationDialog(false);
    setNewEducation({});
  };

  const handleOnWorkExperienceClose = () => {
    setOpenWorkExperienceDialog(false);
    setNewWorkExperience({});
  };

  const handleOnCertificationClose = () => {
    setOpenCertificationDialog(false);
    setNewCertification({});
  };

  const handleViewDocument = (fileContent: string, fileType: string) => {
    console.log("handleViewDocument called", {
      fileType,
      fileContentLength: fileContent?.length,
    });
    if (!fileContent) {
      console.error("File content is missing or empty");
      setError("Không thể mở tài liệu: Không có nội dung tài liệu.");
      return;
    }
    if (!fileType) {
      console.error("File type is missing");
      setError("Không thể mở tài liệu: Thiếu loại tệp.");
      return;
    }
    try {
      const isValidBase64 = /^[A-Za-z0-9+/=]+$/.test(fileContent);
      if (!isValidBase64) {
        console.error("Invalid Base64 string detected");
        setError("Không thể mở tài liệu: Dữ liệu Base64 không hợp lệ.");
        return;
      }
      setDocumentData({ fileContent, fileType });
      setOpenDocumentViewer(true);
    } catch (error) {
      console.error("Error in handleViewDocument:", error);
      setError("Lỗi khi mở tài liệu: Vui lòng thử lại.");
    }
  };

  const handleCloseDocumentViewer = () => {
    setOpenDocumentViewer(false);
    setDocumentData(null);
  };

  const handleAddWorkExperience = async (
    newWorkExperience: MentorWorkExperience
  ) => {
    if (
      newWorkExperience.companyName &&
      newWorkExperience.position &&
      newWorkExperience.startDate
    ) {
      setEditedMentor((prev) => ({
        ...prev,
        mentorWorkExperience: [
          ...(prev.mentorWorkExperience || []),
          newWorkExperience,
        ],
      }));
      setMentorData((prev) => ({
        ...prev,
        mentorWorkExperience: [
          ...(prev.mentorWorkExperience || []),
          newWorkExperience,
        ],
      }));
      setNewWorkExperience({});
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
      setEditedMentor((prev) => ({
        ...prev,
        certifications: [...(prev.certifications || []), newCertification],
      }));
      setMentorData((prev) => ({
        ...prev,
        certifications: [...(prev.certifications || []), newCertification],
      }));
      setNewCertification({});
      setOpenCertificationDialog(false);
    }
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
    if (!editedMentor || !selectedFile || !editedMentor.mentorDocuments) {
      setError("Vui lòng chọn một tài liệu.");
      return;
    }

    const application: MentorCreateApplication = {
      mentorEducations: editedMentor.mentorEducation,
      mentorWorkExperiences: editedMentor.mentorWorkExperience,
      mentorCertifications: editedMentor.certifications,
      mentorDocuments: editedMentor.mentorDocuments,
    };

    try {
      setLoading(true);
      await mentorService.submitCompleteApplication(application, selectedFile);
      alert("Đã gửi đơn đăng ký thành công!");
      setIsEditing(false);
      setSelectedFile(null);

      const response = await mentorService.getMyApplication();
      console.log("Updated Application Data:", response);

      const mappedData: MentorStatusType = {
        mentorEducation: response.mentorEducations || [],
        mentorWorkExperience: response.mentorWorkExperiences || [],
        certifications: response.mentorCertifications || [],
        mentorDocuments: response.supportingDocument || null,
        status: response.status,
      };

      setMentorData(mappedData);
      setEditedMentor({ ...mappedData });
    } catch (error) {
      console.error("Error submitting application:", error);
      setError("Lỗi khi gửi đơn đăng ký. Vui lòng thử lại.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (editedMentor) {
      setLoading(true);
      setTimeout(() => {
        setMentorData(editedMentor);
        setIsEditing(false);
        setLoading(false);
        setError(null);
      }, 1000);
    }
  };

  const handleCancel = () => {
    if (mentorData) {
      setEditedMentor({ ...mentorData });
      setIsEditing(false);
      setError(null);
      setNewEducation({});
      setNewWorkExperience({});
      setNewCertification({});
    }
  };

  const additionalSettingsContent = (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
          Education
          {isEditing && (
            <button
              onClick={() => setOpenEducationDialog(true)}
              className="ml-1">
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
                className="flex justify-between py-2 border-b-1 border-gray-500 last:border-b-0">
                <div className="flex w-full justify-between items-start">
                  <div className="flex flex-col">
                    <h5 className="font-medium">{education.fieldOfStudy}</h5>
                    <p className="text-[12px] text-gray-400">
                      {education.institutionName}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">
                      {education.graduationYear ?? "N/A"}
                    </span>
                    {isEditing && (
                      <button onClick={() => handleRemoveEducation(index)}>
                        <CircleMinus
                          size={20}
                          className="text-red-500 hover:text-red-600"
                        />
                      </button>
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
          Work Experience
          {isEditing && (
            <button
              onClick={() => setOpenWorkExperienceDialog(true)}
              className="ml-1">
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
                className="flex justify-between py-2 border-b-1 border-gray-500 last:border-b-0">
                <div className="flex w-full justify-between items-start">
                  <div className="flex flex-col">
                    <h5 className="font-medium">{experience.position}</h5>
                    <p className="text-[12px] text-gray-400">
                      {experience.companyName}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">
                      {new Date(experience.startDate).getFullYear()}–
                      {experience.endDate && experience.endDate !== "Present"
                        ? new Date(experience.endDate).getFullYear()
                        : "Present"}
                    </span>
                    {isEditing && (
                      <button onClick={() => handleRemoveWorkExperience(index)}>
                        <CircleMinus
                          size={20}
                          className="text-red-500 hover:text-red-600"
                        />
                      </button>
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
          Certifications
          {isEditing && (
            <button
              onClick={() => setOpenCertificationDialog(true)}
              className="ml-1">
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
                className="flex justify-between py-2 border-b-1 border-gray-500 last:border-b-0">
                <div className="flex w-full justify-between items-start">
                  <div className="flex flex-col">
                    <h5 className="font-medium">
                      {certificate.certificationName}
                    </h5>
                    <p className="text-[12px] text-gray-400">
                      {certificate.issuingOrganization}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isEditing && (
                      <button onClick={() => handleRemoveCertification(index)}>
                        <CircleMinus
                          size={20}
                          className="text-red-500 hover:text-red-600"
                        />
                      </button>
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
          Document
          {isEditing && (
            <button onClick={() => handleOpenFileExplorer()} className="ml-1">
              <CirclePlus
                size={20}
                className="text-green-500 hover:text-green-600"
              />
            </button>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </h3>
        <div className="bg-gray-700 p-4 rounded-lg">
          {mentorData.mentorDocuments ? (
            <div className="flex justify-between py-2 border-b-1 border-gray-500">
              <div className="flex flex-col">
                <h5 className="font-medium">
                  {mentorData.mentorDocuments.fileName}
                </h5>
                <p className="text-[12px] text-gray-400">
                  {mentorData.mentorDocuments.fileType}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    handleViewDocument(
                      mentorData.mentorDocuments!.documentContent
                        ?.fileContent || "",
                      mentorData.mentorDocuments!.fileType
                    )
                  }>
                  <Eye
                    size={20}
                    className="text-blue-500 hover:text-blue-600"
                  />
                </button>
                {isEditing && (
                  <button onClick={handleRemoveDocument}>
                    <CircleMinus
                      size={20}
                      className="text-red-500 hover:text-red-600"
                    />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-200">No document provided.</p>
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
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors">
              Edit Application
            </button>
          </div>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                {mentorData.userApplicationDetails?.profile?.photoData ? (
                  <img
                    src={mentorData.userApplicationDetails.profile.photoData}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-4xl">
                    {mentorData.userApplicationDetails?.profile?.fullName?.charAt(
                      0
                    ) || ""}
                  </span>
                )}
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
                        : mentorData.status === "Pending"
                        ? "bg-yellow-500"
                        : mentorData.status === "Request Info"
                        ? "bg-blue-500"
                        : ""
                    }`}>
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
                {mentorData.userApplicationDetails?.userArenaOfExpertises
                  ?.map((expertise) => expertise.arenaOfExpertise?.name)
                  .join(", ") || "No expertise provided"}
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
              <h3 className="text-sm font-medium text-gray-400 mb-1">Email</h3>
              <p className="text-sm text-gray-200">
                {mentorData.userApplicationDetails?.email ||
                  "No email provided"}
              </p>
            </div>
            <ExpandProfileSettings
              additionalSettings={additionalSettingsContent}
              isExpanded={isExpanded}
              onToggle={() => setIsExpanded((prev) => !prev)}
            />
            <CustomModal
              isOpen={openEducationDialog}
              onClose={handleOnEducationClose}
              title="Add Education"
              size="md">
              <EducationAddDialog
                onClose={handleOnEducationClose}
                onSubmit={handleAddNewEducation}
                initialData={
                  newEducation.institutionName &&
                  newEducation.fieldOfStudy &&
                  newEducation.graduationYear
                    ? (newEducation as MentorEducation)
                    : undefined
                }
                actionButtonText="Add Education"
                isSubmitting={false}
              />
            </CustomModal>
            <CustomModal
              isOpen={openCertificationDialog}
              onClose={handleOnCertificationClose}
              title="Add Certification"
              size="md">
              <CertificationAddDialog
                onClose={handleOnCertificationClose}
                onSubmit={handleAddCertification}
                initialData={
                  newCertification.certificationName &&
                  newCertification.issuingOrganization
                    ? (newCertification as MentorCertification)
                    : undefined
                }
                actionButtonText="Add Certification"
                isSubmitting={false}
              />
            </CustomModal>
            <CustomModal
              isOpen={openWorkExperienceDialog}
              onClose={handleOnWorkExperienceClose}
              title="Add Work Experience"
              size="md">
              <WorkExperienceAddDialog
                onClose={handleOnWorkExperienceClose}
                onSubmit={handleAddWorkExperience}
                initialData={
                  newWorkExperience.companyName &&
                  newWorkExperience.position &&
                  newWorkExperience.startDate
                    ? (newWorkExperience as MentorWorkExperience)
                    : undefined
                }
                actionButtonText="Add Work Experience"
                isSubmitting={false}
              />
            </CustomModal>
            <CustomModal
              isOpen={openDocumentViewer}
              onClose={handleCloseDocumentViewer}
              title="View Document"
              size="xl">
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
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors">
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors">
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => handleSubmitApplication()}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors">
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
