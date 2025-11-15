import type { AxiosResponse, AxiosError } from "axios";
import { api } from "./axios.config";

interface DeleteMutationFnParams {
  path: string;
}

interface ErrorResponse {
  detail?: string | { msg: string; type: string }[];
  message?: string;
  error?: string;
}

/**
 * Generic mutation function for DELETE requests
 * Used with React Query's mutationFn
 */
export async function createDeleteMutationFn<TResponse>({
  path,
}: DeleteMutationFnParams): Promise<TResponse> {
  try {
    const response: AxiosResponse<TResponse> = await api.delete(path);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;

    // Extract error message from response
    let errorMessage = `DELETE ${path} failed`;

    if (axiosError.response) {
      const status = axiosError.response.status;
      const data = axiosError.response.data;

      // Try to extract meaningful error message from various response formats
      if (data) {
        if (typeof data.detail === "string") {
          errorMessage = data.detail;
        } else if (Array.isArray(data.detail)) {
          // FastAPI validation errors format
          errorMessage = data.detail.map((err) => err.msg).join(", ");
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = data.error;
        } else {
          errorMessage = `${status} ${axiosError.response.statusText}: ${path}`;
        }
      } else {
        errorMessage = `${status} ${axiosError.response.statusText}: ${path}`;
      }
    } else if (axiosError.request) {
      // Request was made but no response received
      errorMessage = `No response received from ${path}`;
    } else {
      // Something else happened
      errorMessage = axiosError.message || errorMessage;
    }

    // Create a new error with the detailed message
    const detailedError = new Error(errorMessage) as Error & {
      originalError?: AxiosError<ErrorResponse>;
    };
    // Preserve the original axios error for debugging
    detailedError.originalError = axiosError;

    throw detailedError;
  }
}
