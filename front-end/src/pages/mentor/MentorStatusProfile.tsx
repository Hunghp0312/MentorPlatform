// import { useState, useEffect, useRef } from "react";
// import { CirclePlus, CircleMinus, Eye } from "lucide-react";
// import ExpandProfileSettings from "../../components/feature/ExpandProfileSettings";
// import { mentorService } from "../../services/mentorapplication.service";
// import {
//   MentorCertification,
//   MentorEducation,
//   MentorWorkExperience,
//   MentorCreateApplication,
//   SupportingDocument,
// } from "../../types/mentorapplication";
// import CustomModal from "../../components/ui/Modal";
// import EducationAddDialog from "../../components/dialog/Applications/EducationDialog";
// import WorkExperienceAddDialog from "../../components/dialog/Applications/WorkExperienceDialog";
// import CertificationAddDialog from "../../components/dialog/Applications/CertificationDialog";
// interface MentorStatusType {
//   // id: string;
//   // name: string;
//   // email: string;
//   // expertiseAreas: string[];
//   // profileImage: string;
//   // professionalSkill: string;
//   // industryExperience: string;
//   mentorEducation: MentorEducation[];
//   mentorWorkExperience: MentorWorkExperience[];
//   certifications: MentorCertification[];
//   mentorDocuments: SupportingDocument | null;
//   submissionDate?: string; // Add submissionDate
//   status?: string; // Add status
// }

// const MentorStatusProfile = () => {
//   const [loading, setLoading] = useState(false);
//   const [isExpanded, setIsExpanded] = useState(true);
//   const [, setError] = useState<string | null>(null);
//   const [mentorData, setMentorData] = useState<MentorStatusType>({
//     mentorEducation: [],
//     mentorWorkExperience: [],
//     certifications: [],
//     mentorDocuments: null,
//     submissionDate: "", // Initialize
//     status: "", // Initialize
//   });
//   const [editedMentor, setEditedMentor] = useState<MentorStatusType>({
//     mentorEducation: [],
//     mentorWorkExperience: [],
//     certifications: [],
//     mentorDocuments: null,
//     submissionDate: "", // Initialize
//     status: "", // Initialize
//   });
//   const [isEditing, setIsEditing] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [newEducation, setNewEducation] = useState<Partial<MentorEducation>>(
//     {}
//   );
//   const [newWorkExperience, setNewWorkExperience] = useState<
//     Partial<MentorWorkExperience>
//   >({});
//   const [newCertification, setNewCertification] = useState<
//     Partial<MentorCertification>
//   >({});
//   const [openEducationDialog, setOpenEducationDialog] = useState(false);
//   const [openWorkExperienceDialog, setWorkExperienceDialog] = useState(false);
//   const [openCertificationDialog, setCertificationDialog] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     const loadMyApplication = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const response = await mentorService.getMyApplication();
//         console.log("My Application Data:", response);

//         // Fix the document mapping - the fileContent is directly in the document object
//         let mappedDocument = null;
//         if (response.documentsDetails?.[0]) {
//           const doc = response.documentsDetails[0];
//           mappedDocument = {
//             //id: doc.id,
//             fileName: doc.fileName,
//             fileType: doc.fileType,
//             fileSize: doc.fileSize || 0,
//             uploadedAt: doc.uploadedAt || new Date().toISOString(),
//             documentContent: {
//               fileName: doc.fileName,
//               fileType: doc.fileType,
//               fileContent: doc.fileContent, // This is where the Base64 content is
//             },
//           };
//         }

//         const mappedData: MentorStatusType = {
//           mentorEducation: response.educationDetails || [],
//           mentorWorkExperience: response.workExperienceDetails || [],
//           certifications: response.certifications || [],
//           mentorDocuments: mappedDocument,
//           status: response.status,
//         };

