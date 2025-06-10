import axiosInstance from "../configs/axiosInstance";
import { CreateResourceRequest, EditResourceRequest } from "../types/resource";
export const resourceService = {
  async getPagedResources(
    resourceCategoryId: number | undefined,
    query: string,
    pageIndex: number,
    pageSize: number
  ) {
    const response = await axiosInstance.get("/Resource/resources", {
      params: {
        ResourceCategoryId: resourceCategoryId,
        Query: query,
        PageIndex: pageIndex,
        PageSize: pageSize,
      },
    });
    return response.data;
  },
  async createResource(resource: CreateResourceRequest) {
    const response = await axiosInstance.post("/Resource", resource);
    return response.data;
  },

  async deleteResource(resourceId: string) {
    const response = await axiosInstance.delete(`/Resource/${resourceId}`);
    return response.data;
  },

  async updateResource(resourceId: string, resource: EditResourceRequest) {
    const response = await axiosInstance.put(
      `/Resource/${resourceId}`,
      resource
    );
    return response.data;
  },

  async uploadResourceFile(file: File, resourceId: string) {
    const formData = new FormData();
    formData.append("file", file, file.name);
    const response = await axiosInstance.post(
      `/Resource/up-file/${resourceId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  async getResourceFileDetail(fileId: string) {
    const response = await axiosInstance.get(
      `/Resource/file/${fileId}/details`
    );
    return response.data;
  },

  async uploadResourceLinkType(resourceId: string, link: string) {
    const response = await axiosInstance.put(
      `/Resource/${resourceId}/UrlUpload?Url=${encodeURIComponent(link)}`,
      link
    );
    return response.data;
  },

  async downloadResourceFile(fileId: string) {
    try {
      const response = await axiosInstance.get(
        `/SupportingDocuments/${fileId}/download`,
        {
          responseType: "blob",
        }
      );

      // Cải thiện cách lấy tên file từ Content-Disposition header
      const contentDisposition =
        response.headers["content-disposition"] ||
        response.headers["Content-Disposition"];

      let fileName = `file-${fileId}`;

      if (contentDisposition) {
        // Xử lý các format khác nhau của Content-Disposition
        const matches = [
          /filename\*=UTF-8''(.+)/, // RFC 5987 encoded filename
          /filename="([^"]+)"/, // Quoted filename
          /filename=([^;]+)/, // Unquoted filename
        ];

        for (const regex of matches) {
          const match = contentDisposition.match(regex);
          if (match) {
            fileName = decodeURIComponent(match[1]);
            break;
          }
        }
      }

      // Tạo blob và download
      const blob = new Blob([response.data], {
        type: response.headers["content-type"] || "application/octet-stream",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      // Thêm vào DOM, click và xóa
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      throw error;
    }
  },
};
