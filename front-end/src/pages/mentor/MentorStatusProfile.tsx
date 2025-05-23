import { useState, useEffect } from "react";
import mockUser1, { mockArenaOfExpertises } from "../../data/_mockuserdata";
import { CirclePlus, CircleMinus } from "lucide-react";
import ExpandProfileSettings from "../../components/feature/ExpandProfileSettings";
import { EnumType } from "../../types/commonType";
import InputCustom from "../../components/input/InputCustom";
import {
  MentorCertification,
  MentorEducation,
  MentorWorkExperience,
} from "../../types/mentor";
import CustomModal from "../../components/ui/Modal";
import EducationAddDialog from "../../components/dialog/Applications/EducationDialog";
import WorkExperienceAddDialog from "../../components/dialog/Applications/WorkExperienceDialog";
import CertificationAddDialog from "../../components/dialog/Applications/CertificationDialog";
import { set } from "date-fns";
// import { set } from "date-fns";

interface MentorStatusType {
  id: string;
  name: string;
  email: string;
  expertiseAreas: string[];
  status: string;
  profileImage: string;
  professionalSkill: string;
  industryExperience: string;
  mentorEducation: MentorEducation[];
  mentorWorkExperience: MentorWorkExperience[];
  certifications: MentorCertification[];
}

const MentorStatusProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mentorData, setMentorData] = useState<MentorStatusType | null>(null);
  const [editedMentor, setEditedMentor] = useState<MentorStatusType | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);

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
  const [openWorkExperienceDialog, setWorkExperienceDialog] = useState(false);
  const [openCertificationDialog, setCertificationDialog] = useState(false);
  useEffect(() => {
    setLoading(true);
    const initialMentor: MentorStatusType = {
      id: mockUser1.id ?? "", // Fallback to empty string if id is undefined
      name: mockUser1.userProfile?.fullName ?? "Unknown Name", // Fallback for name
      email: mockUser1.email ?? "", // Fallback for email
      expertiseAreas:
        mockUser1.userArenaOfExpertises
          ?.map((expertise) => expertise.arenaOfExpertise?.name ?? "")
          .filter((name) => name !== "") ?? [], // Filter out empty strings, fallback to empty array
      status:
        mockUser1.mentorApplications?.applicationStatus?.name ?? "unknown", // Fallback for status
      profileImage: mockUser1.userProfile?.photoData ?? "", // Fallback for profileImage
      professionalSkill: mockUser1.userProfile?.professionalSkill ?? "", // Fallback for professionalSkill
      industryExperience: mockUser1.userProfile?.industryExperience ?? "", // Fallback for industryExperience
      mentorEducation: mockUser1.mentorApplications?.mentorEducations ?? [], // Fallback for mentorEducation
      mentorWorkExperience:
        mockUser1.mentorApplications?.mentorWorkExperiences ?? [], // Fallback for mentorWorkExperience
      certifications: mockUser1.mentorApplications?.mentorCertifications ?? [], // Fallback for certifications
    };
    setMentorData(initialMentor);
    setEditedMentor({ ...initialMentor });
    setLoading(false);
  }, []);

  const handleAddNewEducation = async (newEducation: MentorEducation) => {
    if (
      newEducation.institutionName &&
      newEducation.fieldOfStudy &&
      newEducation.graduationYear
    ) {
      setEditedMentor((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          mentorEducation: [...(prev.mentorEducation || []), newEducation],
        };
      });
      setMentorData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          mentorEducation: [...(prev.mentorEducation || []), newEducation],
        };
      });
      setNewEducation({});
      setOpenEducationDialog(false);
    }
  };
  const handleOnEducationClose = () => {
    setOpenEducationDialog(false);
    setNewEducation({});
  };

  const handleOnWorkExperienceClose = () => {
    setWorkExperienceDialog(false);
    setNewWorkExperience({});
  };

  const handleOnCertificationClose = () => {
    setCertificationDialog(false);
    setNewCertification({});
  };

  // Add new work experience
  const handleAddWorkExperience = async (
    newWorkExperience: MentorWorkExperience
  ) => {
    if (
      newWorkExperience.companyName &&
      newWorkExperience.position &&
      newWorkExperience.startDate
    ) {
      setEditedMentor((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          mentorWorkExperience: [
            ...(prev.mentorWorkExperience || []),
            newWorkExperience,
          ],
        };
      });
      setMentorData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          mentorWorkExperience: [
            ...(prev.mentorWorkExperience || []),
            newWorkExperience,
          ],
        };
      });
      setNewWorkExperience({});
      setWorkExperienceDialog(false);
    }
  };

  // Add new certification
  const handleAddCertification = async (
    newCertification: MentorCertification
  ) => {
    if (
      newCertification.certificationName &&
      newCertification.issuingOrganization
    ) {
      setEditedMentor((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          certifications: [...(prev.certifications || []), newCertification],
        };
      });
      setMentorData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          certifications: [...(prev.certifications || []), newCertification],
        };
      });
      setNewCertification({});
      setCertificationDialog(false);
    }
  };

  // Remove education
  // const handleRemoveEducation = (index: number) => {
  //   if (editedMentor) {
  //     setEditedMentor((prev) => {
  //       if (!prev) return prev;
  //       const mentorEducation = [...(prev.mentorEducation || [])];
  //       mentorEducation.splice(index, 1);
  //       return { ...prev, mentorEducation };
  //     });
  //   }
  // };
  const handleRemoveEducation = (index: number) => {
    setEditedMentor((prev) => {
      if (!prev) return prev;
      const mentorEducation = [...(prev.mentorEducation || [])];
      mentorEducation.splice(index, 1);
      return { ...prev, mentorEducation };
    });
    setMentorData((prev) => {
      if (!prev) return prev;
      const mentorEducation = [...(prev.mentorEducation || [])];
      mentorEducation.splice(index, 1);
      return { ...prev, mentorEducation };
    });
  };

  // Remove work experience
  const handleRemoveWorkExperience = (index: number) => {
    setEditedMentor((prev) => {
      if (!prev) return prev;
      const mentorWorkExperience = [...(prev.mentorWorkExperience || [])];
      mentorWorkExperience.splice(index, 1);
      return { ...prev, mentorWorkExperience };
    });
    setMentorData((prev) => {
      if (!prev) return prev;
      const mentorWorkExperience = [...(prev.mentorWorkExperience || [])];
      mentorWorkExperience.splice(index, 1);
      return { ...prev, mentorWorkExperience };
    });
  };

  // Remove certification
  const handleRemoveCertification = (index: number) => {
    setEditedMentor((prev) => {
      if (!prev) return prev;
      const certifications = [...(prev.certifications || [])];
      certifications.splice(index, 1);
      return { ...prev, certifications };
    });
    setMentorData((prev) => {
      if (!prev) return prev;
      const certifications = [...(prev.certifications || [])];
      certifications.splice(index, 1);
      return { ...prev, certifications };
    });
  };

  // Thêm tài liệu mới
  // const handleAddDocument = (doc: {
  //   name: string;
  //   type: string;
  //   url: string;
  // }) => {
  //   if (editedMentor) {
  //     setEditedMentor((prev) =>
  //       prev ? { ...prev, documents: [...(prev.documents || []), doc] } : prev
  //     );
  //   }
  // };
  // // Xóa tài liệu
  // const handleRemoveDocument = (index: number) => {
  //   if (editedMentor) {
  //     setEditedMentor((prev) => {
  //       if (!prev) return prev;
  //       const documents = [...(prev.documents || [])];
  //       documents.splice(index, 1);
  //       return { ...prev, documents };
  //     });
  //   }
  // };

  // Lưu thay đổi
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

  // Cancel editing
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
          <button onClick={() => setOpenEducationDialog(true)} className="ml-1">
            <CirclePlus
              size={20}
              className="text-green-500 hover:text-green-600"
            />
          </button>
        </h3>
        <div className="bg-gray-700 p-4 rounded-lg">
          {mentorData && mentorData.mentorEducation?.length > 0 ? (
            mentorData.mentorEducation.map((education, index) => (
              <div
                key={index}
                className="flex justify-between py-2 border-b-1 border-gray-500 last:border-b-0"
              >
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
                    <button onClick={() => handleRemoveWorkExperience(index)}>
                      <CircleMinus
                        size={20}
                        className="text-red-500 hover:text-red-600"
                      />
                    </button>
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
          <button
            onClick={() => setWorkExperienceDialog(true)}
            className="ml-1"
          >
            <CirclePlus
              size={20}
              className="text-green-500 hover:text-green-600"
            />
          </button>
        </h3>
        <div className="bg-gray-700 p-4 rounded-lg">
          {mentorData && mentorData.mentorWorkExperience?.length > 0 ? (
            mentorData.mentorWorkExperience.map((experience, index) => (
              <div
                key={index}
                className="flex justify-between py-2 border-b-1 border-gray-500 last:border-b-0"
              >
                <div className="flex w-full justify-between items-start">
                  {/* Bên trái */}
                  <div className="flex flex-col">
                    <h5 className="font-medium">{experience.position}</h5>
                    <p className="text-[12px] text-gray-400">
                      {experience.companyName}
                    </p>
                  </div>

                  {/* Bên phải */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">
                      {new Date(experience.startDate).getFullYear()}–
                      {experience.endDate && experience.endDate !== "Present"
                        ? new Date(experience.endDate).getFullYear()
                        : "Present"}
                    </span>
                    <button onClick={() => handleRemoveWorkExperience(index)}>
                      <CircleMinus
                        size={20}
                        className="text-red-500 hover:text-red-600"
                      />
                    </button>
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
          <button onClick={() => setCertificationDialog(true)} className="ml-1">
            <CirclePlus
              size={20}
              className="text-green-500 hover:text-green-600"
            />
          </button>
        </h3>
        <div className="bg-gray-700 p-4 rounded-lg">
          {mentorData && mentorData.certifications?.length > 0 ? (
            mentorData.certifications.map((certificate, index) => (
              <div
                key={index}
                className="flex justify-between py-2 border-b-1 border-gray-500 last:border-b-0"
              >
                <h5 className="font-medium">
                  {certificate.certificationName}
                  <div>
                    <p className="text-[12px] text-gray-400">
                      {certificate.issuingOrganization}
                    </p>
                  </div>
                </h5>
                <button onClick={() => handleRemoveCertification(index)}>
                  <CircleMinus
                    size={20}
                    className="text-red-500 hover:text-red-600"
                  />
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-200">No certifications provided.</p>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-2">Documents</h3>
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-200">No documents provided.</p>
        </div>
      </div>
    </div>
  );

  if (loading) return <div>Loading...</div>;
  if (!editedMentor) return <div>No data available</div>;

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
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
            >
              Edit Application
            </button>
          </div>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                <span className="text-gray-400 text-4xl">
                  <img
                    src={mentorData.profileImage}
                    alt={mentorData.name}
                    className="rounded-full object-cover"
                  />
                </span>
              </div>
              <div>
                <h2 className="text-xl font-medium">{mentorData.name}</h2>
                <div className="mt-1 flex items-center">
                  <span className="bg-orange-500 text-xs text-white px-2.5 py-1 rounded-full capitalize">
                    mentor
                  </span>
                  <span className="pr-1"></span>
                  <span
                    className={`text-xs text-white px-2.5 py-1 rounded-full capitalize ${
                      mentorData.status === "approved"
                        ? "bg-green-500"
                        : mentorData.status === "rejected"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {mentorData.status}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                Areas of expertise
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {mentorData.expertiseAreas.map((area, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-700 text-white-700 rounded-full text-sm"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">
                Professional skills
              </h3>
              <p className="text-gray-200">{mentorData.professionalSkill}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">
                Industry experience
              </h3>
              <p className="text-gray-200">{mentorData.industryExperience}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Email</h3>
              <p className="text-gray-200">{mentorData?.email}</p>
            </div>
            <ExpandProfileSettings
              additionalSettings={additionalSettingsContent}
            />
            <CustomModal
              isOpen={openEducationDialog}
              onClose={handleOnEducationClose}
              title="Add Education"
              size="md"
            >
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
              size="md"
            >
              <CertificationAddDialog
                onClose={handleOnCertificationClose}
                onSubmit={handleAddCertification}
                initialData={
                  newCertification.certificationName &&
                  newCertification.issuingOrganization
                    ? (newCertification as MentorCertification)
                    : undefined
                }
                actionButtonText="Add Education"
                isSubmitting={false}
              />
            </CustomModal>
            <CustomModal
              isOpen={openWorkExperienceDialog}
              onClose={handleOnWorkExperienceClose}
              title="Add Work Experience"
              size="md"
            >
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
          </div>
        </div>
      </div>
    </main>
  );
};

export default MentorStatusProfile;
