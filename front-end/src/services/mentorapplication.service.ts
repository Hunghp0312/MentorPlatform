import axiosInstance from "../configs/axiosInstance";
import { MentorCreateApplication } from "../types/mentorapplication";

export const mentorService = {
  async submitCompleteApplication(application: MentorCreateApplication) {
    try {
      const token = localStorage.getItem("accessToken");
      let userId = "";
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userId = payload.id;
        console.log("User ID:", userId);
      }

      const requestData = {
        EducationDetails: application.mentorEducations.map((education) => ({
          InstitutionName: education.institutionName,
          FieldOfStudy: education.fieldOfStudy,
          GraduationYear: education.graduationYear?.toString(),
        })),
        WorkExperienceDetails: application.mentorWorkExperiences.map(
          (work) => ({
            CompanyName: work.companyName,
            Position: work.position,
            StartDate: work.startDate,
            EndDate: work.endDate,
          })
        ),
        Certifications: application.mentorCertifications.map((cert) => ({
          CertificationName: cert.certificationName,
          IssuingOrganization: cert.issuingOrganization,
        })),
      };

      const response = await axiosInstance.post(
        "/MentorApplications",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error submitting mentor application:", error);
      throw error;
    }
  },
  async updateMyApplication(application: MentorCreateApplication) {
    try {
      const token = localStorage.getItem("accessToken");
      let userId = "";
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userId = payload.id;
        console.log("User ID:", userId);
      }

      const requestData = {
        EducationDetails: application.mentorEducations.map((education) => ({
          InstitutionName: education.institutionName,
          FieldOfStudy: education.fieldOfStudy,
          GraduationYear: education.graduationYear?.toString(),
        })),
        WorkExperienceDetails: application.mentorWorkExperiences.map(
          (work) => ({
            CompanyName: work.companyName,
            Position: work.position,
            StartDate: work.startDate,
            EndDate: work.endDate,
          })
        ),
        Certifications: application.mentorCertifications.map((cert) => ({
          CertificationName: cert.certificationName,
          IssuingOrganization: cert.issuingOrganization,
        })),
      };

      const response = await axiosInstance.put(
        "/MentorApplications",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error updating mentor application:", error);
      throw error;
    }
  },

  async getMyApplication() {
    const response = await axiosInstance.get(
      "/MentorApplications/my-application"
    );
    return response.data;
  },

  async uploadFile(file: File) {
    try {
      const formData = new FormData();
      formData.append("file", file, file.name);

      const response = await axiosInstance.post(
        "/SupportingDocuments",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  },
  async deleteFile(fileId: string) {
    try {
      const response = await axiosInstance.delete(
        `/SupportingDocuments/${fileId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  },
};
