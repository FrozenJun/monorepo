import { COMPONENT_TYPE } from '../../utils/constants/component'
import { UploadAdapter } from './upload.adapter'
import Upload from './upload.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

Upload.install = (app: App, opt: UploadAdapter) => {
  setComponentConfig(COMPONENT_TYPE.upload, opt)
  app.component(Upload.name, Upload)
}

export { Upload }
