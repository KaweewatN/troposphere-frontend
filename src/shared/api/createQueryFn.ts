import type { AxiosResponse } from "axios";
import { api } from "./axios.config";

interface QueryFnParams {
  path: string;
}

/**
 * Generic query function for GET requests
 * Used with React Query's queryFn
 */
export async function createQueryFn<TResponse>({
  path,
}: QueryFnParams): Promise<TResponse> {
  const response: AxiosResponse<TResponse> = await api.get(path);
  return response.data;
}
