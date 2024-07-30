export interface GenerateItem {
  name: string
  templatePath?: string
  handlerPath?: string
  viewType?: 'module' | 'page' | 'component'
  child?: (GenerateItem | string)[]
}

export interface PrivateConfig {
  paths: {
    schematic: string
    core: string
  }
  [k: string]: any
}

type CliConfigItemType = 'view' | 'custom'

export interface CliConfigItem {
  type?: CliConfigItemType // 默认custom
  root?: string
  router?: string
  ignoreRouteInject?: boolean
  /** GenerateItem未配置templatePath时的默认templatePath */
  templatePath?: string
  /** GenerateItem未配置handlerPath时的默认handlerPath */
  handlerPath?: string
  generate: (GenerateItem | string)[]
}

export type CliConfig = CliConfigItem[]
