export const CreateInMemoryCredService = <
  TEntity extends object,
  TId = number | string,
  TCreate = Partial<TEntity>,
  TUpdate = Partial<TEntity>,
>(Options: {
  initialData: TEntity[];
  idKey: keyof TEntity;
  createId?: () => TId;
}) => {
  const { initialData, idKey, createId } = Options

  let data = [...initialData]
  const getId = (entity: TEntity) => entity[idKey] as TId

  return {
    list: async () => {
      return [...data]
    },

    getById: async (id: TId) => {
      const found = data.find((item) => getId(item) === id)
      if (!found) throw new Error(`Entity with id ${id} not found`)
      return found
    },

    create: async (payload: TCreate) => {
      const newEntity: any = { ...payload }

      if (createId) {
        newEntity[idKey] = createId()
      } else if (newEntity[idKey] === null || newEntity[idKey] === undefined) {
        const maxId =
          data.reduce((max, item) => {
            const v = Number(item[idKey])
            return Number.isFinite(v) && v > max ? v : max
          }, 0) || 0

        newEntity[idKey] = maxId + 1
      }

      data = [...data, newEntity]
      return newEntity as TEntity
    },

    update: async (id: TId, payload: TUpdate) => {
      let updated: TEntity | undefined

      data = data.map((item) => {
        if (getId(item) === id) {
          updated = { ...item, ...payload } as TEntity
          return updated
        } else {
          return item
        }
      })

      if (!updated) throw new Error(`Entity with id ${id} not found`)
      return updated!
    },

    delete: async (id: TId) => {
      const before = data.length
      data = data.filter((item) => getId(item) !== id)
      if (data.length === before)
        throw new Error(`Entity with id ${id} not found`)
    },
  }
}
