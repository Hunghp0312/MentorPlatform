import axiosInstance from "../configs/axiosInstance";
import {
  CreateProfileResponse,
  UserRegistrationRequest,
} from "../types/userRegister";
import { TopicOfInterest } from "../types/commonType";

export const registrionService = {
  async createProfile(
    payload: UserRegistrationRequest
  ): Promise<CreateProfileResponse> {
    const formData = new FormData();

    formData.append("Email", payload.account.email);
    formData.append("Password", payload.account.password);
    formData.append("ConfirmPassword", payload.account.password);
    formData.append("PhoneNumber", payload.profile.contact);
    formData.append("FullName", payload.profile.fullName);
    formData.append("Bio", payload.profile.bio);
    formData.append("SelectedRole", payload.role.toString());
    formData.append("PhotoData", payload.profile.profilePictureFile || "");
    payload.profile.expertise.forEach((expertise) => {
      formData.append("AreaOfExpertise", String(expertise));
    });
    formData.append("ProfessionalSkill", payload.profile.skills || "");
    formData.append(
      "IndustryExperience",
      payload.profile.industryExperience ?? ""
    );
    payload.profile.availability.forEach((availability) => {
      formData.append("Availability", String(availability));
    });
    formData.append(
      "CommunicationMethod",
      payload.profile.preferredCommunication.toString()
    );

    const response = await axiosInstance.post(
      "/Registration/create-profile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data as CreateProfileResponse;
  },

  async setPreference(payload: UserRegistrationRequest, userId: string) {
    const request = {
      userGoal: payload.preferences.goal,
      topicOfInterestIds: payload.preferences.interestedTopics.map(
        (topic: TopicOfInterest) => topic
      ),
      sessionFequencyId: payload.preferences.sessionFrequency,
      sessionDurationId: payload.preferences.sessionDuration,
      learningStyleIds:
        "learnerDetails" in payload
          ? payload.learnerDetails.learningStyle
          : undefined,
      teachingApproachIds:
        "mentorDetails" in payload
          ? payload.mentorDetails.teachingApproach
          : undefined,
      privacyProfile: payload.preferences.privacySettings.isProfilePrivate,
      messagePermission: payload.preferences.privacySettings.allowMessages,
      notificationEnabled:
        payload.preferences.privacySettings.receiveNotifications,
    };

    const response = await axiosInstance.post(
      `/Registration/${userId}/set-preferences`,
      request
    );
    return response.data;
  },

  async checkEmail(payload: { email: string }) {
    const response = await axiosInstance.get("/Registration/check-email", {
      params: payload,
    });
    return response.data;
  },
};
