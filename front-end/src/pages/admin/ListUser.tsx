import {
  CheckCircle,
  MessageSquare,
  Search,
  UserCog,
  XCircle,
} from "lucide-react";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import DataTable, { DataColumn } from "../../components/table/CustomTable";
import InputCustom from "../../components/input/InputCustom";
import CustomModal from "../../components/ui/Modal";
import LoadingOverlay from "../../components/loading/LoadingOverlay";
import Button from "../../components/ui/Button";

import useDebounce from "../../hooks/usedebounce";
import userService from "../../services/userRole.service";

import { userType, userPaginationRequest } from "../../types/userRole.d";

import { RoleEnum, Status as StatusEnum } from "../../types/commonType";

const ListUser = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<userType[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleEnum | "">("");

  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [selectedUserForDeactivation, setSelectedUserForDeactivation] =
    useState<userType | null>(null);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(0);

  const debouncedSearch = useDebounce(search, 500);

  const getRoleName = (roleEnumVal: RoleEnum | ""): string => {
    if (roleEnumVal === "") return "All Roles";
    return RoleEnum[roleEnumVal];
  };

  const roleOptions = [
    { value: "", label: "All Roles" },
    { value: RoleEnum.Mentor, label: getRoleName(RoleEnum.Mentor) },
    { value: RoleEnum.Learner, label: getRoleName(RoleEnum.Learner) },
    { value: RoleEnum.Admin, label: getRoleName(RoleEnum.Admin) },
  ];

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const payload: userPaginationRequest = {
        Query: debouncedSearch === "" ? null : debouncedSearch,
        RoleId: roleFilter === "" ? null : roleFilter,
        PageIndex: pageIndex,
        PageSize: pageSize,
      };

      const response = await userService.GetPaginatedUser(payload);
      setUsers(response.items || []);
      setTotalItems(response.totalItems || 0);
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "Failed to load users");
      setUsers([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, roleFilter, pageIndex, pageSize]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleActivate = useCallback(
    async (userId: string) => {
      try {
        await userService.UpdateStatus({
          UserId: userId,
          StatusId: StatusEnum.Active,
        });
        toast.success("User activated successfully");
        fetchUsers();
      } catch (error) {
        const err = error as Error;
        toast.error(err.message || "Failed to activate user");
      }
    },
    [fetchUsers]
  );

  const handleDeactivate = useCallback(
    async (userId: string) => {
      try {
        await userService.UpdateStatus({
          UserId: userId,
          StatusId: StatusEnum.Deactive,
        });
        toast.success("User deactivated successfully");
        fetchUsers();
      } catch (error) {
        const err = error as Error;
        toast.error(err.message || "Failed to deactivate user");
      }
    },
    [fetchUsers]
  );

  const confirmDeactivation = () => {
    if (selectedUserForDeactivation) {
      handleDeactivate(selectedUserForDeactivation.id);
      setDeactivateModalOpen(false);
      setSelectedUserForDeactivation(null);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "";
    const words = name.split(" ");
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return words
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const columns: DataColumn<userType>[] = useMemo(
    () => [
      {
        header: "Full Name",
        accessor: (row: userType) => (
          <div className="flex items-center">
            {row.avatar ? (
              <img
                src={row.avatar}
                alt={row.fullName}
                className="w-8 h-8 rounded-full mr-3 object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full mr-3 bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-semibold text-gray-700 dark:text-gray-200">
                {getInitials(row.fullName)}
              </div>
            )}
            <span>{row.fullName}</span>
          </div>
        ),
      },
      {
        header: "Email",
        accessor: "email",
      },
      {
        header: "Role",
        accessor: (row: userType) => row.role.name,
      },
      {
        header: "Status",
        accessor: (row: userType) => {
          const statusName = row.status.name.toLowerCase();
          if (statusName === "active") {
            return (
              <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full dark:bg-green-700 dark:text-green-200">
                {row.status.name}
              </span>
            );
          }
          if (statusName === "pending") {
            return (
              <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full dark:bg-yellow-700 dark:text-yellow-200">
                {row.status.name}
              </span>
            );
          }
          return (
            <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded-full dark:bg-red-700 dark:text-red-200">
              {row.status.name}
            </span>
          );
        },
      },
      {
        header: "Joined",
        accessor: (row: userType) =>
          new Date(row.joinDate).toLocaleDateString(),
      },
      {
        header: "Actions",
        accessor: (row: userType) => (
          <div className="flex gap-2 items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/users/${row.id}`);
              }}
              title="View Details"
              className="text-gray-500 hover:text-gray-700">
              <UserCog className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/message/${row.id}`);
              }}
              title="Send Message"
              className="text-purple-500 hover:text-purple-700">
              <MessageSquare className="w-4 h-4" />
            </button>
            {row.status.id === StatusEnum.Active ||
            row.status.id === StatusEnum.Pending ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedUserForDeactivation(row);
                  setDeactivateModalOpen(true);
                }}
                title="Deactivate User"
                className="text-red-500 hover:text-red-700">
                <XCircle className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleActivate(row.id);
                }}
                title="Activate User"
                className="text-green-500 hover:text-green-700">
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        ),
      },
    ],
    [navigate, handleActivate]
  );

  return (
    <main className="p-4 container mx-auto">
      {loading && <LoadingOverlay />}
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            User Role Management
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-grow relative">
            <InputCustom
              name="search"
              type="text"
              value={search}
              icon={
                <Search
                  size={20}
                  className="text-gray-500 dark:text-gray-400"
                />
              }
              onChange={(e) => {
                setSearch(e.target.value);
                setPageIndex(1);
              }}
              placeholder="Search users by name or email..."
              className="w-full"
            />
          </div>
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={roleFilter}
            onChange={(e) => {
              const value = e.target.value;
              setRoleFilter(value === "" ? "" : (Number(value) as RoleEnum));
              setPageIndex(1);
            }}>
            {roleOptions.map((option) => (
              <option key={option.value.toString()} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <DataTable
          data={users}
          columns={columns}
          keyField="id"
          pagination
          pageSize={pageSize}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          totalItems={totalItems}
          isLoading={loading}
        />
      </div>

      <CustomModal
        isOpen={deactivateModalOpen}
        onClose={() => {
          setDeactivateModalOpen(false);
          setSelectedUserForDeactivation(null);
        }}
        title="Confirm Deactivation">
        <div className="mb-4 text-gray-700 dark:text-gray-300">
          {`Are you sure you want to deactivate ${selectedUserForDeactivation?.fullName}?`}
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setDeactivateModalOpen(false);
              setSelectedUserForDeactivation(null);
            }}>
            Cancel
          </Button>
          <Button type="button" variant="danger" onClick={confirmDeactivation}>
            Deactivate
          </Button>
        </div>
      </CustomModal>
    </main>
  );
};

export default ListUser;
