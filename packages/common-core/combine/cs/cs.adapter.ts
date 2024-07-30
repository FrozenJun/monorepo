import { ButtonAdapter } from '../../ant-design/button/button.adapter'
import { FormAdapter } from '../../ant-design/form/form.adapter'
import { ElCommonAdapter } from '../../utils/dtos'

export type CsSlots = ''
export const csSlots = ['']

export const CsBindsOmitKeys: (keyof CsAdapter)[] = []
export interface CsAdapter extends Partial<ElCommonAdapter<CsAdapter, CsOutput, CsSlots>> {
  form?: FormAdapter

  searchButton?: ButtonAdapter
  resetButton?: ButtonAdapter

  modelsHandler?: (
    models: Record<string, any>
  ) => Promise<Record<string, any>> | Record<string, any>
  searchHandler?: (models: Record<string, any>) => void
  onSearchClick?: () => void
  onResetClick?: () => void
  operateButtonWidth?: string
}

export interface CsOutput {}

export const CS_DEFAULT: CsAdapter = {}