//         console.log("Mapped Data:", mappedData);
//         console.log("Mapped mentorDocuments:", mappedData.mentorDocuments);
//         if (mappedData.mentorDocuments) {
//           console.log(
//             "Document Content:",
//             mappedData.mentorDocuments.documentContent
//           );
//           console.log(
//             "File Content:",
//             mappedData.mentorDocuments?.documentContent?.fileContent
//           );
//           console.log(
//             "File Content Length:",
//             mappedData.mentorDocuments.documentContent?.fileContent?.length
//           );
//           console.log("File Type:", mappedData.mentorDocuments.fileType);
//         } else {
//           console.log("No mentorDocuments found in mappedData");
//         }

//         setMentorData(mappedData);
//         setEditedMentor({ ...mappedData });
//       } catch (error: any) {
//         console.error("Error loading application data:", error);

//         if (error.response?.status === 404) {
//           console.log("No existing application found - starting fresh");
//           setError(null);
//         } else {
//           setError(`Failed to load application: ${error.message}`);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadMyApplication();
//   }, []);
//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files[0]) {
//       const file = event.target.files[0];
//       setSelectedFile(file);
//       const newDocument: SupportingDocument = {
//         fileName: file.name,
//         fileType: file.type,
//         fileSize: file.size,
//         uploadedAt: new Date().toISOString(),
//         documentContent: {
//           fileName: file.name,
//           fileType: file.type,
//           fileContent: "",
//         },
//       };
//       setEditedMentor((prev) => ({
//         ...prev,
//         mentorDocuments: newDocument,
//       }));
//       setMentorData((prev) => ({
//         ...prev,
//         mentorDocuments: newDocument,
//       }));
//     }
//   };
//   const handleOpenFileExplorer = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   // Xóa document
//   const handleRemoveDocument = () => {
//     setEditedMentor((prev) => ({
//       ...prev,
//       mentorDocuments: null,
//     }));
//     setMentorData((prev) => ({
//       ...prev,
//       mentorDocuments: null,
//     }));
//     setSelectedFile(null);
//   };
//   const handleAddNewEducation = async (newEducation: MentorEducation) => {
//     if (
//       newEducation.institutionName &&
//       newEducation.fieldOfStudy &&
//       newEducation.graduationYear
//     ) {
//       setEditedMentor((prev) => {
//         if (!prev) return prev;
//         return {
//           ...prev,
//           mentorEducation: [...(prev.mentorEducation || []), newEducation],
//         };
//       });
//       setMentorData((prev) => {
//         if (!prev) return prev;
//         return {
//           ...prev,
//           mentorEducation: [...(prev.mentorEducation || []), newEducation],
//         };
//       });
//       setNewEducation({});
//       setOpenEducationDialog(false);
//     }
//   };
//   const handleOnEducationClose = () => {
//     setOpenEducationDialog(false);
//     setNewEducation({});
//   };

//   const handleOnWorkExperienceClose = () => {
//     setWorkExperienceDialog(false);
//     setNewWorkExperience({});
//   };

