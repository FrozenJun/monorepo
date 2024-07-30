import { FormAdapter, FormOutput } from '../../ant-design/form/form.adapter'
import { ModalAdapter, ModalOutput } from '../../ant-design/modal/modal.adapter'
import { ElCommonAdapter } from '../../utils/dtos'

export type CmfSlots = 'default'
export const cmfSlots = ['default']

export const CmfBindsOmitKeys: (keyof CmfAdapter)[] = []
export interface CmfAdapter extends Partial<ElCommonAdapter<CmfAdapter, CmfOutput, CmfSlots>> {
  modal?: ModalAdapter
  form?: FormAdapter
  loading?: boolean
}

export interface CmfOutput extends Required<ModalOutput & FormOutput> {
  data: CmfAdapter
}

export const CMF_DEFAULT: CmfAdapter = {
  loading: false,
}
