export interface CategoryType {
    id: number;
    name: string;
    description: string;
    courses: number;
    status: number;
}

export interface CategoryCreateType {
    name: string;
    description: string;
    status: number;
}