//   const handleOnCertificationClose = () => {
//     setCertificationDialog(false);
//     setNewCertification({});
//   };
//   const handleViewDocument = (fileContent: string, fileType: string) => {
//     console.log("handleViewDocument called", {
//       fileType,
//       fileContentLength: fileContent?.length,
//     });
//     if (!fileContent) {
//       console.error("File content is missing or empty");
//       setError("Không thể mở tài liệu: Không có nội dung tài liệu.");
//       return;
//     }
//     if (!fileType) {
//       console.error("File type is missing");
//       setError("Không thể mở tài liệu: Thiếu loại tệp.");
//       return;
//     }
//     try {
//       // Validate Base64 string
//       const isValidBase64 = /^[A-Za-z0-9+/=]+$/.test(fileContent);
//       if (!isValidBase64) {
//         console.error("Invalid Base64 string detected");
//         setError("Không thể mở tài liệu: Dữ liệu Base64 không hợp lệ.");
//         return;
//       }
//       const dataUrl = `data:${fileType};base64,${fileContent}`;
//       console.log(
//         "Generated Data URL (first 100 chars):",
//         dataUrl.substring(0, 100)
//       );
//       const newWindow = window.open("", "_blank");
//       if (newWindow) {
//         newWindow.document.write(`
//         <html>
//           <body>
//             <embed src="${dataUrl}" type="${fileType}" width="100%" height="100%" />
//           </body>
//         </html>
//       `);
//         newWindow.document.close();
//       } else {
//         console.error("Failed to open new window");
//         setError("Không thể mở tab mới để xem tài liệu.");
//       }
//     } catch (error) {
//       console.error("Error in handleViewDocument:", error);
//       setError("Lỗi khi mở tài liệu: Vui lòng thử lại.");
//     }
//   };
//   // Add new work experience
//   const handleAddWorkExperience = async (
//     newWorkExperience: MentorWorkExperience
//   ) => {
//     if (
//       newWorkExperience.companyName &&
//       newWorkExperience.position &&
//       newWorkExperience.startDate
//     ) {
//       setEditedMentor((prev) => {
//         if (!prev) return prev;
//         return {
//           ...prev,
//           mentorWorkExperience: [
//             ...(prev.mentorWorkExperience || []),
//             newWorkExperience,
//           ],
//         };
//       });
//       setMentorData((prev) => {
//         if (!prev) return prev;
//         return {
//           ...prev,
//           mentorWorkExperience: [
//             ...(prev.mentorWorkExperience || []),
//             newWorkExperience,
//           ],
//         };
//       });
//       setNewWorkExperience({});
//       setWorkExperienceDialog(false);
//     }
//   };

//   // Add new certification
//   const handleAddCertification = async (
//     newCertification: MentorCertification
//   ) => {
//     if (
//       newCertification.certificationName &&
//       newCertification.issuingOrganization
//     ) {
//       setEditedMentor((prev) => {
//         if (!prev) return prev;
//         return {
//           ...prev,
//           certifications: [...(prev.certifications || []), newCertification],
//         };
//       });
//       setMentorData((prev) => {
//         if (!prev) return prev;
//         return {
//           ...prev,
//           certifications: [...(prev.certifications || []), newCertification],
//         };
//       });
//       setNewCertification({});
//       setCertificationDialog(false);
//     }
//   };

//   // Remove education
//   // const handleRemoveEducation = (index: number) => {
//   //   if (editedMentor) {
//   //     setEditedMentor((prev) => {
//   //       if (!prev) return prev;
//   //       const mentorEducation = [...(prev.mentorEducation || [])];
//   //       mentorEducation.splice(index, 1);
//   //       return { ...prev, mentorEducation };
//   //     });
//   //   }
//   // };
//   const handleRemoveEducation = (index: number) => {
//     setEditedMentor((prev) => {
//       if (!prev) return prev;
//       const mentorEducation = [...(prev.mentorEducation || [])];
//       mentorEducation.splice(index, 1);
//       return { ...prev, mentorEducation };
//     });
//     setMentorData((prev) => {
//       if (!prev) return prev;
//       const mentorEducation = [...(prev.mentorEducation || [])];
//       mentorEducation.splice(index, 1);
//       return { ...prev, mentorEducation };
//     });
//   };

//   // Remove work experience
//   const handleRemoveWorkExperience = (index: number) => {
//     setEditedMentor((prev) => {
//       if (!prev) return prev;
//       const mentorWorkExperience = [...(prev.mentorWorkExperience || [])];
//       mentorWorkExperience.splice(index, 1);
//       return { ...prev, mentorWorkExperience };
//     });
//     setMentorData((prev) => {
//       if (!prev) return prev;
//       const mentorWorkExperience = [...(prev.mentorWorkExperience || [])];
//       mentorWorkExperience.splice(index, 1);
//       return { ...prev, mentorWorkExperience };
//     });
//   };

