import {
  CheckCircle,
  MessageSquare,
  Search,
  UserCog,
  XCircle,
  Edit3, // Added for edit icon in actions
} from "lucide-react";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Components
import DataTable, { DataColumn } from "../../components/table/CustomTable";
import InputCustom from "../../components/input/InputCustom";
import CustomModal from "../../components/ui/Modal";
import LoadingOverlay from "../../components/loading/LoadingOverlay";
import Button from "../../components/ui/Button"; // Assuming you have a Button component

// Services & Hooks
import useDebounce from "../../hooks/usedebounce";
import userService from "../../services/userRole.service";
import {
  UserType,
  UserStatusName,
  UserRoleName,
  UserFilterType,
  UserSortConfigType,
  UserUpdateType,
} from "../../types/userRole.d";

// Placeholder for UserEditDialog - you'll need to create this component
const UserEditDialog = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserUpdateType) => Promise<void>;
  initialData?: UserType;
  isSubmitting: boolean;
}) => {
  const [fullName, setFullName] = useState(initialData?.fullName || "");
  const [email, setEmail] = useState(initialData?.email || "");
  // Assuming role IDs are 101 (Mentor), 102 (Learner), 103 (Admin) as per your service
  const [roleId, setRoleId] = useState<number | undefined>(
    initialData?.role.id
  );

  useEffect(() => {
    setFullName(initialData?.fullName || "");
    setEmail(initialData?.email || "");
    setRoleId(initialData?.role.id);
  }, [initialData]);

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      fullName: fullName !== initialData?.fullName ? fullName : undefined,
      email: email !== initialData?.email ? email : undefined,
      roleId: roleId !== initialData?.role.id ? roleId : undefined,
    });
  };

  // This is a very basic form. You'd want more robust form handling.
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit User"
      size="md"
      // Remove onConfirm if the dialog has its own submit button
    >
      <form onSubmit={handleSubmitForm} className="space-y-4 p-4">
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name
          </label>
          <InputCustom
            name="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 block w-full"
            type={""}
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <InputCustom
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full"
          />
        </div>
        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={roleId || ""}
            onChange={(e) => setRoleId(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600">
            <option value="" disabled>
              Select a role
            </option>
            <option value={101}>{UserRoleName.MENTOR}</option>
            <option value={102}>{UserRoleName.LEARNER}</option>
            <option value={103}>{UserRoleName.ADMIN}</option>
          </select>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </CustomModal>
  );
};

