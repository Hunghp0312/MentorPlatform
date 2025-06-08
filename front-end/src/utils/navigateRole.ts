import { pathName } from "../constants/pathName";
import { getUserFromToken } from "./auth";

export function getDashboardPath() {
  const userInfo = getUserFromToken();
  if (userInfo?.role == "Admin") {
    return pathName.adminDashboard;
  } else if (userInfo?.role == "Mentor") {
    return pathName.mentorDashboard;
  } else if (userInfo?.role == "Learner") {
    return pathName.learnerDashboard;
  } else {
    return pathName.home;
  }
}