//   // Remove certification
//   const handleRemoveCertification = (index: number) => {
//     setEditedMentor((prev) => {
//       if (!prev) return prev;
//       const certifications = [...(prev.certifications || [])];
//       certifications.splice(index, 1);
//       return { ...prev, certifications };
//     });
//     setMentorData((prev) => {
//       if (!prev) return prev;
//       const certifications = [...(prev.certifications || [])];
//       certifications.splice(index, 1);
//       return { ...prev, certifications };
//     });
//   };

//   // const handleSubmitApplication = async () => {
//   //   if (!editedMentor || !selectedFile || !editedMentor.mentorDocuments) {
//   //     setError("Vui lòng chọn một tài liệu.");
//   //     return;
//   //   }

//   //   const application: MentorCreateApplication = {
//   //     mentorEducations: editedMentor.mentorEducation,
//   //     mentorWorkExperiences: editedMentor.mentorWorkExperience,
//   //     mentorCertifications: editedMentor.certifications,
//   //     menttorDocuments: editedMentor.mentorDocuments,
//   //   };

//   //   try {
//   //     setLoading(true);
//   //     await mentorService.submitCompleteApplication(application, selectedFile);
//   //     alert("Đã gửi đơn đăng ký thành công!");
//   //     setIsEditing(true);
//   //     setSelectedFile(null);
//   //   } catch (error) {
//   //     console.error("Error submitting application:", error);
//   //     //console.error("Error submitting mentor application:", error);
//   //     // console.error("Response data:", error.response?.data); // Log the server's response
//   //     throw error;
//   //     // setError(
//   //     //   `Lỗi khi gửi đơn đăng ký: ${error.message || "Vui lòng thử lại."}`
//   //     // );
//   //     // setError("Lỗi khi gửi đơn đăng ký. Vui lòng thử lại.");
//   //   }
//   //   // } finally {
//   //   //   setLoading(false);
//   //   // }
//   // };
//   const handleSubmitApplication = async () => {
//     if (!editedMentor || !selectedFile || !editedMentor.mentorDocuments) {
//       setError("Vui lòng chọn một tài liệu.");
//       return;
//     }

//     const application: MentorCreateApplication = {
//       mentorEducations: editedMentor.mentorEducation,
//       mentorWorkExperiences: editedMentor.mentorWorkExperience,
//       mentorCertifications: editedMentor.certifications,
//       menttorDocuments: editedMentor.mentorDocuments,
//     };

//     try {
//       setLoading(true);
//       await mentorService.submitCompleteApplication(application, selectedFile);
//       alert("Đã gửi đơn đăng ký thành công!");
//       setIsEditing(false);
//       setSelectedFile(null);

//       // Reload data sau khi submit thành công
//       const response = await mentorService.getMyApplication();
//       console.log("Updated Application Data:", response);

//       const mappedData: MentorStatusType = {
//         mentorEducation: response.mentorEducations || [],
//         mentorWorkExperience: response.mentorWorkExperiences || [],
//         certifications: response.mentorCertifications || [],
//         mentorDocuments: response.supportingDocument || null,
//         // id: response.id,
//         // applicationStatus: response.applicationStatus,
//         // submissionDate: response.submissionDate,
//       };

//       setMentorData(mappedData);
//       setEditedMentor({ ...mappedData });
//     } catch (error) {
//       console.error("Error submitting application:", error);
//       setError("Lỗi khi gửi đơn đăng ký. Vui lòng thử lại.");
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };
//   //   // const application: MentorCreateApplication = {
//   //   //   mentorEducations: [
//   //   //     {
//   //   //       institutionName: "Test University",
//   //   //       fieldOfStudy: "Computer Science",
//   //   //       graduationYear: 2020,
//   //   //     },
//   //   //   ],
//   //   //   mentorWorkExperiences: [
//   //   //     {
//   //   //       companyName: "Test Company",
//   //   //       position: "Software Engineer",
//   //   //       startDate: "2021-01-01T00:00:00.000Z", // Past date in ISO 8601 format
//   //   //       endDate: "2023-01-01T00:00:00.000Z", // Past date in ISO 8601 format
//   //   //     },
//   //   //   ],
//   //   //   mentorCertifications: [
//   //   //     {
//   //   //       certificationName: "AWS Certified Developer",
//   //   //       issuingOrganization: "Amazon",
//   //   //     },
//   //   //   ],
//   //   //   menttorDocuments: editedMentor.mentorDocuments,
//   //   // };

