import fs from 'node:fs/promises';


// TODO: get from squidlet-lib
export async function isFileOrDirExists(pathTo: string): Promise<boolean> {
  try {
    await fs.lstat(pathTo)

    return true
  }
  catch (e) {
    // TODO: если другая ошибка то поднимать ошибку
    return false
  }
}
