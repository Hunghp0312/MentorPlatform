import axiosInstance from "../configs/axiosInstance"
import { CategoryCreateType } from "../types/category";

export const categoryService = {
    async getPaginationCategories(query: string, status: string, Page: number, PageSize: number){
        try {
            const response = await axiosInstance.get("/Categories", {
                params: {
                    Query: query,
                    Status: status,
                    Page: Page,
                    PageSize: PageSize
                }

            })
            return response.data;
        }
        catch (error) {
            console.error("Error fetching categories:", error);
            throw error;
        }
    },
    async createCategory(category : CategoryCreateType){
        try {
            const response = await axiosInstance.post("/Categories", category);
            return response.data;
        }
        catch (error) {
            console.error("Error creating category:", error);
            throw error;
        }
    },
    async editCategory(id: string, category: CategoryCreateType){
        try {
            const res = await axiosInstance.put(`/Categories/${id}`, category);
            return res.data;
        }catch (error) {
            console.error("Error updating category:", error);
            throw error;
        }
    }
    
}