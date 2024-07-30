import { COMPONENT_TYPE } from '../../utils/constants/component'
import { ModalAdapter } from './modal.adapter'
import Modal from './modal.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

Modal.install = (app: App, opt: ModalAdapter) => {
  setComponentConfig(COMPONENT_TYPE.modal, opt)
  app.component(Modal.name, Modal)
}

export { Modal }
