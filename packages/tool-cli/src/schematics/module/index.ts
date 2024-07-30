import {
  url,
  Rule,
  applyTemplates,
  move,
  chain,
  mergeWith,
  MergeStrategy,
  apply,
  Tree,
  filter,
  noop,
} from '@angular-devkit/schematics'
import { normalize, posix, relative } from 'path'
import { strings } from '@angular-devkit/core'
import { readIntoSourceFile } from '../../utils/file'
import { findNodes, insertImport, getTextIndentation } from '../../utils/ast-utils'
import * as ts from 'typescript'
import { InsertChange } from '../../utils/change'
import { defaultsDeep } from 'lodash'
import { CliConfigItem } from '../../config.dto'
import { DEFAULT_VIEW_CONFIG } from '../../config'

const { join } = posix

interface ModuleConfig extends CliConfigItem {
  name: string
  modulePath: string
  ignoreRouteInject: boolean
}

function setViewRouter(options: Required<ModuleConfig>): Rule {
  return (host: Tree) => {
    const classifyName = strings.classify(options.name)

    const routerPath = options.modulePath
      ? join(options.root, options.modulePath, '/index.route.ts')
      : join(options.router)
    const routerDir = options.router
      .split('/')
      .filter((n, i, arr) => {
        return i !== arr.length - 1
      })
      .join('/')
    const routerSource = readIntoSourceFile(host, routerPath)
    const viewRouteName = `${classifyName}Routes`
    const viewRoutePath = options.modulePath
      ? join('./', options.modulePath, '/index.route')
      : join(relative(routerDir, options.root).split('\\').join('/'), options.name, '/index.route')
    const change = insertImport(routerSource, routerPath, viewRouteName, viewRoutePath, true)
    const routerRecorder = host.beginUpdate(routerPath)
    if (change instanceof InsertChange) {
      routerRecorder.insertLeft(change.pos, change.toAdd)
    }

    // 默认最后一个带有routes属性的对象为Router对象
    const arrayNodes = findNodes(routerSource, ts.SyntaxKind.VariableDeclaration)
      .reverse()
      .filter((node: ts.Node) => {
        return node.getChildren().some((node) => node.getText() === 'routes')
      })
    if (arrayNodes && arrayNodes.length) {
      const routerNode = arrayNodes[0]
      const routesArrayNode = routerNode
        .getChildren()
        .find((node) => node.kind === ts.SyntaxKind.ArrayLiteralExpression)
      if (routesArrayNode) {
        const indentation = getTextIndentation(
          (routesArrayNode as ts.ArrayLiteralExpression).elements
            .find((node) => node.kind === ts.SyntaxKind.ObjectLiteralExpression)!
            .getFullText()
        )
        const routesChange = new InsertChange(
          routerPath,
          routesArrayNode.pos + 2,
          `${indentation}...${viewRouteName},`
        )
        routerRecorder.insertLeft(routesChange.pos, routesChange.toAdd)
      }
    }

    host.commitUpdate(routerRecorder)
    return host
  }
}

export function module(options: Required<ModuleConfig>): Rule {
  return () => {
    // 设置默认和用户配置
    defaultsDeep(options, DEFAULT_VIEW_CONFIG)

    const movePath = normalize(options.root)
    const templateSource = apply(url('./templates'), [
      options.ignoreRouteInject
        ? filter((path) => !path.endsWith('index.route.ts.template'))
        : noop(),
      applyTemplates({ ...strings, ...options }),
      move(movePath),
    ])
    return chain([
      !options.ignoreRouteInject ? setViewRouter(options) : noop(),
      mergeWith(templateSource, MergeStrategy.Overwrite),
    ])
  }
}
