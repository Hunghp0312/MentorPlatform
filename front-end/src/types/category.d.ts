export interface CategoryType {
    id: number;
    name: string;
    description: string;
    courses: number;
    status: "Active" | "Inactive";
}