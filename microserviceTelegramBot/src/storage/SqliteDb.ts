import sqlite, { open } from 'sqlite'
import {DbStorage} from '../types/DbStorage.js';
import {Main} from '../Main.js';


export class SqliteDb implements DbStorage {
  private readonly main: Main
  private db!: sqlite.Database


  constructor(main: Main) {
    this.main = main
  }


  async init() {

    // TODO: проверить если нет файла то режим инициации бд

    this.db = await open({
      filename: '',
      //driver: sqlite.cached.Database
      driver: sqlite.Database
    })

    this.db.on('trace', (data: string) => {
      this.main.log.error(data)
    })


  }

  async destroy() {
    await this.db.close()
  }


  private async initDb() {
    await this.db.exec('CREATE TABLE tbl (col TEXT)')
    await this.db.exec('INSERT INTO tbl VALUES ("test")')
  }


  async getOne<T = any>(tableName: string, where?: string, cols?: string[]): Promise<T | undefined> {
    const colsStr = this.makeColStr(cols)
    const whereStr = this.makeWhereStr(where)

    return this.db.get<T>(`SELECT ${colsStr} FROM ${tableName} ${whereStr}`)
  }

  async getOneByKey<T = any>(
    tableName: string,
    keyName: string,
    value: any,
    cols?: string[]
  ): Promise<T | undefined> {
    const colsStr = this.makeColStr(cols)

    return this.db.get<T>(
      `SELECT ${colsStr} FROM ${tableName} WHERE ${keyName} = ?`,
      value
    )
  }

  async getAll<T = Record<string, any>>(
    tableName: string,
    where?: string,
    cols?: string[]
  ): Promise<T[]> {
    const colsStr = this.makeColStr(cols)
    const whereStr = this.makeWhereStr(where)

    // ORDER BY col DESC

    return this.db.all<T[]>(`SELECT ${colsStr} FROM ${tableName} ${whereStr}`)
  }

  async getAllByKey<T = Record<string, any>>(
    tableName: string,
    keyName: string,
    value: any,
    cols?: string[]
  ): Promise<T[]> {
    const colsStr = this.makeColStr(cols)

    return this.db.all<T[]>(
      `SELECT ${colsStr} FROM ${tableName} WHERE ${keyName} = ?`,
      value
    )
  }

  async create<T = Record<string, any>>(
    tableName: string,
    record: Record<any, any>
  ): Promise<T> {
    const result = await this.db.run(
      'INSERT INTO tbl (col) VALUES (?)',
      'foo'
    )

    // TODO: проверить результат
    //res.changes

    // TODO: вернуть результат
  }

  async updateByKey<T = Record<string, any>>(
    tableName: string,
    partialData: Record<any, any>,
    keyName: string, value: string
  ): Promise<T> {
    const result = await this.db.run(
      `UPDATE ${tableName} SET col = ? WHERE col = ?`,
      'foo',
      'test'
    )

    // TODO: проверить результат
    //res.changes

    // TODO: вернуть результат
  }

  async update<T = Record<string, any>>(
    tableName: string,
    partialData: Record<any, any>,
    where: string
  ): Promise<T> {
    const result = await this.db.run(
      `UPDATE ${tableName} SET col = ? WHERE col = ?`,
      'foo',
      'test'
    )

    // TODO: проверить результат
    //res.changes

    // TODO: вернуть результат
  }

  async deleteByKey(table: string, keyName: string, value: string) {
    const result = await this.db.run(
      `DELETE FROM ${table} WHERE ${keyName} = ${value}`
    )

    // TODO: проверить результат
    //result.changes
  }

  async delete(table: string, where: string) {
    const result = await this.db.run(
      `DELETE FROM ${table} WHERE ${where}`
    )

    // TODO: проверить результат
    //result.changes
  }


  private makeColStr(cols?: string[]): string {
    return (cols) ? cols.join(',') : '*'
  }

  private makeWhereStr(where?: string): string {
    return (where) ? `WHERE ${where}` : ''
  }

}
