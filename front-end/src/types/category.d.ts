export interface CategoryType {
  id: string;
  name: string;
  description: string;
  courseCount: number;
  status: EnumType;
}

export interface CategoryCreateType {
  name: string;
  description: string;
  statusId: number;
}
