import * as path from 'path'
import * as fs from 'fs'
import { CONFIG_JS_PATH, CONFIG_TS_PATH } from './constant'
import { colors } from './terminal'

export function LoadFile(filePath: string) {
  if (!fs.existsSync(filePath)) throw new Error(`${colors.red('ERROR')} ${filePath}文件不存在！`)

  try {
    const config = require(filePath).default

    if (!config || typeof config !== 'object') {
      throw new Error(
        `${colors.bold('ERROR')} 加载${colors.red(
          filePath
        )}文件错误: 应该使用export default导出一个对象`
      )
    }
    return config
  } catch (e) {
    throw new Error(e.message || `加载${colors.bold(filePath + '文件')}错误`)
  }
}

export function LoadConfig() {
  const configTSPath = path.resolve(process.cwd(), CONFIG_TS_PATH)
  const configJSPath = path.resolve(process.cwd(), CONFIG_JS_PATH)

  if (configTSPath && fs.existsSync(configTSPath)) return LoadFile(configTSPath)
  if (configJSPath && fs.existsSync(configJSPath)) return LoadFile(configJSPath)
  throw new Error(`${colors.red('ERROR')} cli配置文件不存在！`)
}
