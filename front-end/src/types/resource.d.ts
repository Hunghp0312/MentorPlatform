export interface CreateResourceRequest {
  title: string;
  description: string;
  resourceCategoryId: number;
  typeOfResourceId: number;
  courseId: string;
  file?: File;
  link?: string;
}

export interface EditResourceRequest {
  title: string;
  description: string;
  resourceCategoryId: number;
  typeOfResourceId: number;
}
interface ResourceType {
  resourceId: string;
  title: string;
  description: string;
  course: {
    id: string;
    name: string;
  };
  typeOfResource: {
    id: number;
    name: string;
  };
  resourceCategory: {
    id: number;
    name: string;
  };
  document: {
    id: string;
    name: string;
    data: string;
  };
}
