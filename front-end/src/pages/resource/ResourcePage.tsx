import { useState, useEffect } from "react";
import { Search, Edit, Trash2, Eye } from "lucide-react";
import useDebounce from "../../hooks/usedebounce";
import Button from "../../components/ui/Button";
import InputCustom from "../../components/input/InputCustom";
import ResourceAddDialog from "../../components/dialog/Resources/ResourceAddDialog";
import { toast } from "react-toastify";
import { resourceService } from "../../services/resource.service";
import { handleAxiosError } from "../../utils/handlerError";
import { AxiosError } from "axios";
import { userService } from "../../services/user.service";
import {
  CreateResourceRequest,
  EditResourceRequest,
  ResourceType,
} from "../../types/resource";
import CustomModal from "../../components/ui/Modal";
import LoadingOverlay from "../../components/loading/LoadingOverlay";

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
  fileId: string;
  fileName: string;
  fileType: string;
}

const ResourcePage = () => {
  const [loading, setLoading] = useState(false);
  const [searchByName, setSearchByName] = useState("");
  const [resourceCategoryFilter, setResourceCategoryFilter] = useState("");
  const [initialData, setInitialData] = useState<ResourceType | undefined>(
    undefined
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(9);

  const [totalResources, setTotalResources] = useState<ResourceType[]>([]);
  const searchDebounced = useDebounce(searchByName, 500);
  const [errors, setErrors] = useState<string>();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [openDocumentViewer, setOpenDocumentViewer] = useState(false);
  const [documentData, setDocumentData] = useState<{
    fileContent: string;
    fileType: string;
  } | null>(null);

  const categoryOptions = [
    { value: "", label: "All" },
    { value: "1", label: "Productivity" },
    { value: "2", label: "Communication" },
    { value: "3", label: "Teamwork" },
    { value: "4", label: "Leadership" },
  ];

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = await userService.getCurrentUser();
        setUserRole(user.role.name);
      } catch (error) {
        console.error("Error fetching user role:", error);
        toast.error("Failed to fetch user information");
        setUserRole(null);
      }
    };
    fetchUserRole();
  }, []);
  const fetchResources = async () => {
    try {
      setLoading(true);
      const categoryId = resourceCategoryFilter
        ? parseInt(resourceCategoryFilter)
        : undefined;
      const response = await resourceService.getPagedResources(
        categoryId,
        searchDebounced,
        pageIndex,
        pageSize
      );

      setTotalResources(response.items);
      setTotalItems(response.totalItems);
    } catch (error) {
      if (error instanceof AxiosError) {
        handleAxiosError(error);
      } else {
        console.error("Error fetching resources:", error);
        toast.error("Failed to fetch resources");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [resourceCategoryFilter, searchDebounced, pageIndex]);

  const handleSubmit = async (
    resource: CreateResourceRequest | EditResourceRequest
  ) => {
    setLoading(true);
    try {
      let resourceId: string;
      if (initialData) {
        await resourceService.updateResource(
          initialData.resourceId,
          resource as EditResourceRequest
        );
        resourceId = initialData.resourceId;
        toast.success("Resource updated successfully");
      } else {
        const response = await resourceService.createResource(
          resource as CreateResourceRequest
        );
        resourceId = response.resourceId;
        toast.success("Resource created successfully");
      }

      if (
        "file" in resource &&
        resource.file &&
        (resource.typeOfResourceId === 1 || resource.typeOfResourceId === 2)
      ) {
        await resourceService.uploadResourceFile(resource.file, resourceId);
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
  const handleDownload = async (resource: Resource) => {
    toast.info("Please wait a few seconds before downloading...");
    try {
      await resourceService.downloadResourceFile(resource.fileId);
      fetchResources();
    } catch (error) {
      if (error instanceof AxiosError) {
        handleAxiosError(error);
      } else {
        console.error("Error in downloading resource:", error);
        toast.error("Failed to download resource");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleOpenWeb = (resource: ResourceType) => {
    try {
      if (resource.typeOfResource.id === 3 && resource.link) {
        const url = resource.link;

        if (/^https?:\/\//i.test(url)) {
          window.open(url, "_blank");
        } else {
          toast.error("Invalid URL format");
        }
      } else {
        toast.error("No valid link found for this resource");
      }
    } catch (error) {
      console.error("Error opening link:", error);
      toast.error("Failed to open link");
    }
  };

  const handleOnClose = () => {
    setOpenDialog(false);
    setInitialData(undefined);
  };

  const handleChangeSearch = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    if ("value" in e.target && e.target instanceof HTMLInputElement) {
      if (e.target.value.length > 500) {
        setErrors("Name of resource must not exceed 500 characters.");
        return;
      }
      setSearchByName(e.target.value);
    }
  };

  const handleViewDocument = async (fileId: string) => {
    try {
      const response = await resourceService.getResourceFileDetail(fileId);
      const { fileContent, fileType } = response;
      if (!fileContent) {
        console.error("File content is missing or empty");
        toast.error("Error: File content is missing or empty.");
        return;
      }
      if (!fileType) {
        console.error("File type is missing");
        toast.error("Error: File type is missing.");
        return;
      }
      const isValidBase64 = /^[A-Za-z0-9+/=]+$/.test(fileContent);
      if (!isValidBase64) {
        console.error("Invalid Base64 string detected");
        toast.error("Error: Invalid Base64 string detected.");
        return;
      }
      setDocumentData({ fileContent, fileType });
      setOpenDocumentViewer(true);
    } catch (error) {
      console.error("Error in handleViewDocument:", error);
      toast.error("Error in handle view document.");
    }
  };
  const handleCloseDocumentViewer = () => {
    setOpenDocumentViewer(false);
    setDocumentData(null);
  };

  const renderButtons = (resource: ResourceType, index: number) => {
    const buttons = {
      download: (
        <button
          id={`download-button-${index}`}
          onClick={() => handleDownload(resource)}
          className="w-[75%] max-w-xs rounded bg-orange-500 text-white px-3 py-1.5 text-sm font-semibold hover:bg-orange-600 transition-colors"
        >
          Download
        </button>
      ),
      open: (
        <button
          id={`open-button-${index}`}
          onClick={() => handleOpenWeb(resource)}
          className="w-[75%] max-w-xs rounded bg-orange-500 text-white px-3 py-1.5 text-sm font-semibold hover:bg-orange-600 transition-colors"
        >
          Open Link
        </button>
      ),
      edit: (
        <button
          id={`edit-button-${index}`}
          onClick={() => {
            setInitialData(resource);
            setOpenDialog(true);
          }}
        >
          <Edit size={20} className="text-lime-50 hover:text-lime-600" />
        </button>
      ),
      delete: (
        <button
          id={`delete-button-${index}`}
          onClick={() => handleDelete(resource)}
        >
          <Trash2 size={20} className="text-red-500 hover:text-red-600" />
        </button>
      ),
      view: (
        <button
          id={`view-button-${index}`}
          onClick={() => handleViewDocument(resource.fileId)}
        >
          <Eye size={20} className="text-blue-500 hover:text-blue-600" />
        </button>
      ),
    };
    const getActionButton = () => {
      if (resource.typeOfResource.id === 3) {
        return buttons.open;
      }
      return buttons.download;
    };

    switch (userRole) {
      case "Mentor":
        return (
          <>
            {getActionButton()}
            {buttons.edit}
            {buttons.delete}
            {resource.typeOfResource.id !== 3 && buttons.view}
          </>
        );
      case "Admin":
        return (
          <>
            {getActionButton()}
            {buttons.delete}

            {resource.typeOfResource.id !== 3 && buttons.view}
          </>
        );
      case "Learner":
        return (
          <>
            {getActionButton()}

            {resource.typeOfResource.id !== 3 && buttons.view}
          </>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (searchDebounced) {
      setSearchByName(searchDebounced);
      setPageIndex(1);
    }
  }, [searchDebounced]);

  const totalPages = Math.ceil(totalItems / pageSize);

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <main>
      <div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-3xl font-bold">Resources</h2>
            {userRole === "Mentor" && (
              <Button
                variant="primary"
                size="md"
                className="font-bold text-white"
                onClick={() => setOpenDialog(true)}
              >
                Add Resource
              </Button>
            )}
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
              data-testid="type-status"
              value={resourceCategoryFilter}
              onChange={(e) => {
                setResourceCategoryFilter(e.target.value);
                setPageIndex(1);
              }}
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : totalResources.length === 0 ? (
            <div className="text-center text-gray-500">No resources found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {totalResources.map((resource, index) => (
                <div
                  key={resource.resourceId}
                  className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="relative mb-2">
                    <h3 className="text-xl text-[17px] font-semibold text-white pr-20">
                      {resource.title}
                    </h3>
                    <span
                      className={`absolute right-0 top-0 text-xs font-semibold text-white px-1.5 py-1 rounded-full min-w-[60px] text-center ${
                        resource.typeOfResource.id === 1
                          ? "bg-amber-500"
                          : resource.typeOfResource.id === 2
                          ? "bg-red-500"
                          : resource.typeOfResource.id === 3
                          ? "bg-blue-500"
                          : "bg-gray-500"
                      }`}
                    >
                      {resource.typeOfResource.name}
                    </span>
                  </div>
                  <p className="text-gray-300 text-[13.5px] mb-4 line-clamp-1">
                    {resource.description}
                  </p>
                  <div className="text-gray-400 text-[13.5px] mb-2">
                    <span className="text-orange-400">
                      Course: {resource.courseName}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {renderButtons(resource, index)}
                  </div>
                </div>
              ))}
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                id="prev-button"
                variant="primary"
                size="sm"
                disabled={pageIndex === 1}
                onClick={() => setPageIndex(pageIndex - 1)}
              >
                Previous
              </Button>
              <span className="text-gray-300">
                Page {pageIndex} of {totalPages}
              </span>
              <Button
                id="next-button"
                variant="primary"
                size="sm"
                disabled={pageIndex === totalPages}
                onClick={() => setPageIndex(pageIndex + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
        <ResourceAddDialog
          isOpen={openDialog}
          onClose={handleOnClose}
          onSubmit={handleSubmit}
          initialData={initialData}
          loading={loading}
          categoryOptions={categoryOptions}
          userRole={userRole}
        />
        <CustomModal
          isOpen={openDocumentViewer}
          onClose={handleCloseDocumentViewer}
          title="View Document"
          size="xl"
        >
          {documentData && (
            <div className="w-full h-[70vh]">
              <embed
                src={`data:${documentData.fileType};base64,${documentData.fileContent}`}
                type={documentData.fileType}
                width="100%"
                height="100%"
              />
            </div>
          )}
        </CustomModal>
      </div>
    </main>
  );
};

export default ResourcePage;
