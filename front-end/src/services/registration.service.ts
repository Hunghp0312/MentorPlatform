import axiosInstance from "../configs/axiosInstance";
import {
  CreateProfileResponse,
  UserRegistrationRequest,
} from "../types/userRegister";
import { TopicOfInterest } from "../types/commonType";

export const submitRegistration = async (
  email: string,
  password: string,
  profile: string,
  preferences: string
) => {
  const payload = {
    email,
    password,
    profile,
    preferences,
  };

  console.log("Submitting registration:", payload);
};

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
      formData.append("ArenaOfExpertise", String(expertise));
    });
    formData.append("ProfessionalSkill", payload.profile.skills || "");
    formData.append(
      "IndustryExperience",
      payload.profile.industryExperience ?? ""
    );
    payload.profile.availability.forEach((availability) => {
      formData.append("Availability", String(availability));
    });
    payload.profile.preferredCommunication.forEach((communication) => {
      formData.append("CommunicationMethods", String(communication));
    });

    console.log("Creating profile with data:", formData);

    const response = await axiosInstance.post(
      "/Registration/create-profile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("Profile created successfully:", response.data);
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
    console.log("Preferences set successfully:", response.data);
    return response.data;
  },
};
