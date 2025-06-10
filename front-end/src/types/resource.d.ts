export interface CreateResourceRequest {
  title: string;
  description: string;
  resourceCategoryId: number;
  typeOfResourceId: number;
  courseId: string;
  file?: File;
  url?: string;
}

export interface EditResourceRequest {
  title: string;
  description: string;
  resourceCategoryId: number;
  typeOfResourceId: number;
  url?: string;
}
interface ResourceType {
  resourceId: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  typeOfResource: {
    id: number;
    name: string;
  };
  resourceCategory: {
    id: number;
    name: string;
  };
  fileId: string;
  fileName: string;
  fileType: string;
  link?: string;
}
