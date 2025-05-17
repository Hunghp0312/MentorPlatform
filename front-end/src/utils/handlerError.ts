import { AxiosError } from "axios";
import { toast } from "react-toastify";

interface ErrorResponse {
  message?: string;
  errors?: Record<string, string>;
}

export const handleAxiosError = (error: AxiosError<ErrorResponse>) => {
  if (error?.response?.data?.message) {
    toast.error(error.response.data.message);
  }
  if (error?.response?.data?.errors) {
    for (const key in error.response.data.errors) {
      const errorMessage = error.response.data.errors[key];
      toast.error(`${errorMessage}`);
    }
  }
};
