import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
  QueryKey,
  useQueryClient,
} from '@tanstack/react-query'
import { createCrudQueryKeys } from './createCrudQueryKeys'

interface CrudHooksConfig<TEntity, TId, TCreate, TUpdate> {
  resource: string;
  service: {
    list: (params?: any) => Promise<TEntity[]>;
    getById: (id: TId) => Promise<TEntity>;
    create: (payload: TCreate) => Promise<TEntity>;
    update: (id: TId, payload: TUpdate) => Promise<TEntity>;
    delete: (id: TId) => Promise<void>;
  };
}

export const CreateCurdHooks = <
  TEntity,
  TId = number | string,
  TCreate = Partial<TEntity>,
  TUpdate = Partial<TEntity>,
>(
  config: CrudHooksConfig<TEntity, TId, TCreate, TUpdate>,
) => {
  const { resource, service } = config
  const keys = createCrudQueryKeys(resource)

  /*** LIST ***/
  const useList = (
    filters?: any,
    options?: UseQueryOptions<TEntity[], Error, TEntity[], QueryKey>,
  ) => {
    return useQuery({
      queryKey: keys.list(filters),
      queryFn: () => service.list(filters),
      ...options,
    })
  }

  /*** DETAIL ***/
  const useDetail = (
    id: TId | undefined,
    options?: UseQueryOptions<TEntity, Error, TEntity, QueryKey>,
  ) => {
    const query = useQuery({
      queryKey: keys.detail(id),
      queryFn: () => {
        if (id === null || id === undefined) throw new Error('Id is required')
        return service.getById(id)
      },
      enabled: id !== null && (options?.enabled ?? true),
      ...options,
    })

    const item = query.data
    return {
      ...query,
      item,
    }
  }

  /*** Create ***/
  const useCreate = (
    options?: UseMutationOptions<TEntity, Error, TCreate, unknown>,
  ) => {
    const qc = useQueryClient()
    const mutation = useMutation({
      mutationFn: (payload) => service.create(payload),
      onSuccess: (...args) => {
        qc.invalidateQueries({ queryKey: keys.all })
        options?.onSuccess?.(...args)
      },
      ...options,
    })

    const create = (payload: TCreate) => mutation.mutate(payload)
    return Object.assign(create, mutation)
  }

  /*** Update ***/
  const useUpdate = (
    options?: UseMutationOptions<TEntity, Error, { id: TId; data: TUpdate }>,
  ) => {
    const qc = useQueryClient()
    const mutation = useMutation({
      mutationFn: ({ id, data }) => service.update(id, data),
      onSuccess: (...args) => {
        const id = args[1]
        qc.invalidateQueries({ queryKey: keys.detail(id) })
        qc.invalidateQueries({ queryKey: keys.list(undefined) })
        options?.onSuccess?.(...args)
      },
      ...options,
    })

    //Return the function
    const update = (id: TId, data: TUpdate) => mutation.mutate({ id, data })
    return Object.assign(update, mutation)
  }

  /*** Delete ***/
  const useDelete = (
    options?: UseMutationOptions<void, Error, TId, unknown>,
  ) => {
    const qc = useQueryClient()
    const mutation = useMutation({
      mutationFn: (id) => service.delete(id),
      onSuccess: (...args) => {
        const id = args[1]
        qc.invalidateQueries({ queryKey: keys.detail(id) })
        qc.invalidateQueries({ queryKey: keys.list(undefined) })
        options?.onSuccess?.(...args)
      },
      ...options,
    })

    //Return the function
    const remove = (id: TId) => mutation.mutate(id)
    return Object.assign(remove, mutation)
  }

  return {
    keys,
    useList,
    useDetail,
    useCreate,
    useUpdate,
    useDelete,
  }
}
