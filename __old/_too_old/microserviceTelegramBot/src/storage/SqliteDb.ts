import fs from 'node:fs/promises';
import {pathJoin, mkdirPLogic, omitObj} from '../../../../../../../../../mnt/disk2/workspace/squidlet-lib';
import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'
import {DbStorage} from '../types/DbStorage';
import {Main} from '../Main';
import {isFileOrDirExists} from '../helpers/common';
import {CREATED_COL, DB_BOTS_COLS, DB_CHATS_COLS, DB_TABLES, UPDATED_COL} from '../types/dbTypes';


const SQLITE_DB_DIR = 'sqliteDBs'
const SQLITE_DB_FILE_EXT = '.db'


export class SqliteDb implements DbStorage {
  private readonly main: Main
  private db!: Database
  private dbName!: string


  constructor(main: Main) {
    this.main = main
  }


  async init(dbName: string) {
    this.dbName = dbName

    const dbDir = pathJoin(this.main.config.longStoragePath, SQLITE_DB_DIR)
    const filename = pathJoin(dbDir, dbName) + SQLITE_DB_FILE_EXT

    await mkdirPLogic(dbDir, isFileOrDirExists, fs.mkdir)

    const needInit = !(await isFileOrDirExists(filename))

    if (this.main.config.debug) sqlite3.verbose()

    this.db = await open({
      filename,
      //driver: sqlite.cached.Database
      driver: sqlite3.Database
    }) as any

    if (this.main.config.debug) {
      this.db.on('trace', (data: any) => {
        console.log('SQL:', data)
      })
    }

    if (needInit) await this.initDb()
  }

  async destroy() {
    this.main.log.debug(`Closing db ${this.dbName}`)
    await this.db.close()
  }


  async exists(tableName: string, id: string | number): Promise<boolean> {
    // TODO: как-то сделать одним запросом
    const pk = await this.db.get(`SELECT name FROM pragma_table_info('${tableName}') WHERE pk = 1;`)
    const pkName = pk.name

    const res = await this.db.get(
      `SELECT ${pkName} FROM ${tableName} WHERE ${pkName} = ?`,
      id
    )

    return Boolean(res)
  }

  async getOne<T = any>(
    tableName: string,
    id: string | number,
    cols?: string[]
  ): Promise<T | undefined> {
    const colsStr = this.makeColStr(cols)
    // TODO: как-то сделать одним запросом
    const pk = await this.db.get(`SELECT name FROM pragma_table_info('${tableName}') WHERE pk = 1;`)
    const pkName = pk.name

    return this.db.get<T>(
      `SELECT ${colsStr} FROM ${tableName} WHERE ${pkName} = ?`,
      id
    )
  }

  async getOneWhere<T = any>(
    tableName: string,
    where: string,
    cols?: string[]
  ): Promise<T | undefined> {
    const colsStr = this.makeColStr(cols)

    return this.db.get<T>(`SELECT ${colsStr} FROM ${tableName} WHERE ${where}`)
  }

  async getAll<T = Record<string, any>>(
    tableName: string,
    where?: string,
    orderBy?: string,
    desc: boolean = false,
    cols?: string[]
  ): Promise<T[]> {
    const colsStr = this.makeColStr(cols)
    const whereStr = (where) ? `WHERE ${where}` : ''
    const orderStr = (orderBy) ? `ORDER BY ${orderBy} ${(desc) ? 'DESC' : ''}` : ''

    return this.db.all<T[]>(`SELECT ${colsStr} FROM ${tableName} ${whereStr} ${orderStr}`)
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

  async create(tableName: string, record: Record<any, any>): Promise<string | number> {
    const normalizedRecord = {
      ...this.normalizeData(record),
      created: new Date().toISOString()
    }
    const valuesStr = Object.keys(normalizedRecord).map(() => '?').join(',')

    const res = await this.db.run(
      `INSERT INTO ${tableName} (${Object.keys(normalizedRecord).join(',')}) VALUES (${valuesStr})`,
      ...Object.values(normalizedRecord),
    )

    if (!res.changes) throw new Error(`Wasn't created`)

    return res.lastID!
  }

  async update(
    tableName: string,
    id: string | number,
    partialData: Record<any, any>,
  ): Promise<void> {
    const normalizedData = this.normalizeData(partialData)
    const setStr: string = Object.keys(normalizedData).map((key) => {
      return `${key} = ?`
    }).join(', ')

    // TODO: как-то сделать одним запросом
    const pk = await this.db.get(`SELECT name FROM pragma_table_info('${tableName}') WHERE pk = 1;`)
    const pkName = pk.name

    const res = await this.db.run(
      `UPDATE ${tableName} SET ${setStr} WHERE ${pkName} = ${id}`,
      ...Object.values(normalizedData)
    )

    if (!res.changes) throw new Error(`Wasn't updated`)
  }

  async updateAll(
    tableName: string,
    partialData: Record<any, any>,
    where: string
  ): Promise<void> {
    const normalizedData = this.normalizeData(partialData)
    const setStr: string = Object.keys(normalizedData).map((key) => {
      return `${key} = ?`
    }).join(', ')

    const res = await this.db.run(
      `UPDATE ${tableName} SET ${setStr} WHERE ${where}`,
      'foo',
      'test'
    )

    if (!res.changes) throw new Error(`Wasn't updated`)
  }

  async delete(tableName: string, id: string | number) {
    // TODO: как-то сделать одним запросом
    const pk = await this.db.get(`SELECT name FROM pragma_table_info('${tableName}') WHERE pk = 1;`)
    const pkName = pk.name
    const result = await this.db.run(
      `DELETE FROM ${tableName} WHERE ${pkName} = ${id}`
    )

    if (!result.changes) throw new Error(`Wasn't deleted`)
  }

  async deleteAll(table: string, where: string) {
    const result = await this.db.run(
      `DELETE FROM ${table} WHERE ${where}`
    )

    if (!result.changes) throw new Error(`Wasn't deleted`)
  }


  private makeColStr(cols?: string[]): string {
    return (cols) ? cols.join(',') : '*'
  }

  private normalizeData(dataToInsertOrUpdate: Record<any, any>): Record<any, any> {
    return omitObj(dataToInsertOrUpdate, CREATED_COL, UPDATED_COL)
  }

  private async initDb() {
    this.main.log.debug(`Creating db ${this.dbName}`)

    await this.db.exec(`PRAGMA foreign_keys = ON;`)

    await this.db.exec(`
      CREATE TABLE ${DB_TABLES.bots} (
        ${DB_BOTS_COLS.botId} TEXT PRIMARY KEY,
        ${DB_BOTS_COLS.token} TEXT NOT NULL,
        ${DB_BOTS_COLS.created} DATETIME
      );
    `)
    await this.db.exec(`
      CREATE TABLE ${DB_TABLES.chats} (
        ${DB_CHATS_COLS.chatId} TEXT PRIMARY KEY,
        ${DB_CHATS_COLS.botId} TEXT NOT NULL,
        ${DB_CHATS_COLS.created} DATETIME,
        FOREIGN KEY (${DB_BOTS_COLS.botId})
          REFERENCES ${DB_TABLES.bots}(${DB_BOTS_COLS.botId})
      );
    `)

    this.main.log.debug(`DB ${this.dbName} was successfully created`)
  }

}
