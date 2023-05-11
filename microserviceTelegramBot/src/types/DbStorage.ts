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

  create<T = Record<string, any>>(tableName: string, record: Record<any, any>): Promise<T>

  updateByKey<T = Record<string, any>>(
    tableName: string,
    partialData: Record<any, any>,
    keyName: string,
    value: string
  ): Promise<T>

  update<T = Record<string, any>>(
    tableName: string,
    partialData: Record<any, any>,
    where: string
  ): Promise<T>

  deleteByKey(table: string, keyName: string, value: string): Promise<void>

  delete(table: string, where: string): Promise<void>
}
