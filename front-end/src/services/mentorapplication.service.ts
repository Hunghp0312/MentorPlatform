// import axiosInstance from "../configs/axiosInstance";
// import { MentorCreateApplication } from "../types/mentorapplication";
// export const menterService = {
//   async submitCompleteApplication(application: MentorCreateApplication) {
//     try {
//       const formData = new FormData();
//       application.mentorEducations.forEach((education, index) => {
//         formData.append(
//           `EducationDetails[${index}].InstitutionName`,
//           education.institutionName
//         );
//         formData.append(
//           `EducationDetails[${index}].FieldOfStudy`,
//           education.fieldOfStudy
//         );
//         if (education.graduationYear) {
//           formData.append(
//             `EducationDetails[${index}].GraduationYear`,
//             education.graduationYear.toString()
//           );
//         }
//       });
//       application.mentorWorkExperiences.forEach((work, index) => {
//         formData.append(
//           `WorkExperienceDetails[${index}].CompanyName`,
//           work.companyName
//         );
//         formData.append(
//           `WorkExperienceDetails[${index}].Position`,
//           work.position
//         );
//         formData.append(
//           `WorkExperienceDetails[${index}].StartDate`,
//           work.startDate
//         );
//         if (work.endDate) {
//           formData.append(
//             `WorkExperienceDetails[${index}].EndDate`,
//             work.endDate
//           );
//         }
//       });
//       application.mentorCertifications.forEach((cert, index) => {
//         formData.append(
//           `Certifications[${index}].CertificationName`,
//           cert.certificationName
//         );
//         formData.append(
//           `Certifications[${index}].IssuingOrganization`,
//           cert.issuingOrganization
//         );
//       });
//       // Append supporting document (assuming first document in the array)
//       if (application.menttorDocuments.length > 0) {
//         const doc = application.menttorDocuments[0];
//         // Convert base64 file content to Blob
//         const byteString = atob(doc.documentContent?.fileContent || "");
//         const byteArray = new Uint8Array(byteString.length);
//         for (let i = 0; i < byteString.length; i++) {
//           byteArray[i] = byteString.charCodeAt(i);
//         }
//         const blob = new Blob([byteArray], { type: doc.fileType });
//         formData.append("SupportingDocument", blob, doc.fileName);
//       }

//       const response = await axiosInstance.post(
//         "/MentorApplications",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error submitting mentor application:", error);
//       throw error;
//     }
//   },
// };

import axiosInstance from "../configs/axiosInstance";
import { MentorCreateApplication } from "../types/mentorapplication";

export const mentorService = {
  async submitCompleteApplication(
    application: MentorCreateApplication,
    file: File
  ) {
    try {
      const formData = new FormData();

      // Append education details
      application.mentorEducations.forEach((education, index) => {
        formData.append(
          `EducationDetails[${index}].InstitutionName`,
          education.institutionName
        );
        formData.append(
          `EducationDetails[${index}].FieldOfStudy`,
          education.fieldOfStudy
        );
        if (education.graduationYear) {
          formData.append(
            `EducationDetails[${index}].GraduationYear`,
            education.graduationYear.toString()
          );
        }
      });

      // Append work experience details
      application.mentorWorkExperiences.forEach((work, index) => {
        formData.append(
          `WorkExperienceDetails[${index}].CompanyName`,
          work.companyName
        );
        formData.append(
          `WorkExperienceDetails[${index}].Position`,
          work.position
        );
        formData.append(
          `WorkExperienceDetails[${index}].StartDate`,
          work.startDate
        );
        if (work.endDate) {
          formData.append(
            `WorkExperienceDetails[${index}].EndDate`,
            work.endDate
          );
        }
      });
      // application.mentorWorkExperiences.forEach((work, index) => {
      //   formData.append(
      //     `WorkExperienceDetails[${index}].CompanyName`,
      //     work.companyName
      //   );
      //   formData.append(
      //     `WorkExperienceDetails[${index}].Position`,
      //     work.position
      //   );
      //   const startDate = new Date(work.startDate);
      //   formData.append(
      //     `WorkExperienceDetails[${index}].StartDate`,
      //     startDate.toISOString().split("T")[0] // Format as "yyyy-MM-dd"
      //   );
      //   if (work.endDate) {
      //     const endDate =
      //       work.endDate === "Present" ? new Date() : new Date(work.endDate);
      //     formData.append(
      //       `WorkExperienceDetails[${index}].EndDate`,
      //       endDate.toISOString().split("T")[0] // Format as "yyyy-MM-dd"
      //     );
      //   }
      // });
      // Append certification details
      application.mentorCertifications.forEach((cert, index) => {
        formData.append(
          `Certifications[${index}].CertificationName`,
          cert.certificationName
        );
        formData.append(
          `Certifications[${index}].IssuingOrganization`,
          cert.issuingOrganization
        );
      });

      // Append single supporting document
      formData.append("SupportingDocument", file, file.name);

      const response = await axiosInstance.post(
        "/MentorApplications",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error submitting mentor application:", error);
      throw error;
    }
  },
};
