import { defaultsDeep } from 'lodash'
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
import { InsertChange } from '../../utils/change'
import { normalize, join, relative } from 'path'
import { strings } from '@angular-devkit/core'
import { DEFAULT_VIEW_CONFIG } from '../../config'
import { CliConfigItem } from '../../config.dto'
import { readIntoSourceFile, readIntoSourceText } from '../../utils/file'
import { findNodes, isImported, insertImport, getTextIndentation } from '../../utils/ast-utils'
import * as ts from 'typescript'

interface ViewConfig extends CliConfigItem {
  name: string
  modulePath: string
  ignoreRouteInject: boolean
}

export function setViewRouter(options: Required<ViewConfig>): Rule {
  return (host: Tree) => {
    const classifyName = strings.classify(options.name)
    const dasherizeName = strings.dasherize(options.name)

    // 如果是在模块下的页面，只要将新建页面的路由代码注入到模块下的index.route.ts中即可
    if (options.modulePath) {
      const routerPath = join(options.root, options.modulePath, 'index.route.ts')
      const routerSource = readIntoSourceFile(host, routerPath)
      const insertCode = `
  {
    name: '${classifyName}',
    path: '/${dasherizeName}',
    component: () => import(/* webpackChunkName: "${dasherizeName}" */ './${dasherizeName}/index.vue')
  }`
      if (readIntoSourceText(host, routerPath).includes(insertCode)) return host
      // 默认最后一个export default导出的数组为该moduleRouter对象
      const exportNodes = findNodes(routerSource, ts.SyntaxKind.ExportAssignment)
      if (exportNodes && exportNodes.length) {
        const exportObjectNode = (exportNodes[0] as ts.ExportAssignment)
          .expression as ts.ArrayLiteralExpression
        const hasOtherRoute = !!exportObjectNode.elements.length
        const routerRecorder = host.beginUpdate(routerPath)
        routerRecorder.insertLeft(
          exportObjectNode.pos + 2,
          `${insertCode}${hasOtherRoute ? ',' : ''}`
        )

        host.commitUpdate(routerRecorder)
      }
    } else {
      // 如果页面不在任何模块下，需要将新建页面的路由代码注入到全局的router文件中
      const routerPath = join(options.router)
      const routerDir = options.router
        .split('/')
        .filter((n, i, arr) => {
          return i !== arr.length - 1
        })
        .join('/')
      const routerSource = readIntoSourceFile(host, routerPath)
      const viewRouteName = `${classifyName}Route`
      const relativePathToView = relative(routerDir, options.root)
      const viewRoutePath = join(relativePathToView, options.name, '/index.route')
      if (isImported(routerSource, viewRouteName, viewRoutePath)) return host
      const change = insertImport(routerSource, routerPath, viewRouteName, viewRoutePath, true)
      const routerRecorder = host.beginUpdate(routerPath)
      if (change instanceof InsertChange) {
        routerRecorder.insertLeft(change.pos, change.toAdd)
      }

      // 默认带有routes属性的对象为Router对象
      const arrayNodes = findNodes(routerSource, ts.SyntaxKind.VariableDeclaration)
        .reverse()
        .filter((node: ts.Node) => {
          return node.getChildren().some((node) => node.getText() === 'routes')
        })
      if (arrayNodes && arrayNodes.length) {
        const routerNode = arrayNodes[0]
        const routesArrayNode = routerNode
          .getChildren()
          .reverse()
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
            `${indentation}${viewRouteName},`
          )
          routerRecorder.insertLeft(routesChange.pos, routesChange.toAdd)
        }
      }

      host.commitUpdate(routerRecorder)
    }
    return host
  }
}

export function view(options: Required<ViewConfig>): Rule {
  return () => {
    // 设置默认和用户配置
    defaultsDeep(options, DEFAULT_VIEW_CONFIG)

    const dirPath = options.modulePath ? join(options.root, options.modulePath) : options.root // 添加view文件夹所在的地址
    const movePath = normalize(dirPath)
    const templatePath = options.templatePath || './templates'
    const templateSource = apply(url(templatePath), [
      options.modulePath || options.ignoreRouteInject
        ? filter((path) => !path.endsWith('index.route.ts.template'))
        : noop(),
      applyTemplates({
        ...strings,
        ...options,
      }),
      move(movePath),
    ])
    return chain([
      !options.ignoreRouteInject ? setViewRouter(options) : noop(),
      mergeWith(templateSource, MergeStrategy.Overwrite),
    ])
  }
}
