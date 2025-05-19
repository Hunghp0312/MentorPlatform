export interface CategoryType {
  id: string | number;
  name: string;
  description: string;
  courseCount: number;
  status: EnumType;
}

export interface CategoryCreateType {
  name: string;
  description: string;
  status: number;
}
