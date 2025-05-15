import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import NavItem from "./NavItem";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
}
interface NavbarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
  navItems?: Array<NavItemProps>;
}
export default function Navbar({
  collapsed,
  toggleSidebar,
  navItems,
}: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = () => {
    // Handle logout logic here
    localStorage.removeItem("accessToken");
    navigate("/login");
  };
  return (
    <aside
      className={`
        fixed left-0 top-0 h-full bg-gray-800 text-white transition-all duration-300 z-10
        ${collapsed ? "w-16" : "w-64"}
      `}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
        {!collapsed && (
          <h1 className="text-xl font-bold text-orange-500">Mentor Connect</h1>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-gray-800"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="p-2 space-y-1 mt-4">
        {navItems?.map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            active={location.pathname === item.href}
            collapsed={collapsed}
          />
        ))}
      </nav>
      <div className="absolute bottom-0 w-full p-2 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className={`
          flex items-center gap-2 px-3 py-2 rounded-md transition-colors

              text-gray-300 hover:bg-gray-800 hover:text-white
          ${collapsed ? "justify-center" : ""}
        `}
        >
          <div>
            <LogOut size={20} />
          </div>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
