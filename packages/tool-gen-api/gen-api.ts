import got from 'got'
import _ from 'lodash'
import rimraf from 'rimraf'
import pkg from 'shelljs'
import {
  readFileSync,
  readdirSync,
  writeFileSync,
  unlinkSync,
  stat,
  existsSync,
  mkdirSync,
} from 'fs'
import { resolve, dirname } from 'path'
import dotenv from 'dotenv'

interface EnumObj {
  name: string
  values: Array<[number, string]>
}

interface IGenApiOption {
  ignoreQuotesWhenValNotNumber?: boolean
  // 是否需要根据字典生成枚举
  useDict?: boolean
  // 输出位置
  output?: string
  // swagger地址
  swaggerUrl?: string
  // 是否是小程序
  isApp?: boolean
}

export async function genApi({
  ignoreQuotesWhenValNotNumber,
  useDict,
  output = 'src/app/api/',
  swaggerUrl,
  isApp,
}: IGenApiOption = {}) {
  dotenv.config({ path: 'environments/.env' })
  if (useDict) {
    genApiByDict(output)
  } else {
    genApiByAnnotation(output, ignoreQuotesWhenValNotNumber, swaggerUrl, isApp)
  }
}

// 生成api通过注释来生成枚举值
function genApiByAnnotation(
  output: string,
  ignoreQuotesWhenValNotNumber?: boolean,
  swaggerUrl?: string,
  isApp?: boolean
) {
  const { exec } = pkg as any
  const baseUrl = swaggerUrl ?? process.env['OPEN_API_URL']
  const baseOutput = output
  const URLs = [{ swaggerUrl: baseUrl, output: `${baseOutput}` }]
  const indexFilePath = resolve(baseOutput, 'index.ts')
  const enumTag = '@enum'
  const encoding = 'utf8'
  for (const url of URLs) {
    updateApi(url)
  }
  async function updateApi({ swaggerUrl, output }) {
    const json = (await serverAvaliable(swaggerUrl)) as any
    // let apiModule = _.last(json.servers[0].url.split("/")) || "";
    const apiModule = ''
    // 统一删了重来
    rimraf(output, () => {
      const jsonDir = isApp ? 'ng-openapi-gen-app.json' : 'ng-openapi-gen.json'
      exec(
        `npx ng-openapi-gen --config ../../packages/tool-gen-api/${jsonDir} --input ${swaggerUrl} --output ${output}`
      )
      const modulePath = `${baseOutput}`
      const modelPath = resolve(modulePath, 'models')
      const servicesPath = resolve(modulePath, 'services')
      existsSync(modulePath) && deleteFile(modulePath)
      // 将枚举值解析出来替换掉
      // service和model文件都需要解析枚举值
      ;[modelPath, servicesPath].forEach((path) => {
        const dirs = readdirSync(path).map((filename) => resolve(path, filename))
        const enumObjs = _(dirs.map((dir) => resolveModelFile(dir)))
          .flatten()
          .uniqBy((o) => o.name)
          .value()
        const enumPath = resolve(path, 'enum.ts')
        writeEnumFile(enumObjs, enumPath)
      })
      const servicesFilePaths = readdirSync(servicesPath).map((filename) =>
        resolve(servicesPath, filename)
      )
      servicesFilePaths.map((path) => resolveServiceFile(path, apiModule, encoding))
    })
  }

  /** 解析model文件 */
  function resolveModelFile(path: string): EnumObj[] {
    let enumObjs: EnumObj[] = []
    const content = readFileSync(path, encoding)
      // 换行符替换成统一的
      .replace(/\r\n/g, '\n')
    const lines = content.split('\n')
    // 是否遇到枚举值了，遇到枚举值时则准备把字段替换成枚举值
    let meetEnum = false
    // 当前的枚举值对象
    let enumObj: EnumObj | undefined
    // 新的所有行，在最后时重写model文件
    const newLines: string[] = []
    for (const line of lines) {
      // 已经碰到enum了则要替换
      if (meetEnum && line.includes(': ')) {
        const newLineArr = line.split(': ')
        newLineArr[1] = `${enumObj?.name};`
        const newLine = newLineArr.join(': ')
        newLines.push(newLine)
        meetEnum = false
        continue
      }
      // 没碰到或者不是要替换的就直接用老的行
      newLines.push(line)
      // 遇到枚举标记则解析枚举
      if (line.includes(enumTag)) {
        const arr1 = line.split(enumTag)[1].split('[')
        const enumName = arr1[0].trim()
        const kvArr = arr1[1]
          .replace(/]/, '')
          .replace(/，/g, ',')
          .split(',')
          .map((kvStr) => {
            const kvArr = kvStr.split('(')
            return [kvArr[0] as any, kvArr[1] ? kvArr[1].slice(0, -1) : ''] as [number, string]
          })
        enumObj = {
          name: enumName,
          values: kvArr,
        }
        enumObjs.push(enumObj)
        meetEnum = true
      }
    }
    // 去重
    enumObjs = _.uniqBy(enumObjs, (o) => o.name)
    // 重写该文件
    if (enumObjs.length) {
      const lastImportIndex = _.findLastIndex(newLines, (line) => line.includes('import '))
      const insertIndex = lastImportIndex >= 0 ? lastImportIndex + 1 : 2
      // 加入导入枚举的部分
      newLines.splice(
        insertIndex,
        0,
        `import { ${enumObjs.map((o) => o.name).join(', ')} } from './enum';`
      )
      writeFileSync(path, newLines.join('\n'), {
        encoding,
      })
    }
    return enumObjs
  }

  /** 生成并导出枚举值文件 */
  function writeEnumFile(enumObjs: EnumObj[], enumFilePath: string) {
    const content = _(enumObjs)
      .map((enumObj) => {
        return [
          `export enum ${enumObj.name} {`,
          ...enumObj.values.map(
            (v) =>
              `  ${_.isNaN(parseFloat(v[1])) && !v[1].includes('-') ? v[1] : `'${v[1]}'`} = ${
                _.isNaN(+v[0]) && !ignoreQuotesWhenValNotNumber ? `'${v[0]}'` : v[0]
              },`
          ),
          '}',
          '',
          `export const ${enumObj.name}Option = [`,
          ...enumObj.values.map(
            (v) =>
              `  { ${isApp ? 'text' : 'label'}: '${v[1]}', value: ${
                _.isNaN(+v[0]) && !ignoreQuotesWhenValNotNumber ? `'${v[0]}'` : v[0]
              } },`
          ),
          ']',
          '',
        ]
      })
      .flatten()
      .join('\n')
    writeFileSync(enumFilePath, content, {
      encoding,
    })
    // 导出枚举值文件
    let indexContent = readFileSync(indexFilePath, encoding)
    indexContent += `export * from './models/enum';\n`
    writeFileSync(indexFilePath, indexContent, {
      encoding,
    })
  }
}
// 生成api通过字典来生成枚举值(多维)
function genApiByDict(output) {
  const { exec } = pkg as any
  const baseUrl = process.env['OPEN_API_URL']
  const baseOutput = output
  const services = ['upms', 'iss', 'ams', 'pcs', 'ias', 'ddbs']
  const URLs = services.map((url) => ({
    swaggerUrl: `${baseUrl}/${url}/v3/api-docs`,
    output: `${baseOutput}/${url}`,
  }))
  const enumTag = '@dictType'
  const encoding = 'utf8'
  const enumPath = `${baseOutput}/enum.ts`
  function genEnum() {
    const temp = readFileSync('../../packages/tool-gen-api/dict-temp.json')
    const cur = readFileSync('../../packages/tool-gen-api/dict.json')
    transformDictToEnmu(enumPath, { ...JSON.parse(temp.toString()), ...JSON.parse(cur.toString()) })
  }
  async function updateApi({ swaggerUrl, output }) {
    const json = (await serverAvaliable(swaggerUrl)) as any
    const apiModule = _.last(json.servers[0].url.split('/')) || ''
    // 统一删了重来
    rimraf(output, () => {
      exec(
        `npx ng-openapi-gen --config ../../packages/tool-gen-api/ng-openapi-gen.json --input ${swaggerUrl} --output ${output}`
      )
      const modulePath = `${baseOutput}/${output.slice(output.lastIndexOf('/') + 1)}`
      const modelPath = `${modulePath}/models`
      const servicesPath = `${modulePath}/services`
      deleteFile(modulePath)
      // 将枚举值解析出来替换掉
      const modelFilePaths = readdirSync(modelPath).map((filename) => resolve(modelPath, filename))
      modelFilePaths.forEach((path) => resolveModelFile(path))
      const servicesFilePaths = readdirSync(servicesPath).map((filename) =>
        resolve(servicesPath, filename)
      )
      servicesFilePaths.forEach((path) => resolveServiceFile(path, apiModule, encoding))
    })
  }
  /** 解析model文件 */
  function resolveModelFile(path) {
    let enumObjs: any[] = []
    const content = readFileSync(path, encoding)
      // 换行符替换成统一的
      .replace(/\r\n/g, '\n')
    const lines = content.split('\n')
    // 是否遇到枚举值了，遇到枚举值时则准备把字段替换成枚举值
    let meetEnum = false
    // 当前的枚举值对象
    let enumObj
    // 新的所有行，在最后时重写model文件
    const newLines: string[] = []
    for (const line of lines) {
      // 遇到枚举标记则解析枚举
      if (line.includes(enumTag)) {
        const enumName = line.split('=')[1].trim().toUpperCase()
        enumObj = {
          name: enumName,
        }
        enumObjs.push(enumObj)
        meetEnum = true
      }

      // 已经碰到enum了则要替换
      if (meetEnum && line.includes(': ')) {
        const newLineArr = line.split(': ')
        newLineArr[1] = `${enumObj.name}_ENUM;`
        const newLine = newLineArr.join(': ')
        newLines.push(newLine)
        meetEnum = false
        continue
      }
      // 没碰到或者不是要替换的就直接用老的行
      newLines.push(line)
    }
    // 去重
    enumObjs = _.uniqBy(enumObjs, (o) => o.name)
    // 重写该文件
    if (enumObjs.length) {
      const lastImportIndex = _.findLastIndex(newLines, (line) => line.includes('import '))
      const insertIndex = lastImportIndex >= 0 ? lastImportIndex + 1 : 2
      // 加入导入枚举的部分
      newLines.splice(
        insertIndex,
        0,
        `import { ${enumObjs.map((o) => o.name + '_ENUM').join(', ')} } from '../../enum';`
      )
      writeFileSync(path, newLines.join('\n'), {
        encoding,
      })
    }
    return enumObjs
  }
  //将dict.json转换成枚举类型到enmu.ts文件上
  function transformDictToEnmu(path, dict: Record<string, any[]>) {
    const ignoreEnums = ['ds_type', 'defense_area_control_level', 'geo_hash']
    const keys = _.keys(dict).filter((key) => !ignoreEnums.includes(key))
    let i = -1
    const content = _(dict)
      .filter((val, key) => !ignoreEnums.includes(key))
      .map((enumObj) => {
        i++
        return [
          `export enum ${keys[i].toUpperCase()}_ENUM {`,
          ...enumObj.map((v) => `  '${v.label}' = '${v.value}',`),
          '}',
          `export const ${keys[i].toUpperCase()} = [`,
          ...enumObj.map((v) => `  { label: '${v.label}', value: '${v.value}' },`),
          ']',
          '',
        ]
      })
      .flatten()
      .join('\n')

    createFileWithDirs(path, content, {
      encoding,
    })

    function createFileWithDirs(filePath, content, options) {
      // 获取文件所在的目录路径
      const dirPath = dirname(filePath)

      // 递归地创建文件所在的目录
      mkdirSync(dirPath, { recursive: true })

      // 目录创建后，写入文件
      writeFileSync(filePath, content, options)
    }
  }
}

// 公共方法

async function serverAvaliable(url) {
  try {
    return await got.get(url, { timeout: { request: 2000 } }).json()
  } catch (e) {
    console.error(`server ${url} not avaliable`)
    process.exit(1)
  }
}
// 删除modules目录下的各个文件夹下的非index.ts文件
function deleteFile(path) {
  readdirSync(path).forEach((fileName) => {
    const src = resolve(path, fileName)
    stat(src, (err, stats) => {
      if (stats.isFile()) {
        if (!['model.ts', 'service.ts'].includes(fileName)) {
          unlinkSync(src)
        }
      }
    })
  })
}

function resolveServiceFile(path, apiModule, encoding) {
  const content = readFileSync(path, encoding) as any
  const newContent = content
    .split(`url: '`)
    .join(`url: '/${apiModule}`)
    .split(`url: '/${apiModule}/${apiModule}`) // 如果已经自动生成了，删去重复的
    .join(`url: '/${apiModule}`)
  writeFileSync(path, newContent, {
    encoding,
  })
}