//   //   try {
//   //     setLoading(true);
//   //     await mentorService.submitCompleteApplication(application, selectedFile);
//   //     alert("Đã gửi đơn đăng ký thành công!");
//   //     setIsEditing(true);
//   //     setSelectedFile(null);
//   //   } catch (error: any) {
//   //     console.error(
//   //       "Error submitting application:",
//   //       error.response?.data || error.message
//   //     );
//   //     setError(
//   //       error.response?.data?.message ||
//   //         "Lỗi khi gửi đơn đăng ký. Vui lòng thử lại."
//   //     );
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // Lưu thay đổi
//   const handleSave = () => {
//     if (editedMentor) {
//       setLoading(true);
//       setTimeout(() => {
//         setMentorData(editedMentor);
//         setIsEditing(false);
//         setLoading(false);
//         setError(null);
//       }, 1000);
//     }
//   };

//   // Cancel editing
//   const handleCancel = () => {
//     if (mentorData) {
//       setEditedMentor({ ...mentorData });
//       setIsEditing(false);
//       setError(null);
//       setNewEducation({});
//       setNewWorkExperience({});
//       setNewCertification({});
//     }
//   };

//   const additionalSettingsContent = (
//     <div className="space-y-4">
//       <div>
//         <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
//           Education
//           {isEditing && (
//             <button
//               onClick={() => setOpenEducationDialog(true)}
//               className="ml-1"
//             >
//               <CirclePlus
//                 size={20}
//                 className="text-green-500 hover:text-green-600"
//               />
//             </button>
//           )}
//         </h3>
//         <div className="bg-gray-700 p-4 rounded-lg">
//           {mentorData && mentorData.mentorEducation?.length > 0 ? (
//             mentorData.mentorEducation.map((education, index) => (
//               <div
//                 key={index}
//                 className="flex justify-between py-2 border-b-1 border-gray-500 last:border-b-0"
//               >
//                 <div className="flex w-full justify-between items-start">
//                   <div className="flex flex-col">
//                     <h5 className="font-medium">{education.fieldOfStudy}</h5>
//                     <p className="text-[12px] text-gray-400">
//                       {education.institutionName}
//                     </p>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <span className="text-sm text-gray-400">
//                       {education.graduationYear ?? "N/A"}
//                     </span>
//                     {isEditing && (
//                       <button onClick={() => handleRemoveEducation(index)}>
//                         <CircleMinus
//                           size={20}
//                           className="text-red-500 hover:text-red-600"
//                         />
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-sm text-gray-200">No education provided.</p>
//           )}
//         </div>
//       </div>
//       <div>
//         <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
//           Work Experience
//           {isEditing && (
//             <button
//               onClick={() => setWorkExperienceDialog(true)}
//               className="ml-1"
//             >
//               <CirclePlus
//                 size={20}
//                 className="text-green-500 hover:text-green-600"
//               />
//             </button>
//           )}
//         </h3>
//         <div className="bg-gray-700 p-4 rounded-lg">
//           {mentorData && mentorData.mentorWorkExperience?.length > 0 ? (
//             mentorData.mentorWorkExperience.map((experience, index) => (
//               <div
//                 key={index}
//                 className="flex justify-between py-2 border-b-1 border-gray-500 last:border-b-0"
//               >
//                 <div className="flex w-full justify-between items-start">
//                   <div className="flex flex-col">
//                     <h5 className="font-medium">{experience.position}</h5>
//                     <p className="text-[12px] text-gray-400">
//                       {experience.companyName}
//                     </p>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <span className="text-sm text-gray-400">
//                       {new Date(experience.startDate).getFullYear()}–
//                       {experience.endDate && experience.endDate !== "Present"
//                         ? new Date(experience.endDate).getFullYear()
//                         : "Present"}
//                     </span>
//                     {isEditing && (
//                       <button onClick={() => handleRemoveWorkExperience(index)}>
//                         <CircleMinus
//                           size={20}
//                           className="text-red-500 hover:text-red-600"
//                         />
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-sm text-gray-200">
//               No work experience provided.
//             </p>
//           )}
//         </div>
//       </div>
//       <div>
//         <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
//           Certifications
//           {isEditing && (
//             <button
//               onClick={() => setCertificationDialog(true)}
//               className="ml-1"
//             >
//               <CirclePlus
//                 size={20}
//                 className="text-green-500 hover:text-green-600"
//               />
//             </button>
//           )}
//         </h3>
//         <div className="bg-gray-700 p-4 rounded-lg">
//           {mentorData && mentorData.certifications?.length > 0 ? (
//             mentorData.certifications.map((certificate, index) => (
//               <div
//                 key={index}
//                 className="flex justify-between py-2 border-b-1 border-gray-500 last:border-b-0"
//               >
//                 <h5 className="font-medium">{certificate.certificationName}</h5>
//                 <div className="flex items-center space-x-2">
//                   <p className="text-[12px] text-gray-400">
//                     {certificate.issuingOrganization}
//                   </p>
//                   {isEditing && (
//                     <button onClick={() => handleRemoveCertification(index)}>
//                       <CircleMinus
//                         size={20}
//                         className="text-red-500 hover:text-red-600"
//                       />
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-sm text-gray-200">No certifications provided.</p>
//           )}
//         </div>
//       </div>
//       <div>
//         <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
//           Document
//           {isEditing && (
//             <button onClick={() => handleOpenFileExplorer()} className="ml-1">
//               <CirclePlus
//                 size={20}
//                 className="text-green-500 hover:text-green-600"
//               />
//             </button>
//           )}
//           <input
//             type="file"
//             ref={fileInputRef}
//             onChange={handleFileChange}
//             style={{ display: "none" }}
//           />
//         </h3>
//         <div className="bg-gray-700 p-4 rounded-lg">
//           {mentorData.mentorDocuments ? (
//             <div className="flex justify-between py-2 border-b-1 border-gray-500">
//               <div className="flex flex-col">
//                 <h5 className="font-medium">
//                   {mentorData.mentorDocuments.fileName}
//                 </h5>
//                 <p className="text-[12px] text-gray-400">
//                   {mentorData.mentorDocuments.fileType}
//                 </p>
//               </div>
//               <button
//                 onClick={() =>
//                   handleViewDocument(
//                     mentorData.mentorDocuments!.documentContent?.fileContent ||
//                       "",
//                     mentorData.mentorDocuments!.fileType
//                   )
//                 }
//               >
//                 <Eye size={20} className="text-blue-500 hover:text-blue-600" />
//               </button>
//               {isEditing && (
//                 <button onClick={handleRemoveDocument}>
//                   <CircleMinus
//                     size={20}
//                     className="text-red-500 hover:text-red-600"
//                   />
//                 </button>
//               )}
//             </div>
//           ) : (
//             <p className="text-sm text-gray-200">No document provided.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );

