import mysql from 'mysql2/promise'
import fs from 'fs'

export async function genDict() {
  const connection = await connect()
  const dict = (await getDict(connection)) as any[]
  const dictItem = (await getDictItem(connection)) as any[]
  const res: Record<string, { label: string; value: string }[]> = {}
  dict.forEach((value) => {
    dictItem.forEach((item) => {
      if (item.dict_id === value.id) {
        if (res[value.dict_key]) {
          res[value.dict_key].push({
            label: item.label,
            value: item.value,
          })
        } else {
          res[value.dict_key] = [
            {
              label: item.label,
              value: item.value,
            },
          ]
        }
      }
    })
  })
  fs.writeFileSync('../../packages/tool-gen-api/dict.json', JSON.stringify(res))
}

async function connect() {
  const connection = await mysql.createConnection({
    host: '10.0.100.188',
    port: 3306,
    user: 'root',
    password: 'fskj123456',
    database: 'mdbd_upms',
    connectTimeout: 20 * 1000,
  })
  return connection
}

async function getDict(connection: mysql.Connection) {
  const [rows] = await connection.execute('SELECT `id`,`dict_key` FROM `sys_dict`')
  return rows
}

async function getDictItem(connection: mysql.Connection) {
  const [rows] = await connection.execute('SELECT `dict_id`,`label`,`value` FROM `sys_dict_item`')
  return rows
}
