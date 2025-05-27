import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-row items-center px-4 py-12 text-white">
      <div className="absolute top-8 left-8">
        <h1 className="text-3xl font-bold text-orange-500">Mentor Connect</h1>
      </div>

      {/* Children rendered here */}
      <div className="w-full flex justify-center items-start flex-1 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
