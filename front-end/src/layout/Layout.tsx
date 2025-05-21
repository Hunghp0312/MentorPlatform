import { useState } from "react";
import Navbar from "./Navbar";
import { Book, BookCopy, UserCheck } from "lucide-react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  const navItems = [
    { icon: <Book size={20} />, label: "Categories", href: "/category" },
    {
      icon: <BookCopy size={20} />,
      label: "Courses",
      href: "/course",
    },
    {
      icon: <UserCheck size={20} />,
      label: "Approvals",
      href: "/approval",
    },
  ];
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
