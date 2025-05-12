import { useRoutes } from "react-router-dom";
import Layout from "./layout/Layout";

const AppRouter = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "", element: <div>Home</div> },
        { path: "category", element: <div>Home</div> },
        { path: "course", element: <div>Book Borrowing</div> },
      ],
    },
  ]);
  return routes;
};
export default AppRouter;
