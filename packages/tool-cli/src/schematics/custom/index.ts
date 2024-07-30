import {
  url,
  Rule,
  applyTemplates,
  move,
  chain,
  mergeWith,
  MergeStrategy,
  apply,
} from '@angular-devkit/schematics'
import { normalize, join } from 'path'
import { strings } from '@angular-devkit/core'
import { CliConfig } from '../../config.dto'

export interface CustomOption extends CliConfig {
  name: string
  root: string
  templatePath: string
  handlerPath?: string
  payload?: string
}

export function custom(options: CustomOption): Rule {
  return () => {
    // 设置默认和用户配置
    Object.assign(options, { prefix: '' })

    const movePath = normalize(options.root)
    const tempUrl = join(process.cwd(), options.templatePath)

    const templateSource = apply(url(tempUrl), [
      applyTemplates({
        ...strings,
        ...options,
      }),
      move(movePath),
    ])

    return chain([mergeWith(templateSource, MergeStrategy.Overwrite)])
  }
}
