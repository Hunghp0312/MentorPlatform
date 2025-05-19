import { Edit, Trash2 } from "lucide-react";
import { DataColumn } from "../components/table/CustomTable";
import { CategoryType } from "../types/category";

// Example usage with DataTable component
export const getCategoryColumns: DataColumn<CategoryType>[] = [
  {
    header: "NAME",
    accessor: "name",
    align: "left",
    width: "20%",
  },
  {
    header: "DESCRIPTION",
    accessor: "description",
    align: "left",
    width: "40%",
  },
  {
    header: "COURSES",
    accessor: "courseCount",
    align: "center",
    width: "10%",
  },
  {
    header: "STATUS",
    accessor: (category: CategoryType) => (
      <div className="flex justify-center">
        {category.status.id === 2 ? (
          <span className="text-green-500 font-medium">Active</span>
        ) : (
          <span className="text-gray-400 font-medium">Inactive</span>
        )}
      </div>
    ),
    align: "center",
    width: "15%",
  },
];

export const getCategoryActions = (
  handleEdit: (category: CategoryType) => void,
  handleDelete: (category: CategoryType) => void
) => [
  {
    icon: <Edit className="h-4 w-4" />,
    onClick: handleEdit,
    className: "bg-blue-600 hover:bg-blue-700 text-white",
  },
  {
    icon: <Trash2 className="h-4 w-4" />,
    onClick: handleDelete,
    className: "bg-red-600 hover:bg-red-700 text-white",
  },
];
