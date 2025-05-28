import React from "react";
import { useNavigate } from "react-router-dom";
import { pathName } from "../../constants/pathName";

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-xl p-8 space-y-6 text-center">
      <h2 className="text-3xl font-bold text-slate-100">Unauthorized Access</h2>
      <p className="text-slate-400">
        You do not have permission to view this page.
      </p>
      <button
        onClick={() => navigate(pathName.login)}
        className="mt-6 w-full py-2.5 px-4 text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600">
        Go to Login
      </button>
    </div>
  );
};

export default UnauthorizedPage;
