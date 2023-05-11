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

  async insertRecord() {
    const result = await db.run(
      'INSERT INTO tbl (col) VALUES (?)',
      'foo'
    )
  }

  async deleteRecordByKey(table: string, keyName: string, keyValue: string) {

  }


  private makeColStr(cols?: string[]): string {
    return (cols) ? cols.join(',') : '*'
  }

  private makeWhereStr(where?: string): string {
    return (where) ? `WHERE ${where}` : ''
  }

}
