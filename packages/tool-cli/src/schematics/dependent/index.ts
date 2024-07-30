import { InsertChange } from '../../utils/change'
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
} from '@angular-devkit/schematics'
import { normalize, join } from 'path'
import { strings } from '@angular-devkit/core'
import { readIntoSourceFile } from '../../utils/file'
import { insertImport, isImported } from '../../utils/ast-utils'
import { defaultsDeep } from 'lodash'
import { CliConfigItem } from '../../config.dto'
import { DEFAULT_VIEW_CONFIG } from '../../config'

interface DependentConfig extends CliConfigItem {
  name: string
  hostPath: string
  hostName: string
  isInnerComponent: boolean
}

/**
 * 将组件注入到父级页面
 * @param options 配置项
 */
function injectComponentToHost(options: DependentConfig): Rule {
  return (host: Tree) => {
    const classifyName = `${strings.classify(options.hostName)}${strings.classify(options.name)}`
    // const dasherizeName = `${strings.dasherize(options.name)}`

    const hostFilePath = join(options.hostPath, `index.vue`)
    const hostSource = readIntoSourceFile(host, hostFilePath)

    /**
     * 注入import
     */
    if (
      isImported(
        hostSource,
        classifyName,
        `./components/${strings.dasherize(options.hostName)}-${strings.dasherize(options.name)}.vue`
      )
    )
      return host
    const hostRecorder = host.beginUpdate(hostFilePath)
    // <script setup lang="ts">之后
    const scriptPos =
      hostSource.text.indexOf('<script setup lang="ts">') + '<script setup lang="ts">'.length
    const change = insertImport(
      hostSource,
      hostFilePath,
      classifyName,
      `./components/${strings.dasherize(options.hostName)}-${strings.dasherize(options.name)}.vue`,
      true
    )
    if (change instanceof InsertChange) {
      // 这里不能用change.pos，位置会不对
      hostRecorder.insertLeft(scriptPos, change.toAdd)
    }

    const insertCode = `\n  <${classifyName}></${classifyName}>`
    const pos = hostSource.text.indexOf('<template>') + '<template>'.length
    const hostChange = new InsertChange(hostFilePath, pos, insertCode)
    hostRecorder.insertLeft(hostChange.pos, hostChange.toAdd)

    host.commitUpdate(hostRecorder)
    return host
  }
}

export function dependentComponent(options: DependentConfig): Rule {
  return () => {
    // 设置默认和用户配置
    defaultsDeep(options, DEFAULT_VIEW_CONFIG)

    const hostPathArr = options.hostPath.split('/')
    const hostName = strings.dasherize(hostPathArr[hostPathArr.length - 1])
    const isInnerComponent = /.+src\/components/.test(options.hostPath)
    options.hostName = hostName
    options.isInnerComponent = isInnerComponent

    const movePath = normalize(`${options.hostPath}/components`)
    const templateSource = apply(url('./templates'), [
      applyTemplates({
        ...strings,
        ...options,
      }),
      move(movePath),
    ])
    return chain([
      injectComponentToHost(options),
      mergeWith(templateSource, MergeStrategy.Overwrite),
    ])
  }
}
