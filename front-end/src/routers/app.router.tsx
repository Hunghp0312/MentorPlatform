import { useRoutes } from "react-router-dom";
import Layout from "../layout/Layout";
import ListCategory from "../pages/admin/ListCategory";
import ListCourse from "../pages/admin/ListCourse";
import { pathName } from "../constants/pathName";
import Registration from "../pages/auth/Registration";
import ListApproval from "../pages/admin/ListApproval";
import MentorStatusProfile from "../pages/mentor/MentorStatusProfile";

const AppRouter = () => {
  const routes = useRoutes([
    { path: pathName.register, element: <Registration /> },
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: pathName.home, element: <div>Home</div> },
        { path: pathName.category, element: <ListCategory /> },
        { path: pathName.course, element: <ListCourse /> },
        { path: pathName.approval, element: <ListApproval /> },
        { path: "mentorstatus", element: <MentorStatusProfile /> },
      ],
    },
  ]);
  return routes;
};
export default AppRouter;
