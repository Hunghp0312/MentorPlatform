import {
  UserFilterType,
  UserSortConfigType,
  UserStatusName,
  UserType,
  UserRoleName,
  IdNameType,
  UserUpdateType,
} from "../types/userRole.d";

const mockUsers: UserType[] = [
  {
    id: "1",
    fullName: "Alice Wonderland",
    email: "alice@example.com",
    avatar: "https://i.pravatar.cc/150?u=alice",
    role: { id: 101, name: UserRoleName.MENTOR },
    status: { id: 202, name: UserStatusName.PENDING },
    joinDate: "2023-01-15T10:00:00Z",
    lastActiveDate: "2023-05-20T10:00:00Z",
    areaOfExpertise: [
      { id: 301, name: "Software Development" },
      { id: 302, name: "Agile Methodologies" },
    ],
  },
  {
    id: "2",
    fullName: "Bob The Builder",
    email: "bob@example.com",
    avatar: "https://i.pravatar.cc/150?u=bob",
    role: { id: 102, name: UserRoleName.LEARNER },
    status: { id: 201, name: UserStatusName.ACTIVE },
    joinDate: "2023-02-20T11:00:00Z",
    lastActiveDate: "2023-05-25T11:00:00Z",
    areaOfExpertise: [],
  },
  {
    id: "3",
    fullName: "Charlie Admin",
    email: "charlie@example.com",
    avatar: "https://i.pravatar.cc/150?u=charlie",
    role: { id: 103, name: UserRoleName.ADMIN },
    status: { id: 201, name: UserStatusName.ACTIVE },
    joinDate: "2022-12-01T09:00:00Z",
    lastActiveDate: "2023-05-28T09:00:00Z",
    areaOfExpertise: [{ id: 303, name: "System Administration" }],
  },
  {
    id: "4",
    fullName: "Diana Prince",
    email: "diana@example.com",
    role: { id: 101, name: UserRoleName.MENTOR },
    status: { id: 201, name: UserStatusName.ACTIVE },
    joinDate: "2023-03-10T14:00:00Z",
    lastActiveDate: "2023-05-27T14:00:00Z",
    areaOfExpertise: [{ id: 304, name: "Leadership" }],
  },
  {
    id: "5",
    fullName: "Evan Almighty",
    email: "evan@example.com",
    role: { id: 102, name: UserRoleName.LEARNER },
    status: { id: 203, name: UserStatusName.DEACTIVATED },
    joinDate: "2023-04-05T16:00:00Z",
    lastActiveDate: "2023-04-10T16:00:00Z",
    areaOfExpertise: [],
  },
];

const getStatusObjectByName = (
  statusName: UserStatusName
): IdNameType<number, UserStatusName> => {
  switch (statusName) {
    case UserStatusName.ACTIVE:
      return { id: 201, name: UserStatusName.ACTIVE };
    case UserStatusName.PENDING:
      return { id: 202, name: UserStatusName.PENDING };
    case UserStatusName.DEACTIVATED:
      return { id: 203, name: UserStatusName.DEACTIVATED };
    default:
      throw new Error(`Unknown status name: ${statusName}`);
  }
};

const getRoleObjectById = (
  roleId: number
): IdNameType<number, UserRoleName> | undefined => {
  return {
    101: { id: 101, name: UserRoleName.MENTOR },
    102: { id: 102, name: UserRoleName.LEARNER },
    103: { id: 103, name: UserRoleName.ADMIN },
  }[roleId];
};

function getNestedValue<T>(obj: T, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (typeof acc === "object" && acc !== null && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

const getPaginatedUsers = async (
  searchTerm: string,
  filter: UserFilterType,
  sortConfig: UserSortConfigType | null,
  pageIndex: number,
  pageSize: number
): Promise<{
  items: UserType[];
  totalItems: number;
  counts: Record<UserRoleName | "All", number>;
}> => {
  console.log("Fetching users with (updated types - int IDs):", {
    searchTerm,
    filter,
    sortConfig,
    pageIndex,
    pageSize,
  });
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filteredUsers = mockUsers.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filter.roleName) {
    filteredUsers = filteredUsers.filter(
      (user) => user.role.name === filter.roleName
    );
  }

  const counts: Record<UserRoleName | "All", number> = {
    All: mockUsers.length,
    [UserRoleName.MENTOR]: mockUsers.filter(
      (u) => u.role.name === UserRoleName.MENTOR
    ).length,
    [UserRoleName.LEARNER]: mockUsers.filter(
      (u) => u.role.name === UserRoleName.LEARNER
    ).length,
    [UserRoleName.ADMIN]: mockUsers.filter(
      (u) => u.role.name === UserRoleName.ADMIN
    ).length,
  };

  if (sortConfig) {
    filteredUsers.sort((a, b) => {
      const valA = getNestedValue(a, sortConfig.key);
      const valB = getNestedValue(b, sortConfig.key);

      if (valA === undefined || valB === undefined) return 0;

      let comparison = 0;
      if (typeof valA === "string" && typeof valB === "string") {
        comparison = valA.localeCompare(valB);
      } else if (typeof valA === "number" && typeof valB === "number") {
        comparison = valA - valB;
      }

      return sortConfig.direction === "desc" ? -comparison : comparison;
    });
  }

  const totalItems = filteredUsers.length;
  const paginatedItems = filteredUsers.slice(
    (pageIndex - 1) * pageSize,
    pageIndex * pageSize
  );

  return { items: paginatedItems, totalItems, counts };
};

const updateUserStatus = async (
  userId: string,
  newStatusName: UserStatusName
): Promise<UserType> => {
  console.log(`Updating user ${userId} status to ${newStatusName}`);
  await new Promise((resolve) => setTimeout(resolve, 300));
  const userIndex = mockUsers.findIndex((u) => u.id === userId);
  if (userIndex === -1) throw new Error("User not found");

  mockUsers[userIndex].status = getStatusObjectByName(newStatusName);
  return { ...mockUsers[userIndex] };
};

const updateUserInfo = async (
  userId: string,
  userData: UserUpdateType
): Promise<UserType> => {
  console.log(`Updating user ${userId} info:`, userData);
  await new Promise((resolve) => setTimeout(resolve, 300));
  const userIndex = mockUsers.findIndex((u) => u.id === userId);
  if (userIndex === -1) throw new Error("User not found");

  if (userData.fullName !== undefined) {
    mockUsers[userIndex].fullName = userData.fullName;
  }

  if (userData.email !== undefined) {
    mockUsers[userIndex].email = userData.email;
  }

  if (userData.roleId !== undefined) {
    const roleObject = getRoleObjectById(userData.roleId);
    if (roleObject) {
      mockUsers[userIndex].role = roleObject;
    } else {
      console.warn(`Role ID ${userData.roleId} not found.`);
    }
  }

  return { ...mockUsers[userIndex] };
};

export const userService = {
  getPaginatedUsers,
  updateUserStatus,
  updateUserInfo,
};

export default userService;
