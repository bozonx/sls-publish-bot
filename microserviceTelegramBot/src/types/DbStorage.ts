export interface DbStorage {
  init(dbName: string): Promise<void>
  destroy(): Promise<void>


  getOne<T = any>(tableName: string, id: any, cols?: string[]): Promise<T | undefined>

  getOneWhere<T = any>(
    tableName: string,
    where: string,
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

  /**
   * Create and return an id
   */
  create(tableName: string, record: Record<any, any>): Promise<string | number>

  // TODO: createAll

  /**
   * Update using primary key
   */
  update(
    tableName: string,
    id: string | number,
    partialData: Record<any, any>,
  ): Promise<void>

  updateAll(
    tableName: string,
    partialData: Record<any, any>,
    where: string
  ): Promise<void>

  /**
   * Delete by primary key
   */
  delete(table: string, id: string | number): Promise<void>

  deleteAll(table: string, where: string): Promise<void>
}
