export interface DbStorage {
  init(): Promise<void>
  destroy(): Promise<void>

  getOne<T = any>(
    tableName: string,
    where?: string,
    cols?: string[]
  ): Promise<T | undefined>

  getOneByKey<T = any>(
    tableName: string,
    keyName: string,
    value: any,
    cols?: string[]
  ): Promise<T | undefined>

  getAll<T = Record<string, any>>(
    tableName: string,
    where?: string,
    cols?: string[]
  ): Promise<T[]>

  getAllByKey<T = Record<string, any>>(
    tableName: string,
    keyName: string,
    value: any,
    cols?: string[]
  ): Promise<T[]>
}
