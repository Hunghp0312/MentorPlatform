export interface CreateResourceRequest {
  title: string;
  description: string;
  resourceCategoryId: number;
  typeOfResourceId: number;
  courseId: string;
}

export interface EditResourceRequest {
  title: string;
  description: string;
  resourceCategoryId: number;
  typeOfResourceId: number;
}