const ListUser = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // For form submissions
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRoleName | "">("");

  // Deactivation Modal State
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [selectedUserForDeactivation, setSelectedUserForDeactivation] =
    useState<UserType | null>(null);

  // Edit User Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [initialDataForEdit, setInitialDataForEdit] = useState<
    UserType | undefined
  >(undefined);

  // Pagination state
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(0);

  const debouncedSearch = useDebounce(search, 500);

  const roleOptions = [
    { value: "", label: "All Roles" },
    { value: UserRoleName.MENTOR, label: UserRoleName.MENTOR },
    { value: UserRoleName.LEARNER, label: UserRoleName.LEARNER },
    { value: UserRoleName.ADMIN, label: UserRoleName.ADMIN },
  ];

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const filter: UserFilterType = { roleName: roleFilter || undefined };
      const sortConfig: UserSortConfigType | null = null; // Default sort

      const response = await userService.getPaginatedUsers(
        debouncedSearch,
        filter,
        sortConfig,
        pageIndex,
        pageSize
      );
      setUsers(response.items);
      setTotalItems(response.totalItems);
      // Update counts if you need to display them, e.g., in tabs
      // setRoleCounts(response.counts);
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, roleFilter, pageIndex, pageSize]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleActivate = useCallback(
    async (userId: string) => {
      setLoading(true);
      try {
        await userService.updateUserStatus(userId, UserStatusName.ACTIVE);
        toast.success("User activated successfully");
        fetchUsers();
      } catch (error) {
        const err = error as Error;
        toast.error(err.message || "Failed to activate user");
      } finally {
        setLoading(false);
      }
    },
    [fetchUsers]
  );

  const handleDeactivate = useCallback(
    async (userId: string) => {
      setLoading(true);
      try {
        await userService.updateUserStatus(userId, UserStatusName.DEACTIVATED);
        toast.success("User deactivated successfully");
        fetchUsers();
      } catch (error) {
        const err = error as Error;
        toast.error(err.message || "Failed to deactivate user");
      } finally {
        setLoading(false);
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

  const handleEditUser = (user: UserType) => {
    setInitialDataForEdit(user);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setInitialDataForEdit(undefined);
  };

  const handleSubmitEditUser = async (userData: UserUpdateType) => {
    if (!initialDataForEdit) return;
    setIsSubmitting(true);
    try {
      await userService.updateUserInfo(initialDataForEdit.id, userData);
      toast.success("User updated successfully");
      handleCloseEditModal();
      fetchUsers();
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "Failed to update user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: DataColumn<UserType>[] = useMemo(
    () => [
      {
        header: "Full Name",
        accessor: "fullName",
        sortable: true, // Assuming CustomTable supports this
        id: "fullName", // For sorting key
      },
      {
        header: "Email",
        accessor: "email",
        sortable: true,
        id: "email",
      },
      {
        header: "Role",
        accessor: (row: UserType) => row.role.name,
        sortable: true,
        id: "role.name",
      },
      {
        header: "Status",
        accessor: (row: UserType) => {
          if (row.status.name === UserStatusName.ACTIVE) {
            return (
              <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full dark:bg-green-700 dark:text-green-200">
                Active
              </span>
            );
          }
          if (row.status.name === UserStatusName.PENDING) {
            return (
              <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full dark:bg-yellow-700 dark:text-yellow-200">
                Pending
              </span>
            );
          }
          return (
            <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded-full dark:bg-red-700 dark:text-red-200">
              Deactivated
            </span>
          );
        },
        sortable: true,
        id: "status.name",
      },
      {
        header: "Joined",
        accessor: (row: UserType) =>
          new Date(row.joinDate).toLocaleDateString(),
        sortable: true,
        id: "joinDate",
      },
      {
        header: "Actions",
        accessor: (row: UserType) => (
          <div className="flex gap-2 items-center">
            <button
              onClick={() => handleEditUser(row)}
              title="Edit User"
              className="text-blue-500 hover:text-blue-700">
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate(`/admin/users/${row.id}`)} // Or a dedicated view page
              title="View Details"
              className="text-gray-500 hover:text-gray-700">
              <UserCog className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate(`/admin/message/${row.id}`)}
              title="Send Message"
              className="text-purple-500 hover:text-purple-700">
              <MessageSquare className="w-4 h-4" />
            </button>
            {row.status.name === UserStatusName.ACTIVE ||
            row.status.name === UserStatusName.PENDING ? (
              <button
                onClick={() => {
                  setSelectedUserForDeactivation(row);
                  setDeactivateModalOpen(true);
                }}
                title="Deactivate User"
                className="text-red-500 hover:text-red-700">
                <XCircle className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => handleActivate(row.id)}
                title="Activate User"
                className="text-green-500 hover:text-green-700">
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        ),
      },
    ],
    [navigate, handleActivate, handleDeactivate, handleEditUser] // Added handleEditUser dependency
  );

  return (
    <main className="p-4 container mx-auto">
      {loading && !isSubmitting && <LoadingOverlay />}{" "}
      {/* Show overlay for page load, not for submit loading */}
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          {/* Add "Invite User" or similar button if needed */}
          {/* <Button variant="primary" size="md" onClick={() => {}}>
            Invite User
          </Button> */}
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
                setPageIndex(1); // Reset to first page on search
              }}
              placeholder="Search users by name or email..."
              className="w-full"
            />
          </div>
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value as UserRoleName | "");
              setPageIndex(1); // Reset to first page on filter change
            }}>
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <DataTable
          data={users}
          columns={columns}
          keyField="id"
          // actions={getActions} // If you adapt to a getActions pattern
          pagination
          pageSize={pageSize}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          totalItems={totalItems}
          isLoading={loading && !isSubmitting} // Table loading state
          // onSortChange={handleSort} // TODO: Implement sorting if CustomTable supports it
        />
      </div>
      {/* Deactivation Confirmation Modal */}
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
      {/* Edit User Modal - Uses placeholder UserEditDialog */}
      {editModalOpen && initialDataForEdit && (
        <UserEditDialog
          isOpen={editModalOpen}
          onClose={handleCloseEditModal}
          onSubmit={handleSubmitEditUser}
          initialData={initialDataForEdit}
          isSubmitting={isSubmitting}
        />
      )}
    </main>
  );
};

export default ListUser;
