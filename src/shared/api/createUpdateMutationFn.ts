import type { AxiosResponse } from "axios";
import { api } from "./axios.config";

interface UpdateMutationFnParams<TBody> {
  path: string;
  body: TBody;
}

/**
 * Generic mutation function for PUT/PATCH requests (Update)
 * Used with React Query's mutationFn
 */
export async function createUpdateMutationFn<TResponse, TBody>({
  path,
  body,
}: UpdateMutationFnParams<TBody>): Promise<TResponse> {
  const response: AxiosResponse<TResponse> = await api.put(path, body);
  return response.data;
}
