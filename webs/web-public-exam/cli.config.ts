import { CliConfig } from 'tool-cli/src/config.dto'

const Config: CliConfig = [
  /**
   * VIEWS页面
   */
  {
    type: 'view',
    root: 'src/views',
    templatePath: './crud-templates',
    generate: [
      {
        name: 'dashboard',
        child: [
          {
            name: 'home',
            child: [],
          },
        ],
      },
    ],
  },
  {
    type: 'view',
    ignoreRouteInject: true,
    root: 'src/components',
    generate: [
      {
        name: 'map',
        child: [],
      },
    ],
  },
]

export default Config
