import { Link } from "react-router-dom";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  collapsed: boolean;
}
const NavItem = ({ icon, label, href, active, collapsed }: NavItemProps) => {
  return (
    <Link
      to={href}
      className={`
          flex items-center gap-2 px-3 py-2 rounded-md transition-colors
          ${
            active
              ? "bg-orange-500 text-white"
              : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }
          ${collapsed ? "justify-center" : ""}
        `}
    >
      <div>{icon}</div>
      {!collapsed && <span>{label}</span>}
    </Link>
  );
};
export default NavItem;
