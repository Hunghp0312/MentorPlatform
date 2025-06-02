import { JSX, useState } from "react";
import Navbar from "./Navbar";
import { Book, BookCopy, User, UserCheck } from "lucide-react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUserFromToken } from "../utils/auth";
import { pathName } from "../constants/pathName";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const decodedToken = getUserFromToken();
  const role = decodedToken?.role;

  const navItemsByRole: Record<
    string,
    { icon: JSX.Element; label: string; href: string }[]
  > = {
    Admin: [
      {
        icon: <User size={20} />,
        label: "Profile",
        href: `${pathName.profile}/${decodedToken?.id}`,
      },
      {
        icon: <Book size={20} />,
        label: "Categories",
        href: pathName.category,
      },
      { icon: <BookCopy size={20} />, label: "Courses", href: pathName.course },
      {
        icon: <UserCheck size={20} />,
        label: "Approvals",
        href: pathName.approval,
      },
      {
        icon: <UserCheck size={20} />,
        label: "User Management",
        href: pathName.userList,
      },
    ],
    Mentor: [
      {
        icon: <User size={20} />,
        label: "Profile",
        href: `${pathName.profile}/${decodedToken?.id}`,
      },
      {
        icon: <UserCheck size={20} />,
        label: "Mentor Status",
        href: pathName.mentorStatus,
      },
      {
        icon: <UserCheck size={20} />,
        label: "Mentor Availability",
        href: "/mentor/availability",
      },
    ],
    Learner: [
      {
        icon: <User size={20} />,
        label: "Profile",
        href: `${pathName.profile}/${decodedToken?.id}`,
      },
    ],
  };

  // Fallback empty nav if no role or unknown role
  const navItems = role && navItemsByRole[role] ? navItemsByRole[role] : [];

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Navbar
        collapsed={collapsed}
        toggleSidebar={toggleSidebar}
        navItems={navItems}
      />
      <main
        className={`flex-1 transition-all duration-300 overflow-y-auto p-6 ${
          collapsed ? "ml-16" : "ml-64"
        }`}
      >
        <div className="bg-gray-900 min-h-screen text-gray-200">
          <Outlet />
        </div>
      </main>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
      />
    </div>
  );
}
