import { useRoutes } from "react-router-dom";
import Layout from "../layout/Layout";
import ListCategory from "../pages/admin/ListCategory";
import ListCourse from "../pages/admin/ListCourse";
import { pathName } from "../constants/pathName";
import Registration from "../pages/auth/Registration";
import ListApproval from "../pages/admin/ListApproval";
import LoginPage from "../pages/auth/Login";
import ResetPasswordPage from "../pages/auth/ResetPassword";
import AuthLayout from "../layout/AuthLayout";
import ForgotPasswordPage from "../pages/auth/ForgotPassword";

const AppRouter = () => {
  const routes = useRoutes([
    {
      element: <AuthLayout />,
      children: [
        { path: pathName.register, element: <Registration /> },
        { path: pathName.login, element: <LoginPage /> },
        { path: pathName.resetPassword, element: <ResetPasswordPage /> },
        { path: pathName.forgotPassword, element: <ForgotPasswordPage /> },
      ],
    },
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: pathName.home, element: <div>Home</div> },
        { path: pathName.category, element: <ListCategory /> },
        { path: pathName.course, element: <ListCourse /> },
        { path: pathName.approval, element: <ListApproval /> },
      ],
    },
  ]);
  return routes;
};
export default AppRouter;
