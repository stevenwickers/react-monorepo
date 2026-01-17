export const createCrudQueryKeys = (resource: string) => {
  const root = [resource] as const
  return {
    all: root,
    list: (filters?: unknown) => [...root, 'list', filters] as const,
    detail: (id: unknown) => [...root, 'detail', id] as const,
  }
}
