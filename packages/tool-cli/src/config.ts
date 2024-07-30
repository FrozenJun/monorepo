import { CliConfigItem, PrivateConfig } from './config.dto'

export const DEFAULT_VIEW_CONFIG: Partial<CliConfigItem> = {
  root: 'src/views',
  router: 'src/router/index.ts',
}

export const PRIVATE_CLI_CONFIG: PrivateConfig = {
  prefix: 'c',
  paths: {
    schematic: 'packages/cli/src/schematics',
    core: 'packages/core/src/',
  },
}
