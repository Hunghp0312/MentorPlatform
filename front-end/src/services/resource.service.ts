import axiosInstance from "../configs/axiosInstance";
import { CreateResourceRequest, EditResourceRequest } from "../types/resource";
export const resourceService = {
  async getPagedResources(
    query: string,
    typeOfResourceId: number | undefined,
    pageIndex: number,
    pageSize: number
  ) {
    const response = await axiosInstance.get("/Resource/resources", {
      params: {
        Query: query,
        PageIndex: pageIndex,
        PageSize: pageSize,
        TypeOfResourceId: typeOfResourceId,
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

  async deleteResourceFile(fileId: string) {
    const response = await axiosInstance.delete(`/Resource/del-file/${fileId}`);
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
    const response = await axiosInstance.get(
      `/SupportingDocuments/${fileId}/download`
    );
    return response.data;
  },

  async deleteLinkFile(resourceId: string) {
    const response = await axiosInstance.delete(
      `/Resource/del-link-file/${resourceId}/Url`
    );
    return response.data;
  },
  async openLinkFile(resourceId: string) {
    const response = await axiosInstance.get(
      `/Resource/link/${resourceId}/Url`
    );
    return response.data;
  },
};
