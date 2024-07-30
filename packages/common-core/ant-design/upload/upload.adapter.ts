import { ImageAdapter } from '../../base/image/image.adapter'
import { ModalAdapter } from '../../base/modal/modal.adapter'
import { UploadFile, UploadProps } from 'ant-design-vue'
import { ElCommonAdapter } from '../../utils/dtos'

export type UploadSlots =
  | 'default'
  | 'downloadIcon'
  | 'iconRender'
  | 'itemRender'
  | 'previewIcon'
  | 'removeIcon'
export const uploadSlots = [
  'default',
  'downloadIcon',
  'iconRender',
  'itemRender',
  'previewIcon',
  'removeIcon',
]

export const UploadBindsOmitKeys: (keyof UploadAdapter)[] = ['modelValue']
export interface UploadAdapter
  extends Partial<UploadProps & ElCommonAdapter<UploadAdapter, UploadOutput, UploadSlots>> {
  modelValue?: UploadFile<any>[]

  previewModal?: ModalAdapter
  previewImage?: ImageAdapter
}

export interface UploadOutput {}

export const UPLOAD_DEFAULT: UploadAdapter = {
  previewModal: {
    footer: null,
  },
  previewImage: {
    width: '100%',
  },
}
