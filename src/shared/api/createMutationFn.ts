import type { AxiosResponse } from "axios";
import { api } from "./axios.config";

interface MutationFnParams<TBody> {
  path: string;
  body: TBody;
}

/**
 * Generic mutation function for POST requests (Create)
 * Used with React Query's mutationFn
 */
export async function createMutationFn<TResponse, TBody>({
  path,
  body,
}: MutationFnParams<TBody>): Promise<TResponse> {
  const response: AxiosResponse<TResponse> = await api.post(path, body);
  return response.data;
}
