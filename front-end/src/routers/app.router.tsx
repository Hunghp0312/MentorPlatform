import { useRoutes } from "react-router-dom";
import Layout from "../layout/Layout";
import ListCategory from "../pages/admin/ListCategory";

const AppRouter = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "", element: <div>Home</div> },
        { path: "category", element: <ListCategory/> },
        { path: "course", element: <div>Book Borrowing</div> },
      ],
    },
  ]);
  return routes;
};
export default AppRouter;
