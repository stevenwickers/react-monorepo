import { AxiosInstance, AxiosRequestHeaders } from 'axios'

export interface CredServiceConfig<TId = number> {
  basePath: string;
  idParamName?: string;
  client?: AxiosInstance;
}

export const CreateCrudService = <
  TEntity,
  TId = number | string,
  TCreate = Partial<TEntity>,
  TUpdate = Partial<TEntity>,
>(
  config: CredServiceConfig<TId>,
) => {
  const { basePath, client, idParamName = 'id' } = config
  const http = client!

  return {
    list: (params?: Record<string, unknown>) =>
      http.get<TEntity[]>(basePath, { params }).then((res) => res.data),

    getById: (id: TId) =>
      http.get<TEntity>(`${basePath}/${id}`).then((res) => res.data),

    create: (payload: TCreate) =>
      http.post<TEntity>(basePath, payload).then((res) => res.data),

    update: (id: TId, payload: TUpdate) =>
      http.put<TEntity>(`${basePath}/${id}`, payload).then((res) => res.data),

    delete: (id: TId) =>
      http.delete<void>(`${basePath}/${id}`).then((res) => res.data),
  }
}
