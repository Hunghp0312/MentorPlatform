import { useState, useEffect } from "react";
import mockUser1, { mockArenaOfExpertises } from "../../data/_mockuserdata";
import ExpandProfileSettings from "../../components/feature/ExpandProfileSettings";
import { EnumType } from "../../types/commonType";
import { MentorEducation, MentorWorkExperience } from "../../types/mentor";
// import { set } from "date-fns";

interface MentorStatusType {
  id: string;
  name: string;
  email: string;
  expertiseAreas: string[];
  status: string;
  profileImage: string;
  bio: string;
  professionalSkill: string;
  industryExperience: string;
  availability: EnumType[];
  communicationMethod: EnumType;
  mentorEducation: MentorEducation[];
  mentorWorkExperience: MentorWorkExperience[];
}

const MentorStatusProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mentorData, setMentorData] = useState<MentorStatusType | null>(null);
  const [editedMentor, setEditedMentor] = useState<MentorStatusType | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
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
      bio: mockUser1.userProfile?.bio ?? "", // Fallback for bio
      professionalSkill: mockUser1.userProfile?.professionalSkill ?? "", // Fallback for professionalSkill
      industryExperience: mockUser1.userProfile?.industryExperience ?? "", // Fallback for industryExperience
      availability: mockUser1.userProfile?.availabilityData ?? [], // Fallback for availability
      communicationMethod: mockUser1.userProfile?.communicationMethod ?? {
        id: 1,
        name: "Email",
      }, // Fallback for communicationMethod
      mentorEducation: mockUser1.mentorApplications?.mentorEducations ?? [], // Fallback for mentorEducation
      mentorWorkExperience:
        mockUser1.mentorApplications?.mentorWorkExperiences ?? [], // Fallback for mentorWorkExperience
    };
    setMentorData(initialMentor);
    setEditedMentor({ ...initialMentor });
    setLoading(false);
  }, []);
  // Xử lý thay đổi input (name, email, experience, profileImage)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editedMentor) {
      setEditedMentor((prev) => (prev ? { ...prev, [name]: value } : prev));
    }
  };
  // Xử lý thay đổi expertiseAreas (thêm/xóa)
  const handleExpertiseChange = (value: string, action: "add" | "remove") => {
    if (editedMentor) {
      setEditedMentor((prev) => {
        if (!prev) return prev;
        const expertiseAreas = [...(prev.expertiseAreas || [])];
        if (action === "add" && !expertiseAreas.includes(value)) {
          expertiseAreas.push(value);
        } else if (action === "remove" && expertiseAreas.includes(value)) {
          expertiseAreas.splice(expertiseAreas.indexOf(value), 1);
        }
        return { ...prev, expertiseAreas };
      });
    }
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
        setIsEditing(false); // Tắt chế độ chỉnh sửa sau khi lưu
        setLoading(false);
        setError(null);
      }, 1000);
    }
  };

  // Hủy bỏ chỉnh sửa
  const handleCancel = () => {
    if (mentorData) {
      setEditedMentor({ ...mentorData });
      setIsEditing(false); // Tắt chế độ chỉnh sửa khi hủy
      setError(null);
    }
  };
  // Define the content for ExpandProfileSettings
  // const additionalSettingsContent = (
  //   <div className="space-y-4">
  //     <div>
  //       <h3 className="text-sm font-medium text-gray-400 mb-1">
  //         Submitted Date
  //       </h3>
  //       <p className="text-gray-200">{mentorData?.submittedDate}</p>
  //     </div>
  //     <div>
  //       <h3 className="text-sm font-medium text-gray-400 mb-2">Documents</h3>
  //       {mentorData?.documents.length > 0 ? (
  //         <div className="space-y-2">
  //           {mentorData?.documents.map((doc, index) => (
  //             <div
  //               key={index}
  //               className="flex items-center justify-between bg-gray-600 p-2 rounded"
  //             >
  //               <div className="flex items-center">
  //                 <span
  //                   className={`mr-2 text-sm font-medium ${
  //                     doc.type === "PDF" ? "text-red-400" : "text-blue-400"
  //                   }`}
  //                 >
  //                   {doc.type}
  //                 </span>
  //                 <span className="text-sm text-gray-200">{doc.name}</span>
  //               </div>
  //               <div className="flex items-center space-x-2">
  //                 <a
  //                   href={doc.url}
  //                   className="text-blue-400 hover:text-blue-300 text-sm"
  //                   target="_blank"
  //                   rel="noopener noreferrer"
  //                 >
  //                   View
  //                 </a>
  //                 {isEditing && (
  //                   <button
  //                     onClick={() => handleRemoveDocument(index)}
  //                     className="text-red-400 hover:text-red-300 text-sm"
  //                   >
  //                     Remove
  //                   </button>
  //                 )}
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //       ) : (
  //         <p className="text-gray-200">No documents available.</p>
  //       )}
  //     </div>
  //   </div>
  // );
  const additionalSettingsContent = (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-1">Availability</h3>
        <p className="text-gray-200">
          {mentorData?.availability?.map((day) => day.name).join(", ") ||
            "Not specified"}
        </p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-1">
          Communication Method
        </h3>
        <p className="text-gray-200">
          {mentorData?.communicationMethod?.name || "Not specified"}
        </p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-2">Education</h3>
        <div className="bg-gray-700 p-4 rounded-lg">
          {mentorData && mentorData.mentorEducation?.length > 0 ? (
            mentorData.mentorEducation.map((education, index) => (
              <div key={index} className="flex justify-between py-2">
                <div className="text-sm text-gray-200">
                  {education.institutionName} - {education.fieldOfStudy}
                </div>
                <div className="text-sm text-gray-400">
                  {education.graduationYear ?? "N/A"}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-200">No education provided.</p>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-2">
          Work Experience
        </h3>
        <div className="bg-gray-700 p-4 rounded-lg">
          {mentorData && mentorData.mentorWorkExperience?.length > 0 ? (
            mentorData.mentorWorkExperience.map((experience, index) => (
              <div key={index} className="flex justify-between py-2">
                <div className="text-sm text-gray-200">
                  {experience.companyName} - {experience.position}
                </div>
                <div className="text-sm text-gray-400">
                  {new Date(experience.startDate).getFullYear()}–
                  {experience.endDate
                    ? new Date(experience.endDate).getFullYear()
                    : "Present"}
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
              Your Profile
            </h1>
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
            >
              Edit Profile
            </button>
          </div>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                <span className="text-gray-400 text-4xl">
                  <img
                    src={mentorData.profileImage}
                    alt={mentorData.name}
                    className=" rounded-full object-cover"
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
              <h3 className="text-sm font-medium text-gray-400 mb-1">About</h3>
              <p className="text-gray-200">{mentorData?.bio}</p>
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
              <h3 className="text-sm font-medium text-gray-400 mb-1">
                Contact
              </h3>
              <p className="text-gray-200">{mentorData?.email}</p>
            </div>
            {/* <div className="pt-4 border-t border-gray-700">
              <button className="text-orange-500 hover:text-orange-400 text-sm flex items-center">
                <span>View Additional Profile Settings</span>
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </button>
            </div> */}
            <ExpandProfileSettings
              additionalSettings={additionalSettingsContent}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default MentorStatusProfile;
