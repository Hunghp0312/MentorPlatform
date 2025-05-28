import axiosInstance from "../configs/axiosInstance";
import { MentorCreateApplication } from "../types/mentorapplication";

export const mentorService = {
  async submitCompleteApplication(
    application: MentorCreateApplication,
    file: File
  ) {
    try {
      const formData = new FormData();
      const token = localStorage.getItem("accessToken");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.id;
        if (userId) {
          formData.append("UserId", userId);
        }
        console.log("User ID:", userId);
      }

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

  async getMyApplication() {
    const response = await axiosInstance.get(
      "/MentorApplications/my-application"
    );
    return response.data;
  },
};
