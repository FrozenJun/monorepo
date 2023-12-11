import { JsonDB, Config } from 'node-json-db'
import path from 'path'

class RoleDbCls {
  private db: JsonDB

  constructor() {
    this.db = new JsonDB(
      new Config(path.join(__dirname, '../../database', 'role'), false, false, '\\'),
    )
    console.log(path.join(__dirname, '../../database', 'role'))
  }

  async get() {
    const result = await this.db.getData('/data')
    console.log(result)
    return result
  }
}

export const roleDb = new RoleDbCls()
