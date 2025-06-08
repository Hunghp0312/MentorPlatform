import { useRoutes } from "react-router-dom";
import Layout from "../layout/Layout";
import AuthLayout from "../layout/AuthLayout";
import { pathName } from "../constants/pathName";

// Auth pages
import Registration from "../pages/auth/Registration";
import LoginPage from "../pages/auth/Login";
import ResetPasswordPage from "../pages/auth/ResetPassword";
import ForgotPasswordPage from "../pages/auth/ForgotPassword";
import OAuthCallback from "../pages/auth/OAuthCallback";

// Admin pages
import ListCategory from "../pages/admin/ListCategory";
import ListCourse from "../pages/admin/ListCourse";
import ListApproval from "../pages/admin/ListApproval";
import ListUser from "../pages/admin/ListUser";

// Mentor pages
import MentorStatusProfile from "../pages/mentor/MentorStatusProfile";

// Auth guards
import PrivateRoute from "./PrivateRoute";
import { RequireRole } from "./RequiredRoute";
import UnauthorizedPage from "../pages/auth/Unauthorized";
import EditUserPage from "../pages/user/EditUserPage";
import BookingSession from "../pages/session/BookingSession";
import MentorDashBoard from "../pages/mentor/MentorDashBoard";
import SessionManagement from "../pages/session/SessionManagement";
import MentorProfile from "../pages/mentor/MentorProfile";
import { EditableUserProfileRoute } from "./EditableUserProfileRoute";
import ProfileView from "../pages/user/ProfileView";
import MentorFinder from "../pages/learner/FinderMentor";
import AvailabilityManager from "../pages/mentor/MentorAvailability";
import LearnerSessionManagement from "../pages/learner/LearnerSessionManagement";
import AdminDashboard from "../pages/admin/AdminDashboard";
import CoursesPage from "../pages/learner/ListCourseEnrolled";
import CourseDetailPage from "../pages/learner/CourseEnrolledDetail";

// Shared
const HomePage = <div>Home</div>;

const AppRouter = () => {
  const routes = useRoutes([
    // Public Auth Routes
    {
      element: <AuthLayout />,
      children: [
        { path: pathName.register, element: <Registration /> },
        { path: pathName.login, element: <LoginPage /> },
        { path: pathName.resetPassword, element: <ResetPasswordPage /> },
        { path: pathName.forgotPassword, element: <ForgotPasswordPage /> },
        { path: pathName.oauthcallback, element: <OAuthCallback /> },
        { path: pathName.unauthorized, element: <UnauthorizedPage /> },
      ],
    },
    {
      element: (
        <EditableUserProfileRoute>
          <Layout />
        </EditableUserProfileRoute>
      ),
      children: [{ path: "profile/:id/edit", element: <EditUserPage /> }],
    },
    {
      element: (
        <PrivateRoute>
          <RequireRole roles={["Admin", "Learner", "Mentor"]}>
            <Layout />
          </RequireRole>
        </PrivateRoute>
      ),

      children: [
        { path: pathName.home, element: HomePage },
        { path: "profile/:id", element: <ProfileView /> },
      ],
    },
    {
      element: (
        <PrivateRoute>
          <RequireRole role="Admin">
            <Layout />
          </RequireRole>
        </PrivateRoute>
      ),
      children: [
        { path: pathName.category, element: <ListCategory /> },
        { path: pathName.adminCourse, element: <ListCourse /> },
        { path: pathName.approval, element: <ListApproval /> },
        { path: pathName.userList, element: <ListUser /> },
        { path: pathName.adminDashboard, element: <AdminDashboard /> },
      ],
    },

    // Mentor Routes
    {
      element: (
        <PrivateRoute>
          <RequireRole role="Mentor">
            <Layout />
          </RequireRole>
        </PrivateRoute>
      ),
      children: [
        { path: pathName.mentorStatus, element: <MentorStatusProfile /> },
        { path: pathName.mentorCourse, element: <ListCourse /> },
        { path: pathName.mentorAvailability, element: <AvailabilityManager /> },
        { path: pathName.sessionManagement, element: <SessionManagement /> },
        { path: pathName.mentorDashboard, element: <MentorDashBoard /> },
      ],
    },

    // Learner Routes
    {
      element: (
        <PrivateRoute>
          <RequireRole role="Learner">
            <Layout />
          </RequireRole>
        </PrivateRoute>
      ),
      children: [
        { path: pathName.bookingSession, element: <BookingSession /> },
        { path: pathName.mentorProfile, element: <MentorProfile /> },
        { path: pathName.findmentor, element: <MentorFinder /> },
        {path: "test",element: <CoursesPage/>},
        {path: "test1",element: <CourseDetailPage/>},
        {
          path: pathName.leanerSessionManagement,
          element: <LearnerSessionManagement />,
        },
        { path: pathName.learnerCourse, element: <ListCourse /> },
      ],
    },
  ]);

  return routes;
};

export default AppRouter;
