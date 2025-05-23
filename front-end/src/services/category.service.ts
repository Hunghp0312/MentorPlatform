import axiosInstance from "../configs/axiosInstance";
import { CategoryCreateType } from "../types/category";

export const categoryService = {
  async getPaginationCategories(
    query: string,
    status: string,
    Page: number,
    PageSize: number
  ) {
    try {
      const response = await axiosInstance.get("/Categories/paged", {
        params: {
          Query: query,
          Status: status,
          PageIndex: Page,
          PageSize: PageSize,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },
  async createCategory(category: CategoryCreateType) {
    try {
      const response = await axiosInstance.post("/Categories", category);
      return response.data;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },
  async editCategory(id: string, category: CategoryCreateType) {
    try {
      const res = await axiosInstance.put(`/Categories/${id}`, category);
      return res.data;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },
  async deleteCategory(id: string) {
    try {
      const res = await axiosInstance.delete(`/Categories/${id}`);
      return res.data;
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  },
  async getAllCategories() {
    try {
      const response = await axiosInstance.get("/Categories/all");
      return response.data;
    } catch (error) {
      console.error("Error fetching all categories:", error);
      throw error;
    }
  },
};
