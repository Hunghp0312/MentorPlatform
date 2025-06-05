import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Edit, Calendar, Clock, User } from "lucide-react";

// Services
import { userService } from "../../services/user.service";
import { pathName } from "../../constants/pathName";
import { getUserFromToken } from "../../utils/auth";

// Types
import { EnumType } from "../../types/commonType";
import { UserViewResponse } from "../../types/user";
import LoadingOverlay from "../../components/loading/LoadingOverlay";

const ProfileView = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserViewResponse>();
  const decodedToken = getUserFromToken();
  const isEditable = decodedToken?.id === id || decodedToken?.role === "Admin";
  const isOwnProfile = decodedToken?.id === id;
  // Load user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await userService.getUserById(id!);
        // Process the response
        const processedData = {
          ...response,
        };

        setUserData(processedData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-900 px-4 py-8">
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
            <p>
              User profile not found or you don't have permission to view it.
            </p>
            <button
              onClick={() => {
                if (decodedToken?.role === "Admin") navigate(pathName.userList);
                else navigate(pathName.home);
              }}
              className="mt-4 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-8">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <button
                onClick={() => {
                  if (decodedToken?.role === "Admin")
                    navigate(pathName.userList);
                  else navigate(pathName.home);
                }}
                className="flex items-center text-gray-300 mb-4 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>Back</span>
              </button>
              <h1 className="text-2xl font-bold text-white">User Profile</h1>
            </div>
            {isEditable && (
              <button
                onClick={() => navigate(`edit`)}
                className="flex items-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>

          {/* Profile Content */}
          <div className="space-y-8 text-white">
            {/* Basic Information Section */}
            <section className="border-b border-gray-700 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Picture */}
                <div className="md:col-span-1">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-gray-600">
                      {userData.photoData ? (
                        <img
                          src={userData.photoData}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <User className="h-16 w-16 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <h2 className="text-xl font-semibold text-center">
                      {userData.fullName}
                      <span className="block text-sm text-gray-400 font-normal mt-1"></span>
                    </h2>

                    {!isOwnProfile && (
                      <button className="flex items-center justify-center gap-2 w-full py-2 bg-orange-500 hover:bg-orange-600 rounded-md transition-colors">
                        <Mail className="h-4 w-4" />
                        <span>Contact</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Profile Details */}
                <div className="md:col-span-2">
                  {isOwnProfile && (
                    <div>
                      <h3 className="text-md font-medium text-gray-400">
                        Email
                      </h3>
                      <p className="mt-1 text-gray-200">{userData.email}</p>
                    </div>
                  )}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-md font-medium text-gray-400">Bio</h3>
                      <p className="mt-1 text-gray-200">
                        {userData.bio || "No bio provided"}
                      </p>
                    </div>

                    {userData.professionalSkill && (
                      <div>
                        <h3 className="text-md font-medium text-gray-400">
                          Professional Skills
                        </h3>
                        <p className="mt-1 text-gray-200">
                          {userData.professionalSkill}
                        </p>
                      </div>
                    )}

                    {userData.industryExperience && (
                      <div>
                        <h3 className="text-md font-medium text-gray-400">
                          Industry Experience
                        </h3>
                        <p className="mt-1 text-gray-200">
                          {userData.industryExperience}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Areas of Expertise Section */}
            <section className="border-b border-gray-700 pb-6">
              <h3 className="text-md font-medium text-gray-400 mb-2">
                Areas of Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {userData.areaOfExpertises.map(
                  (label: EnumType, index: number) => (
                    <span
                      key={index}
                      className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm"
                    >
                      {label.name}
                    </span>
                  )
                )}
                {userData.areaOfExpertises.length === 0 && (
                  <span className="text-gray-400">
                    No expertise areas specified
                  </span>
                )}
              </div>
            </section>

            {/* Teaching and Learning Preferences Section */}
            <section className="border-b border-gray-700 pb-6">
              <div className="space-y-6">
                {userData.role.name === "Mentor" && (
                  <div>
                    <h3 className="text-md font-medium text-gray-400 mb-2">
                      Teaching Approaches
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {userData.teachingApproaches.map(
                        (label: EnumType, index: number) => (
                          <span
                            key={index}
                            className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm"
                          >
                            {label.name}
                          </span>
                        )
                      )}
                      {userData.teachingApproaches.length === 0 && (
                        <span className="text-gray-400">
                          No teaching approaches specified
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {userData.role.name === "Learner" && (
                  <div>
                    <h3 className="text-md font-medium text-gray-400 mb-2">
                      Learning Styles
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {userData.learningStyles.map(
                        (label: EnumType, index: number) => (
                          <span
                            key={index}
                            className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm"
                          >
                            {label.name}
                          </span>
                        )
                      )}
                      {userData.learningStyles.length === 0 && (
                        <span className="text-gray-400">
                          No learning styles specified
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-md font-medium text-gray-400 mb-2">
                    Availability
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {userData.profileAvailabilities.map(
                      (label: EnumType, index: number) => (
                        <span
                          key={index}
                          className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm"
                        >
                          {label.name}
                        </span>
                      )
                    )}
                    {userData.profileAvailabilities.length === 0 && (
                      <span className="text-gray-400">
                        No availability specified
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-400 mb-2">
                    Preferred Communication
                  </h3>
                  <span className="bg-orange-500/20 border border-orange-500 text-white px-3 py-1 rounded-md text-sm inline-block">
                    {userData.communicationMethod.name}
                  </span>
                </div>
              </div>
            </section>

            {/* Topics and Goals Section */}
            <section className="border-b border-gray-700 pb-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-gray-400 mb-2">
                    Topics of Interest
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {userData.topicOfInterests.map(
                      (label: EnumType, index: number) => (
                        <span
                          key={index}
                          className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm"
                        >
                          {label.name}
                        </span>
                      )
                    )}
                    {userData.topicOfInterests.length === 0 && (
                      <span className="text-gray-400">
                        No topics of interest specified
                      </span>
                    )}
                  </div>
                </div>

                {userData.userGoal && (
                  <div>
                    <h3 className="text-md font-medium text-gray-400 mb-2">
                      {userData.role.name === "Mentor"
                        ? "Motivation Statement"
                        : "What do you hope to learn?"}
                    </h3>
                    <p className="text-gray-200">{userData.userGoal}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <span className="text-gray-400 text-sm">
                        Session Frequency
                      </span>
                      <p className="text-gray-200">
                        {userData.sessionFrequency.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <span className="text-gray-400 text-sm">
                        Session Duration
                      </span>
                      <p className="text-gray-200">
                        {userData.sessionDuration.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Privacy Settings - Only visible to profile owner */}
            {isOwnProfile && (
              <section>
                <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded border border-gray-600 mr-3 mt-0.5 flex-shrink-0 flex items-center justify-center">
                      {userData.privacyProfile && (
                        <div className="h-3 w-3 rounded-sm bg-orange-500"></div>
                      )}
                    </div>
                    <div>
                      <span className="text-gray-200">Private profile</span>
                      <p className="text-xs text-gray-400">
                        Only approved connections can view your full profile
                        details
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded border border-gray-600 mr-3 mt-0.5 flex-shrink-0 flex items-center justify-center">
                      {userData.messagePermission && (
                        <div className="h-3 w-3 rounded-sm bg-orange-500"></div>
                      )}
                    </div>
                    <div>
                      <span className="text-gray-200">Allow messages</span>
                      <p className="text-xs text-gray-400">
                        Others can initiate contact with you through messages
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded border border-gray-600 mr-3 mt-0.5 flex-shrink-0 flex items-center justify-center">
                      {userData.notificationsEnabled && (
                        <div className="h-3 w-3 rounded-sm bg-orange-500"></div>
                      )}
                    </div>
                    <div>
                      <span className="text-gray-200">
                        Receive notifications
                      </span>
                      <p className="text-xs text-gray-400">
                        Get email and in-app notifications for messages, session
                        requests, and updates
                      </p>
                    </div>
                  </li>
                </ul>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
