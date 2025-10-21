import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import * as qs from "qs";
import { createQueryFn } from "../../api/createQueryFn";
import { createMutationFn } from "../../api/createMutationFn";
import { createDeleteMutationFn } from "../../api/createDeleteMutationFn";
import { createUpdateMutationFn } from "../../api/createUpdateMutationFn";

/**
 * Query factory for generating type-safe CRUD operations
 *
 * @template CreateResponse - Response type for create operation
 * @template CreateBody - Request body type for create operation
 * @template ReadResponse - Response type for read list operation
 * @template ReadOneResponse - Response type for read one operation
 * @template UpdateResponse - Response type for update operation
 * @template UpdateBody - Request body type for update operation
 * @template DeleteResponse - Response type for delete operation
 * @template DeleteParams - Parameters for delete operation
 *
 * @param entity - Entity name (e.g., 'users', 'posts')
 * @returns Object with query and mutation configurations
 *
 * @example
 * ```ts
 * const userQueries = createQueries<
 *   User,
 *   CreateUserDto,
 *   User[],
 *   User,
 *   User,
 *   UpdateUserDto,
 *   void,
 *   { id: number }
 * >('users');
 * ```
 */
export const createQueries = <
  CreateResponse,
  CreateBody,
  ReadResponse,
  ReadOneResponse,
  UpdateResponse,
  UpdateBody,
  DeleteResponse,
  DeleteParams
>(
  entity: string
) => ({
  /**
   * Base query key for all entity operations
   */
  all: () =>
    queryOptions({
      queryKey: [entity],
    }),

  /**
   * Create mutation configuration (POST)
   */
  create: () => ({
    mutationKey: [entity, "create"],
    mutationFn: (body: CreateBody) =>
      createMutationFn<CreateResponse, CreateBody>({
        path: `/${entity}`,
        body,
      }),
    placeholderData: keepPreviousData,
  }),

  /**
   * Read list query configuration (GET with filters)
   * @param filters - Query parameters for filtering/pagination
   */
  read: (filters?: Record<string, unknown>) =>
    queryOptions({
      queryKey: [entity, filters],
      queryFn: () =>
        createQueryFn<ReadResponse>({
          path: `/${entity}${filters ? `?${qs.stringify(filters)}` : ""}`,
        }),
      placeholderData: keepPreviousData,
    }),

  /**
   * Read one query configuration (GET by ID)
   * @param params - Parameters containing the ID
   */
  readOne: (params: { id: string | number }) =>
    queryOptions({
      queryKey: [entity, params.id],
      queryFn: () =>
        createQueryFn<ReadOneResponse>({
          path: `/${entity}/${params.id}`,
        }),
      placeholderData: keepPreviousData,
    }),

  /**
   * Update mutation configuration (PUT)
   */
  update: () => ({
    mutationKey: [entity, "update"],
    mutationFn: (params: { id: string | number; body: UpdateBody }) =>
      createUpdateMutationFn<UpdateResponse, UpdateBody>({
        path: `/${entity}/${params.id}`,
        body: params.body,
      }),
    placeholderData: keepPreviousData,
  }),

  /**
   * Delete mutation configuration (DELETE)
   */
  delete: () => ({
    mutationKey: [entity, "delete"],
    mutationFn: (params: DeleteParams) =>
      createDeleteMutationFn<DeleteResponse>({
        path: `/${entity}/${
          (params as DeleteParams & { id: string | number }).id
        }`,
      }),
    placeholderData: keepPreviousData,
  }),
});
