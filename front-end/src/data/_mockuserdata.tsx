import { ArenaOfExpertise } from "../types/mentor";
import { EnumType } from "../types/commonType";
import { User } from "../types/user";
export const role: EnumType = { id: 2, name: "Mentor" };
export const mockArenaOfExpertises: ArenaOfExpertise[] = [
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    name: "Software Development",
  },
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    name: "Data Science",
  },
  {
    id: "b2c3d4e5-f6a7-8901-bcde-f2345678901",
    name: "Cybersecurity",
  },
  {
    id: "c3d4e5f6-a7b8-9012-cdef-3456789012",
    name: "Artificial Intelligence",
  },
  {
    id: "d4e5f6a7-b8c9-0123-def0-4567890123",
    name: "Cloud Computing",
  },
];

export const mockUser1: User = {
  id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  email: "gQXqI@example.com",
  role: role,
  userProfile: {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d478",
    photoData: "https://randomuser.me/api/portraits/women/32.jpg",
    fullName: "Sarah Johnson",
    bio: "Nice to meet you",
    professionalSkill: "Data Science, Machine Learning, Python",
    industryExperience: "5 years at Tech Corp, 3 years teaching",
    availabilityData: [
      { id: 1, name: "Monday" },
      { id: 2, name: "Tuesday" },
      { id: 3, name: "Wednesday" },
      { id: 4, name: "Thursday" },
    ],
    communicationMethod: { id: 1, name: "Email" },
  },
  mentorApplications: {
    applicantId: "1",
    applicationStatus: { id: 1, name: "pending" },
    mentorEducations: [
      {
        institutionName: "ABC University", //nho
        fieldOfStudy: "Computer Science", //to
        graduationYear: 2020,
      },
      {
        institutionName: "XYZ College",
        fieldOfStudy: "Mathematics",
        graduationYear: 2018,
      },
    ],
    mentorWorkExperiences: [
      {
        companyName: "ABC Corp", //nho
        position: "Software Engineer", //to
        startDate: "2021-01-01",
        endDate: "2022-12-31",
      },
      {
        companyName: "XYZ Inc",
        position: "Data Analyst",
        startDate: "2019-01-01",
        endDate: "2020-12-31",
      },
    ],
    mentorCertifications: [
      {
        certificationName: "AWS Certified Cloud Practitioner",
        issuingOrganization: "Microsoft",
      },
      {
        certificationName: "Asp.net core", //to
        issuingOrganization: "Microsoft", //nho
      },
    ],
  },
  userArenaOfExpertises: [
    {
      userId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      arenaOfExpertise: {
        id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        name: "Data Science",
      },
    },
    {
      userId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      arenaOfExpertise: {
        id: "c3d4e5f6-a7b8-9012-cdef-3456789012",
        name: "Artificial Intelligence",
      },
    },
    {
      userId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      arenaOfExpertise: {
        id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        name: "Software Development",
      },
    },
    {
      userId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      arenaOfExpertise: {
        id: "d4e5f6a7-b8c9-0123-def0-4567890123",
        name: "Cloud Computing",
      },
    },
  ],
};
export default mockUser1;
