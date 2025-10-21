import type { AxiosResponse } from "axios";
import { api } from "./axios.config";

interface DeleteMutationFnParams {
  path: string;
}

/**
 * Generic mutation function for DELETE requests
 * Used with React Query's mutationFn
 */
export async function createDeleteMutationFn<TResponse>({
  path,
}: DeleteMutationFnParams): Promise<TResponse> {
  const response: AxiosResponse<TResponse> = await api.delete(path);
  return response.data;
}
