import { main } from '../utils/schematics-cli'
import { createConsoleLogger } from '@angular-devkit/core/node'
import { CliConfigItem, GenerateItem } from '../config.dto'
import { colors } from '../utils/terminal'
import { defaultsDeep } from 'lodash'
import { DEFAULT_VIEW_CONFIG } from '../config'

interface ViewDirCliItem extends GenerateItem {
  parentPath?: string
  child?: (ViewDirCliItem | string)[]
}

export async function generateView(originalConfig: CliConfigItem) {
  const config = defaultsDeep(originalConfig, DEFAULT_VIEW_CONFIG)
  const dirs = config.generate
  const logger = createConsoleLogger(false)

  if (!dirs || !dirs.length) return
  for (let i = 0; i < dirs.length; i++) {
    try {
      if (typeof dirs[i] === 'string') {
        dirs[i] = getCliItemByString(dirs[i])
      }
      dirs[i].viewType = dirs[i].viewType || 'module'
      dirs[i].templatePath = dirs[i].templatePath || config.templatePath
      dirs[i].handlerPath = dirs[i].handlerPath || config.handlerPath
      await callSchematics(dirs[i], config, undefined, originalConfig.ignoreRouteInject)
    } catch (e) {
      logger.warn(e.message)
    }
  }
}

async function callSchematics(
  dir: ViewDirCliItem | string,
  config: CliConfigItem,
  parentDir?: ViewDirCliItem,
  ignoreRouteInject?: boolean
) {
  if (typeof dir === 'string') {
    dir = getCliItemByString(dir, parentDir)
  }
  throwTypeError(dir, parentDir)

  if (!dir.viewType) getCliItemType(dir, parentDir)
  const { name, viewType, parentPath = '', templatePath, handlerPath } = dir
  const viewPath = config.root
  let args: string[] = []
  switch (viewType) {
    case 'module':
      args = ['tool-cli:module', `--name=${name}`]
      parentPath && args.push(`--modulePath=${parentPath}`)
      templatePath && args.push(`--templatePath=${templatePath}`)
      handlerPath && args.push(`--handlerPath=${handlerPath}`)
      ignoreRouteInject && args.push(`--ignoreRouteInject=${ignoreRouteInject}`)
      await main({
        args,
        isAutoGenerated: true,
        itemConfig: config,
      })
      break
    case 'page':
      args = ['tool-cli:view', `--name=${name}`]
      parentPath && args.push(`--modulePath=${parentPath}`)
      templatePath && args.push(`--templatePath=${templatePath}`)
      ignoreRouteInject && args.push(`--ignoreRouteInject=${ignoreRouteInject}`)
      await main({
        args,
        isAutoGenerated: true,
        itemConfig: config,
      })
      break
    case 'component':
      args = ['tool-cli:dependent', `--name=${name}`, `--hostPath=${viewPath}/${parentPath}`]
      templatePath && args.push(`--templatePath=${templatePath}`)
      handlerPath && args.push(`--handlerPath=${handlerPath}`)
      await main({
        args,
        isAutoGenerated: true,
        itemConfig: config,
      })
  }

  if (dir.child) {
    for (let i = 0; i < dir.child.length; i++) {
      let child = dir.child[i]
      if (typeof child === 'string') child = getCliItemByString(child, dir)
      if (parentDir) {
        if (parentDir.viewType === 'module') {
          child.parentPath = `${parentPath}/${name}`
        } else if (parentDir.viewType === 'component') {
          child.parentPath = `${parentPath}/components/${name}`
        } else {
          child.parentPath = `${parentPath}/src/components/${name}`
        }
      } else {
        child.parentPath = name
      }
      await callSchematics(child, config, dir)
    }
  }
}

function throwTypeError(dir: ViewDirCliItem, parentDir?: ViewDirCliItem) {
  if (dir.viewType === 'module' && parentDir && parentDir.viewType !== 'module') {
    throw new Error(`${colors.red('ERROR')} module:${dir.name}只能在是module的child中！`)
  }
  if (dir.viewType === 'page' && parentDir && parentDir.viewType !== 'module') {
    throw new Error(`${colors.red('ERROR')} page:${dir.name}只能在是module的child中！`)
  }
  if (
    dir.viewType === 'component' &&
    (!parentDir || !(parentDir.viewType === 'page' || parentDir.viewType === 'component'))
  ) {
    throw new Error(`${colors.red('ERROR')} component:${dir.name}不能写在model或者顶层！`)
  }
}

function getCliItemByString(name: string, parentDir?: ViewDirCliItem) {
  const dir: ViewDirCliItem = { name }
  getCliItemType(dir, parentDir)
  return dir
}

function getCliItemType(dir: ViewDirCliItem, parentDir?: ViewDirCliItem) {
  if (!parentDir) {
    dir.viewType = 'module'
  } else {
    switch (parentDir.viewType) {
      case 'module':
        dir.viewType = 'page'
        break
      case 'page':
        dir.viewType = 'component'
        break
      case 'component':
        dir.viewType = 'component'
        break
      default:
        dir.viewType = 'page'
    }
  }
}
