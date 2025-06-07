import { useState, useEffect } from "react";
import useDebounce from "../../hooks/usedebounce";
import Button from "../../components/ui/Button";
import { Search, Edit, Trash2, View, Eye } from "lucide-react";
import { toast } from "react-toastify";
import { resourceService } from "../../services/resource.service";
import { handleAxiosError } from "../../utils/handlerError";
import { AxiosError } from "axios";
import InputCustom from "../../components/input/InputCustom";
import {
  CreateResourceRequest,
  EditResourceRequest,
} from "../../types/resource";

interface Resource {
  resourceId: string;
  title: string;
  description: string;
  courseName: string;
  typeOfResource: {
    id: number;
    name: string;
  };
  resourceCategory: {
    id: number;
    name: string;
  };
}

const mockResources: Resource[] = [
  {
    resourceId: "res_001",
    title: "Introduction to Productivity",
    description:
      "A comprehensive guide to improving personal and team productivity using modern tools.",
    courseName: "Productivity 101",
    typeOfResource: {
      id: 1,
      name: "Pdf",
    },
    resourceCategory: {
      id: 1,
      name: "Productivity",
    },
  },
  {
    resourceId: "res_002",
    title: "Effective Communication Skills",
    description:
      "Learn key strategies for clear and impactful communication in professional settings.",
    courseName: "Communication Mastery",
    typeOfResource: {
      id: 2,
      name: "Video",
    },
    resourceCategory: {
      id: 2,
      name: "Communication",
    },
  },
  {
    resourceId: "res_003",
    title: "Team Collaboration Techniques",
    description:
      "Explore methods to enhance teamwork and collaboration in diverse environments.",
    courseName: "Team Dynamics",
    typeOfResource: {
      id: 3,
      name: "Link",
    },
    resourceCategory: {
      id: 3,
      name: "Teamwork",
    },
  },
  {
    resourceId: "res_004",
    title: "Leadership Essentials",
    description:
      "Develop core leadership skills to inspire and guide teams effectively.",
    courseName: "Leadership Foundations",
    typeOfResource: {
      id: 1,
      name: "Pdf",
    },
    resourceCategory: {
      id: 4,
      name: "Leadership",
    },
  },
  {
    resourceId: "res_005",
    title: "Time Management Strategies",
    description:
      "Master time management techniques to boost efficiency and reduce stress.",
    courseName: "Time Management Basics",
    typeOfResource: {
      id: 1,
      name: "Pdf",
    },
    resourceCategory: {
      id: 1,
      name: "Productivity",
    },
  },
];
const ResourcePage = () => {
  const [loading, setLoading] = useState(false);
  const [searchByName, setSearchByName] = useState("");
  const [resourceCategoryFilter, setResourceCategoryFilter] = useState("");
  const [initialData, setInitialData] = useState<Resource | undefined>(
    undefined
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalResources, setTotalResources] = useState<Resource[]>([]);
  const [resourceCategoryCounts, setResourceCategoryTypeCounts] = useState<{
    [key: string]: number;
  }>({});

  const searchDebounced = useDebounce(searchByName, 500);
  const [errors, setErrors] = useState<string>();

  const categoryOptions = [
    { value: "", label: "All" },
    { value: "1", label: "Productivity" },
    { value: "2", label: "Communication" },
    { value: "3", label: "Teamwork" },
    { value: "4", label: "Leadership" },
  ];
  const fetchResources = async () => {
    setLoading(true);
    try {
      const typeId = resourceCategoryFilter
        ? parseInt(resourceCategoryFilter)
        : 0;
      const response = await resourceService.getPagedResources(
        searchDebounced,
        typeId,
        pageIndex,
        pageSize
      );
      setTotalResources(response.items);
      setTotalItems(response.totalItems);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchResources();
  // }, [pageIndex, pageSize, searchDebounced, resourceCategoryFilter]);

  useEffect(() => {
    // Simulate fetching data
    setTotalResources(mockResources);
    setTotalItems(mockResources.length);
  }, []);

  // const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.value.length <= 1000) {
  //     setSearchByName(e.target.value);
  //     setPageIndex(1);
  //   }
  // };

  const handleSubmit = async (
    resource: CreateResourceRequest | EditResourceRequest
  ) => {
    setLoading(true);
    try {
      if (initialData) {
        // Edit existing resource
        await resourceService.updateResource(
          initialData.resourceId,
          resource as EditResourceRequest
        );
        toast.success("Resource updated successfully");
      } else {
        // Create new resource
        await resourceService.createResource(resource as CreateResourceRequest);
        toast.success("Resource created successfully");
      }
      fetchResources();
    } catch (error) {
      if (error instanceof AxiosError) {
        handleAxiosError(error);
      } else {
        console.error("Error saving resource:", error);
        toast.error(`Failed to ${initialData ? "update" : "create"} resource`);
      }
    } finally {
      setOpenDialog(false);
      setInitialData(undefined);
      setLoading(false);
    }
  };

  const handleDelete = async (resource: Resource) => {
    if (
      window.confirm(
        `Are you sure you want to delete the resource "${resource.title}"?`
      )
    ) {
      setLoading(true);
      try {
        await resourceService.deleteResource(resource.resourceId);
        toast.success("Resource deleted successfully");
        fetchResources();
      } catch (error) {
        if (error instanceof AxiosError) {
          handleAxiosError(error);
        } else {
          console.error("Error deleting resource:", error);
          toast.error("Failed to delete resource");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  // const handlePageChange = (newPage: number) => {
  //   setPageIndex(newPage);
  // };

  const handleOnClose = () => {
    setOpenDialog(false);
    setInitialData(undefined);
  };

  const handleChangeSearch = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    // Only handle input elements
    if ("value" in e.target && e.target instanceof HTMLInputElement) {
      if (e.target.value.length > 100) {
        setErrors("Name of resource must not exceed 1000 characters.");
        return;
      }
      setSearchByName(e.target.value);
    }
  };
  useEffect(() => {
    if (searchDebounced) {
      setSearchByName(searchDebounced);
      setPageIndex(1);
    }
  }, [searchDebounced]);

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <main>
      <div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-3xl font-bold ">Resource</h2>
          <Button
            variant="primary"
            size="md"
            className="font-bold text-white"
            onClick={() => setOpenDialog(true)}
          >
            Add Resource
          </Button>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-grow relative">
            <InputCustom
              name="search"
              type="text"
              value={searchByName}
              icon={<Search size={20} className="text-gray-500" />}
              onChange={handleChangeSearch}
              placeholder="Search resource..."
              errorMessage={errors}
            />
          </div>
          <select
            className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
            data-testid="category-status"
            value={resourceCategoryFilter}
            onChange={(e) => {
              setResourceCategoryFilter(e.target.value);
              setPageIndex(1);
            }}
          >
            {categoryOptions.map((option) => {
              return (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              );
            })}
          </select>
        </div>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : totalResources.length === 0 ? (
          <div className="text-center text-gray-500">No resources found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {totalResources.map((resource) => (
              <div
                key={resource.resourceId}
                className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="relative mb-2">
                  <h3 className="text-xl text-[17px] font-semibold text-white pr-20">
                    {resource.title}
                  </h3>
                  <span
                    className={`absolute right-0 top-0 text-xs font-semibold text-white px-1.5 py-1 rounded-full min-w-[60px] text-center ${
                      resource.typeOfResource.id === 1
                        ? "bg-orange-500"
                        : resource.typeOfResource.id === 2
                        ? "bg-purple-500"
                        : resource.typeOfResource.id === 3
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {resource.typeOfResource.name}
                  </span>
                </div>
                <p className="text-gray-300 text-[13.5px] mb-4 line-clamp-3">
                  {resource.description}
                </p>
                <div className="text-gray-400 text-[13.5px] mb-2">
                  <span className=" text-orange-400">
                    Course: {resource.courseName}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button size="lg">Download</Button>
                  <Button
                    // variant="outline"
                    size="sm"
                    onClick={() => {
                      setInitialData(resource);
                      setOpenDialog(true);
                    }}
                    disabled={loading}
                  >
                    <Edit size={16} className="mr-1" /> Edit
                  </Button>
                  <Button
                    //variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(resource)}
                    disabled={loading}
                  >
                    <Trash2 size={16} className="mr-1" /> Delete
                  </Button>
                  <Button>
                    <Eye size={16} className="mr-1" /> View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default ResourcePage;