//   if (loading) return <div>Loading...</div>;
//   if (!editedMentor) return <div>No data available</div>;

//   return (
//     <main className="container mx-auto py-8 px-4">
//       <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden">
//         <div className="p-8">
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-2xl font-semibold text-gray-200">
//               Your Application
//             </h1>
//             <button
//               onClick={() => setIsEditing(true)}
//               className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
//             >
//               Edit Application
//             </button>
//           </div>
//           <div className="space-y-6">
//             <div className="flex items-center space-x-4">
//               <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
//                 <span className="text-gray-400 text-4xl"></span>
//               </div>
//               <div>
//                 <div className="mt-1 flex items-center">
//                   <span className="bg-orange-500 text-xs text-white px-2.5 py-1 rounded-full capitalize">
//                     mentor
//                   </span>
//                   <span className="pr-1"></span>
//                   <span
//                     className={`text-xs text-white px-2.5 py-1 rounded-full capitalize ${
//                       mentorData.status === "Approved"
//                         ? "bg-green-500"
//                         : mentorData.status === "Rejected"
//                         ? "bg-red-500"
//                         : mentorData.status === "Pending"
//                         ? "bg-yellow-500"
//                         : mentorData.status === "Request Info"
//                         ? "bg-blue-500"
//                         : ""
//                     }`}
//                   >
//                     {mentorData.status}
//                   </span>
//                 </div>
//               </div>
//             </div>
//             <div>
//               <h3 className="text-sm font-medium text-gray-400 mb-2">
//                 Areas of expertise
//               </h3>
//             </div>
//             <div>
//               <h3 className="text-sm font-medium text-gray-400 mb-1">
//                 Professional skills
//               </h3>
//             </div>
//             <div>
//               <h3 className="text-sm font-medium text-gray-400 mb-1">
//                 Industry experience
//               </h3>
//             </div>
//             <div>
//               <h3 className="text-sm font-medium text-gray-400 mb-1">Email</h3>
//             </div>
//             <ExpandProfileSettings
//               additionalSettings={additionalSettingsContent}
//               isExpanded={isExpanded}
//               onToggle={() => setIsExpanded((prev) => !prev)}
//             />
//             <CustomModal
//               isOpen={openEducationDialog}
//               onClose={handleOnEducationClose}
//               title="Add Education"
//               size="md"
//             >
//               <EducationAddDialog
//                 onClose={handleOnEducationClose}
//                 onSubmit={handleAddNewEducation}
//                 initialData={
//                   newEducation.institutionName &&
//                   newEducation.fieldOfStudy &&
//                   newEducation.graduationYear
//                     ? (newEducation as MentorEducation)
//                     : undefined
//                 }
//                 actionButtonText="Add Education"
//                 isSubmitting={false}
//               />
//             </CustomModal>
//             <CustomModal
//               isOpen={openCertificationDialog}
//               onClose={handleOnCertificationClose}
//               title="Add Certification"
//               size="md"
//             >
//               <CertificationAddDialog
//                 onClose={handleOnCertificationClose}
//                 onSubmit={handleAddCertification}
//                 initialData={
//                   newCertification.certificationName &&
//                   newCertification.issuingOrganization
//                     ? (newCertification as MentorCertification)
//                     : undefined
//                 }
//                 actionButtonText="Add Certification"
//                 isSubmitting={false}
//               />
//             </CustomModal>
//             <CustomModal
//               isOpen={openWorkExperienceDialog}
//               onClose={handleOnWorkExperienceClose}
//               title="Add Work Experience"
//               size="md"
//             >
//               <WorkExperienceAddDialog
//                 onClose={handleOnWorkExperienceClose}
//                 onSubmit={handleAddWorkExperience}
//                 initialData={
//                   newWorkExperience.companyName &&
//                   newWorkExperience.position &&
//                   newWorkExperience.startDate
//                     ? (newWorkExperience as MentorWorkExperience)
//                     : undefined
//                 }
//                 actionButtonText="Add Work Experience"
//                 isSubmitting={false}
//               />
//             </CustomModal>
//           </div>
//           <div className="mt-4 flex justify-end space-x-2">
//             {isEditing ? (
//               <>
//                 <button
//                   onClick={handleSave}
//                   className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
//                 >
//                   Save
//                 </button>
//                 <button
//                   onClick={handleCancel}
//                   className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
//                 >
//                   Cancel
//                 </button>
//               </>
//             ) : (
//               <button
//                 onClick={() => handleSubmitApplication()}
//                 className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
//               >
//                 Submit
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };
// export default MentorStatusProfile;
import { useState, useEffect, useRef } from "react";
import { CirclePlus, CircleMinus, Eye } from "lucide-react";
import ExpandProfileSettings from "../../components/feature/ExpandProfileSettings";
import { mentorService } from "../../services/mentorapplication.service";
import {
  MentorCertification,
  MentorEducation,
  MentorWorkExperience,
  MentorCreateApplication,
  SupportingDocument,
} from "../../types/mentorapplication";
import CustomModal from "../../components/ui/Modal";
import EducationAddDialog from "../../components/dialog/Applications/EducationDialog";
import WorkExperienceAddDialog from "../../components/dialog/Applications/WorkExperienceDialog";
import CertificationAddDialog from "../../components/dialog/Applications/CertificationDialog";

