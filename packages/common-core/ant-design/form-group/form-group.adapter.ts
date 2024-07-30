import { ElCommonAdapter, ValidateResult } from '../../utils/dtos'

export type FormGroupSlots = 'default'
export const formGroupSlots = ['default']

export const FormGroupBindsOmitKeys: (keyof FormGroupAdapter)[] = []
export interface FormGroupAdapter
  extends Partial<ElCommonAdapter<FormGroupAdapter, FormGroupOutput, FormGroupSlots>> {
  onValidate?: (validateResult: ValidateResult) => void
}

export interface FormGroupOutput {
  validate(cb?: (validateResult: ValidateResult) => unknown): Promise<ValidateResult>
  reset(): unknown
  resetValidate(): unknown
}

export const FORM_GROUP_DEFAULT: FormGroupAdapter = {}
