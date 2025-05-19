import { useRoutes } from "react-router-dom";
import Layout from "../layout/Layout";
import ListCategory from "../pages/admin/ListCategory";
import ListCourse from "../pages/admin/ListCourse";
import ListApproval from "../pages/admin/ListApproval";

const AppRouter = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "", element: <div>Home</div> },
        { path: "category", element: <ListCategory /> },
        { path: "course", element: <ListCourse /> },
        { path: "approval", element: <ListApproval /> },
      ],
    },
  ]);
  return routes;
};
export default AppRouter;
