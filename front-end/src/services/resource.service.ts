import axiosInstance from "../configs/axiosInstance";
import { CreateResourceRequest } from "../types/resource";
export const resourceService = {
  //   async updateMentorApplicationStatus(request: MentorUpdateStatusRequest) {
  //     try {
  //       const response = await axiosInstance.put<MentorApplicationResponse>(
  //         "/MentorApplications/update-status",
  //         request
  //       );
  //       return response.data;
  //     } catch (error) {
  //       console.error("Error updating mentor application status:", error);
  //       throw error;
  //     }
  //   },
  async getPagedResources(
    query: string,
    typeOfResourceId: number,
    pageIndex: number,
    pageSize: number
  ) {
    const response = await axiosInstance.get("/Resource/resources", {
      params: {
        Query: query,
        PageIndex: pageIndex,
        PageSize: pageSize,
        TypeOfResourceId: typeOfResourceId,
      },
    });
    return response.data;
  },
  async getMentorApplicationDetail(mentorApplicationId: string) {
    try {
      const response = await axiosInstance.get(
        `/MentorApplications/mentor-application-detail/${mentorApplicationId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching mentor application detail:", error);
      throw error;
    }
  },

  async createResource(resource: CreateResourceRequest) {
    const response = await axiosInstance.post("/Resource", resource);
    return response.data;
  },

  async deleteResource(resourceId: string) {
    const response = await axiosInstance.delete(`/Resource/${resourceId}`);
    return response.data;
  },

  //   async

  //   async submitCompleteApplication(application: MentorCreateApplication) {
  //     try {
  //       const token = localStorage.getItem("accessToken");
  //       let userId = "";
  //       if (token) {
  //         const payload = JSON.parse(atob(token.split(".")[1]));
  //         userId = payload.id;
  //         console.log("User ID:", userId);
  //       }

  //       const requestData = {
  //         EducationDetails: application.mentorEducations.map((education) => ({
  //           InstitutionName: education.institutionName,
  //           FieldOfStudy: education.fieldOfStudy,
  //           GraduationYear: education.graduationYear?.toString(),
  //         })),
  //         WorkExperienceDetails: application.mentorWorkExperiences.map(
  //           (work) => ({
  //             CompanyName: work.companyName,
  //             Position: work.position,
  //             StartDate: work.startDate,
  //             EndDate: work.endDate,
  //           })
  //         ),
  //         Certifications: application.mentorCertifications.map((cert) => ({
  //           CertificationName: cert.certificationName,
  //           IssuingOrganization: cert.issuingOrganization,
  //         })),
  //       };

  //       const response = await axiosInstance.post(
  //         "/MentorApplications",
  //         requestData,
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );

  //       return response.data;
  //     } catch (error) {
  //       console.error("Error submitting mentor application:", error);
  //       throw error;
  //     }
  //   },
  //   async updateMyApplication(application: MentorCreateApplication) {
  //     try {
  //       const token = localStorage.getItem("accessToken");
  //       let userId = "";
  //       if (token) {
  //         const payload = JSON.parse(atob(token.split(".")[1]));
  //         userId = payload.id;
  //         console.log("User ID:", userId);
  //       }

  //       const requestData = {
  //         EducationDetails: application.mentorEducations.map((education) => ({
  //           InstitutionName: education.institutionName,
  //           FieldOfStudy: education.fieldOfStudy,
  //           GraduationYear: education.graduationYear?.toString(),
  //         })),
  //         WorkExperienceDetails: application.mentorWorkExperiences.map(
  //           (work) => ({
  //             CompanyName: work.companyName,
  //             Position: work.position,
  //             StartDate: work.startDate,
  //             EndDate: work.endDate,
  //           })
  //         ),
  //         Certifications: application.mentorCertifications.map((cert) => ({
  //           CertificationName: cert.certificationName,
  //           IssuingOrganization: cert.issuingOrganization,
  //         })),
  //       };

  //       const response = await axiosInstance.put(
  //         "/MentorApplications",
  //         requestData,
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );

  //       return response.data;
  //     } catch (error) {
  //       console.error("Error updating mentor application:", error);
  //       throw error;
  //     }
  //   },

  //   async getMyApplication() {
  //     const response = await axiosInstance.get(
  //       "/MentorApplications/my-application"
  //     );
  //     return response.data;
  //   },

  //   async uploadFile(file: File) {
  //     try {
  //       const formData = new FormData();
  //       formData.append("file", file, file.name);

  //       const response = await axiosInstance.post(
  //         "/SupportingDocuments",
  //         formData,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //           },
  //         }
  //       );

  //       return response.data;
  //     } catch (error) {
  //       console.error("Error uploading file:", error);
  //       throw error;
  //     }
  //   },
  //   async deleteFile(fileId: string) {
  //     try {
  //       const response = await axiosInstance.delete(
  //         `/SupportingDocuments/${fileId}`
  //       );
  //       return response.data;
  //     } catch (error) {
  //       console.error("Error deleting file:", error);
  //       throw error;
  //     }
  //   },
  //   async getMentorInfomation(mentorId: string) {
  //     try {
  //       const response = await axiosInstance.get(
  //         "/MentorApplications/my-application/" + mentorId
  //       );
  //       return response.data;
  //     } catch (error) {
  //       console.error("Error fetching mentor information:", error);
  //       throw error;
  //     }
  //   },
  //   async getAvailableMentors(
  //     query: string,
  //     pageIndex: number,
  //     pageSize: number,
  //     TopicId: number | null,
  //     ExpertiseIds: number[]
  //   ) {
  //     try {
  //       const params = new URLSearchParams();

  //       if (query) params.append("Query", query);
  //       params.append("PageIndex", pageIndex.toString());
  //       params.append("PageSize", pageSize.toString());
  //       if (TopicId !== null) params.append("TopicId", TopicId.toString());

  //       // Add ExpertiseIds as separate parameters with the same name
  //       ExpertiseIds.forEach((id) => {
  //         params.append("ExpertiseIds", id.toString());
  //       });

  //       const response = await axiosInstance.get(
  //         `/MentorApplications/available-mentors?${params}`
  //       );
  //       return response.data;
  //     } catch (error) {
  //       console.error("Error fetching available mentors:", error);
  //       throw error;
  //     }
  //   },
  //   async getMentorApplicationProfile(mentorId: string) {
  //     try {
  //       const res = await axiosInstance.get(
  //         `/MentorApplications/mentor-profile-detail/${mentorId}`
  //       );
  //       return res.data;
  //     } catch (error: unknown) {
  //       console.error("Error fetching mentor application profile:", error);
  //       throw error;
  //     }
  //   },
};