interface MentorStatusType {
  mentorEducation: MentorEducation[];
  mentorWorkExperience: MentorWorkExperience[];
  certifications: MentorCertification[];
  mentorDocuments: SupportingDocument | null;
  submissionDate?: string;
  status?: string;
}

const MentorStatusProfile = () => {
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  const [openWorkExperienceDialog, setWorkExperienceDialog] = useState(false);
  const [openCertificationDialog, setCertificationDialog] = useState(false);
  // New state for document viewer modal
  const [openDocumentViewer, setOpenDocumentViewer] = useState(false);
  const [documentData, setDocumentData] = useState<{
    fileContent: string;
    fileType: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadMyApplication = async () => {
      try {
        setLoading(true);
        setError(null);

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

        const mappedData: MentorStatusType = {
          mentorEducation: response.educationDetails || [],
          mentorWorkExperience: response.workExperienceDetails || [],
          certifications: response.certifications || [],
          mentorDocuments: mappedDocument,
          status: response.status,
        };

        setMentorData(mappedData);
        setEditedMentor({ ...mappedData });
      } catch (error: any) {
        console.error("Error loading application data:", error);
        if (error.response?.status === 404) {
          console.log("No existing application found - starting fresh");
          setError(null);
        } else {
          setError(`Failed to load application: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };
    loadMyApplication();
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
    setWorkExperienceDialog(false);
    setNewWorkExperience({});
  };

  const handleOnCertificationClose = () => {
    setCertificationDialog(false);
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
      // Set document data and open modal
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
      setWorkExperienceDialog(false);
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
      setCertificationDialog(false);
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
      menttorDocuments: editedMentor.mentorDocuments,
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
              onClick={() => setWorkExperienceDialog(true)}
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
          {mentorData && mentorData.mentorWorkExperience?.length > 0 ? (
            mentorData.mentorWorkExperience.map((experience, index) => (
              <div
                key={index}
                className="flex justify-between py-2 border-b-1 border-gray-500 last:border-b-0"
              >
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
              onClick={() => setCertificationDialog(true)}
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
          {mentorData && mentorData.certifications?.length > 0 ? (
            mentorData.certifications.map((certificate, index) => (
              <div
                key={index}
                className="flex justify-between py-2 border-b-1 border-gray-500 last:border-b-0"
              >
                <h5 className="font-medium">
                  {certificate.certificationName}
                  <p className="text-[12px] text-gray-400">
                    {certificate.issuingOrganization}
                  </p>
                </h5>

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
                  }
                >
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
                <span className="text-gray-400 text-4xl"></span>
              </div>
              <div>
                <div className="mt-1 flex items-center">
                  <span className="bg-orange-500 text-xs text-white px-2.5 py-1 rounded-full capitalize">
                    mentor
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
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">
                Professional skills
              </h3>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">
                Industry experience
              </h3>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Email</h3>
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
                actionButtonText="Add Certification"
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
            {/* New Modal for Document Viewer */}
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
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => handleSubmitApplication()}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
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
