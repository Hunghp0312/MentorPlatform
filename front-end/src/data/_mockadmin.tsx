import { EnumType } from "../types/commonType";
import { admin } from "../types/admin";
export const role: EnumType = { id: 1, name: "admin" };
export const mockAdmins: admin = {
  id: 1,
  name: "Admin 1",
  role: role,
};
export default mockAdmins;
