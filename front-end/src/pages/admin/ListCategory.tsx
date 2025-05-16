import { Search } from "lucide-react"
import Button from "../../components/ui/Button"
import DataTable from "../../components/table/CustomTable"
import { useEffect, useState } from "react"
import { getCategoryActions, getCategoryColumns } from "../../data/_mockcategory"
import CategoryAddDialog from "../../components/dialog/CategoryAddDialog"
import { CategoryType } from "../../types/category"
import CustomModal from "../../components/ui/Modal"
import { categoryService } from "../../services/category.service"
import useDebounce from "../../hooks/usedebounce"
import { toast } from "react-toastify"


const ListCategory = () => {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [initialData, setInitialData] = useState<CategoryType | undefined>(
        undefined
    );
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
        try {
            const res = await categoryService.getPaginationCategories(searchDebounced, statusFilter, pageIndex, pageSize);
            setTotalItems(res.data.totalItems);
            setCategories(res.data.items);
        }
        catch (error) {
            console.error("Error fetching categories:", error);

        }
    }
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
        }
        if (initialData === undefined) {
            try {
                await categoryService.createCategory(data)
                toast.success("Category created successfully");
                fetchCategories();
            } catch (error) {
                console.error("Error creating category:", error);
                toast.error("Error creating category");
            } finally {
                setOpenDialog(false);
            }
        }
        else {
            try {
                await categoryService.editCategory(category.id.toString(), data);
                toast.success("Category updated successfully");
                fetchCategories();
            } catch (error) {
                console.error("Error updating category:", error);
                toast.error("Error updating category");
            } finally {
                setOpenDialog(false);
            }
        }
    }

    const handleChangeStatus = (category: CategoryType) => {
        setCategories((prev) => prev.map((cat) => (cat.id === category.id ? { ...cat, status: cat.status === 1 ? 0 : 1 } : cat)));
    }

    const handleOnclose = () => {
        setOpenDialog(false);
        setInitialData(undefined);
    }

    const handleDelete = (category: CategoryType) => {
        if (window.confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
            setCategories((prev) => prev.filter((cat) => cat.id !== category.id));
        }
    }

    return (
        <main className="p-4 container mx-auto ">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <h2 className="text-3xl font-bold ">Category Management</h2>
                    <Button variant="primary" size="md" className="font-bold text-white" onClick={() => setOpenDialog(true)} >Add Category</Button>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-grow relative">
                        <input
                            placeholder="Search categories..."
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <Search size={20} className="text-gray-500" />
                        </div>
                    </div>
                    <select
                        className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                        value={statusFilter}
                        onChange={(e) => {setStatusFilter(e.target.value);setPageIndex(1)}}
                    >
                        <option value="">All Statuses</option>
                        <option value="0">Inactive</option>
                        <option value="1">Active</option>
                    </select>
                </div>
                <DataTable
                    data={categories}
                    columns={getCategoryColumns}
                    keyField="id"
                    actions={getCategoryActions(handleEdit, handleChangeStatus, handleDelete)}
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
