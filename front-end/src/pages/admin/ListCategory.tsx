import { Search } from "lucide-react";
import Button from "../../components/ui/Button";
import DataTable from "../../components/table/CustomTable";
import { useEffect, useState } from "react";
import {
  getCategoryActions,
  getCategoryColumns,
} from "../../data/_mockcategory";
import CategoryAddDialog from "../../components/dialog/CategoryAddDialog";
import { CategoryType } from "../../types/category";
import CustomModal from "../../components/ui/Modal";
import { categoryService } from "../../services/category.service";
import useDebounce from "../../hooks/usedebounce";
import { toast } from "react-toastify";
import InputCustom from "../../components/input/InputCustom";
import LoadingOverlay from "../../components/loading/LoadingOverlay";

const ListCategory = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [initialData, setInitialData] = useState<CategoryType | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string>();
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const searchDebounced = useDebounce(searchTerm, 500);
  // Pagination state
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  useEffect(() => {
    fetchCategories();
  }, [searchDebounced, statusFilter, pageIndex, pageSize]);
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryService.getPaginationCategories(
        searchDebounced,
        statusFilter,
        pageIndex,
        pageSize
      );
      setTotalItems(res.data.totalItems);
      setCategories(res.data.items);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: "", label: "All" },
    { value: "1", label: "Inactive" },
    { value: "2", label: "Active" },
  ];
  // Handlers
  const handleEdit = (category: CategoryType) => {
    setInitialData(category);
    setOpenDialog(true);
  };

  const handSubmit = async (category: CategoryType) => {
    const data = {
      name: category.name,
      description: category.description,
      status: category.status,
    };
    setLoading(true);
    if (initialData === undefined) {
      try {
        await categoryService.createCategory(data);
        toast.success("Category created successfully");
        fetchCategories();
      } catch (error) {
        console.error("Error creating category:", error);
      } finally {
        setOpenDialog(false);
        setLoading(false);
      }
    } else {
      try {
        await categoryService.editCategory(category.id.toString(), data);
        toast.success("Category updated successfully");
        fetchCategories();
      } catch (error) {
        console.error("Error updating category:", error);
      } finally {
        setOpenDialog(false);
        setLoading(false);
      }
    }
  };
  const handleChangeSearch = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    // Only handle input elements
    if ("value" in e.target && e.target instanceof HTMLInputElement) {
      if (e.target.value.length > 1000) {
        setErrors("Search term must not exceed 1000 characters.");
        return;
      }
      setSearchTerm(e.target.value);
    }
  };
  useEffect(() => {
    if (searchDebounced) {
      setSearchTerm(searchDebounced);
      setPageIndex(1);
    }
  }, [searchDebounced]);

  const handleOnclose = () => {
    setOpenDialog(false);
    setInitialData(undefined);
  };

  const handleDelete = async (category: CategoryType) => {
    if (
      window.confirm(
        `Are you sure you want to delete the category "${category.name}"?`
      )
    ) {
      try {
        await categoryService.deleteCategory(category.id.toString());
        toast.success("Category deleted successfully");
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
      } finally {
        setOpenDialog(false);
      }
    }
  };
  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <main className="p-4 container mx-auto ">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-3xl font-bold ">Category Management</h2>
          <Button
            variant="primary"
            size="md"
            className="font-bold text-white"
            onClick={() => setOpenDialog(true)}
          >
            Add Category
          </Button>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-grow relative">
            <InputCustom
              name="search"
              type="text"
              value={searchTerm}
              icon={<Search size={20} className="text-gray-500" />}
              onChange={handleChangeSearch}
              placeholder="Search categories..."
              errorMessage={errors}
            />
          </div>
          <select
            className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPageIndex(1);
            }}
          >
            {statusOptions.map((option) => {
              return (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              );
            })}
          </select>
        </div>
        <DataTable
          data={categories}
          columns={getCategoryColumns}
          keyField="id"
          actions={getCategoryActions(handleEdit, handleDelete)}
          pagination
          pageSize={pageSize}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          totalItems={totalItems}
        />
      </div>
      <CustomModal
        isOpen={openDialog}
        onClose={handleOnclose}
        title={initialData ? "Edit Category" : "Add Category"}
        size="md"
      >
        <CategoryAddDialog
          isSubmitting={false}
          actionButtonText={initialData ? "Update" : "Add"}
          onClose={handleOnclose}
          onSubmit={handSubmit}
          initialData={initialData}
        />
      </CustomModal>
    </main>
  );
};
export default ListCategory;
