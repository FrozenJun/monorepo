import { LoadConfig } from '../utils/load-config'
import { generateCustom } from './custom'
import { generateView } from './view'

const CONFIG = LoadConfig()
;(function () {
  CONFIG.forEach((item) => {
    switch (item.type) {
      case 'custom':
        generateCustom(item)
        break
      case 'view':
        generateView(item)
        break
      default:
        generateCustom(item)
    }
  })
})()
