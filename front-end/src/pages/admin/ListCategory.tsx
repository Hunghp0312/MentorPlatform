import { Search } from "lucide-react"
import Button from "../../components/ui/Button"
import DataTable from "../../components/table/CustomTable"
import { useState } from "react"
import { getCategoryActions, getCategoryColumns, mockCategories } from "../../data/_mockcategory"
import CategoryAddDialog from "../../components/dialog/CategoryAddDialog"
import { CategoryType } from "../../types/category"

const ListCategory = () => {
    const [categories, setCategories] = useState<CategoryType[]>(mockCategories);
    const [initialData, setInitialData] = useState<CategoryType | undefined>(undefined);
    const [openDialog, setOpenDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Pagination state
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    // Handlers
    const handleEdit = (category: CategoryType) => {
        console.log('Edit category', category);
        
        setInitialData(category);
        setOpenDialog(true);
    };

    const handSubmit = (category: CategoryType) => {
        setCategories((prev) => prev.map((cat) => (cat.id === category.id ? category : cat)));
        setOpenDialog(false);
    }
    
    const handleChangeStatus = (category: CategoryType) => {
        setCategories((prev) => prev.map((cat) => (cat.id === category.id ? { ...cat, status: cat.status === 'Active' ? 'Inactive' : 'Active' } : cat)));
    }

    // Filter categories based on search and status
    const filteredCategories = categories.filter(category => {
        const matchesSearch = searchTerm === '' ||
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' ||
            category.status.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
    });

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
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="inactive">Inactive</option>
                        <option value="active">Active</option>
                    </select>
                </div>
                <DataTable
                    data={filteredCategories}
                    columns={getCategoryColumns}
                    keyField="id"
                    actions={getCategoryActions(handleEdit,handleChangeStatus)}
                    pagination
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    pageIndex={pageIndex}
                    setPageIndex={setPageIndex}
                    totalItems={filteredCategories.length}
                />
            </div>
            <CategoryAddDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onSubmit={() => handSubmit}
                initialData={initialData} 
            />
        </main>
    )
}

export default ListCategory