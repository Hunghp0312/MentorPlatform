import { useState } from "react";
import Navbar from "./Navbar";
import { Book, BookCopy } from "lucide-react";
import { Outlet } from "react-router-dom";

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
  ];
  return (
    <div className="flex min-h-screen bg-gray-950">
      <Navbar
        collapsed={collapsed}
        toggleSidebar={toggleSidebar}
        navItems={navItems}
      />
      <main
        className={`flex-1 transition-all duration-300 ${
          collapsed ? "ml-16" : "ml-64"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
