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
import { PrivateConfig } from '../../config.dto'
import { PRIVATE_CLI_CONFIG } from '../../config'

export function main(options: PrivateConfig): Rule {
  return () => {
    // 设置默认和用户配置
    Object.assign(options, PRIVATE_CLI_CONFIG)

    const movePath = join(normalize(options.paths.core), options.type)
    let tempUrl = ''
    switch (options.type) {
      case 'base':
        tempUrl = './templates/base'
        break
      case 'form':
        tempUrl = './templates/form'
        break
      case 'combine':
        tempUrl = './templates/combine'
        break
      default:
        tempUrl = './templates/base'
        break
    }
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
