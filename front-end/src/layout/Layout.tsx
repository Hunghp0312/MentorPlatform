import { JSX, useState } from "react";
import Navbar from "./Navbar";
import {
  AlarmClockCheck,
  Book,
  BookCopy,
  CalendarDays,
  ChartBar,
  Search,
  User,
  UserCheck,
  FileBox,
} from "lucide-react";
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
  const isActive = decodedToken?.isActive;
  const isActiveMentorField = [
    {
      icon: <BookCopy size={20} />,
      label: "Courses",
      href: pathName.mentorCourse,
    },
    {
      icon: <CalendarDays size={20} />,
      label: "Mentor Availability",
      href: "/mentor/availability",
    },
    {
      icon: <AlarmClockCheck size={20} />,
      label: "Session Management",
      href: `/session-management`,
    },
    {
      icon: <FileBox size={20} />,
      label: "Resources",
      href: pathName.mentorResource,
    },
  ];
  const navItemsByRole: Record<
    string,
    { icon: JSX.Element; label: string; href: string }[]
  > = {
    Admin: [
      {
        icon: <ChartBar size={20} />,
        label: "Dashboard",
        href: pathName.adminDashboard,
      },
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
      {
        icon: <BookCopy size={20} />,
        label: "Courses",
        href: pathName.adminCourse,
      },
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
      {
        icon: <FileBox size={20} />,
        label: "Resources",
        href: pathName.adminResource,
      },
    ],
    Mentor: [
      ...(isActive === "1"
        ? [
            {
              icon: <Book size={20} />,
              label: "Dashboard",
              href: pathName.mentorDashboard,
            },
          ]
        : []),
      {
        icon: <User size={20} />,
        label: "Profile",
        href: `${pathName.profile}/${decodedToken?.id}`,
      },
      {
        icon: <UserCheck size={20} />,
        label: "My Application",
        href: pathName.mentorStatus,
      },
      ...(isActive === "1" ? isActiveMentorField : []),
    ],
    Learner: [
      {
        icon: <Book size={20} />,
        label: "Dashboard",
        href: pathName.learnerDashboard,
      },
      {
        icon: <User size={20} />,
        label: "Profile",
        href: `${pathName.profile}/${decodedToken?.id}`,
      },
      {
        icon: <Search size={20} />,
        label: "Find Mentor",
        href: pathName.findmentor,
      },
      {
        icon: <AlarmClockCheck size={20} />,
        label: "My Sessions",
        href: pathName.leanerSessionManagement,
      },
      {
        icon: <BookCopy size={20} />,
        label: "All Courses",
        href: pathName.learnerAllCourses,
      },
      {
        icon: <BookCopy size={20} />,
        label: "My Courses",
        href: pathName.learnerCourse,
      },
      {
        icon: <FileBox size={20} />,
        label: "Resources",
        href: pathName.learnerResource,
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
