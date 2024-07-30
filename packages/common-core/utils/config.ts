import { DescriptionsItemAdapter } from '../ant-design/descriptions-item/descriptions-item.adapter'
import { DescriptionsAdapter } from '../ant-design/descriptions/descriptions.adapter'
import { ArrayFormAdapter } from '../ant-design/array-form/array-form.adapter'
import { AutoCompleteAdapter } from '../ant-design/auto-complete/auto-complete.adapter'
import { InputPasswordAdapter } from '../ant-design/input-password/input-password.adapter'
import { TreeAdapter } from '../ant-design/tree/tree.adapter'
import { CmfAdapter } from '../combine/cmf/cmf.adapter'
import { CoAdapter } from '../combine/co/co.adapter'
import { PopconfirmAdapter } from '../ant-design/popconfirm/popconfirm.adapter'
import { ModalAdapter } from '../ant-design/modal/modal.adapter'
import { ImageAdapter } from '../ant-design/image/image.adapter'
import { TreeSelectAdapter } from '../ant-design/tree-select/tree-select.adapter'
import { InputNumberAdapter } from '../ant-design/input-number/input-number.adapter'
import { TextareaAdapter } from '../ant-design/textarea/textarea.adapter'
import { RangePickerAdapter } from '../ant-design/range-picker/range-picker.adapter'
import { CascaderAdapter } from '../ant-design/cascader/cascader.adapter'
import { UploadAdapter } from '../ant-design/upload/upload.adapter'
// import { CeAdapter } from './../combine/ce/ce.adapter'
import { TimePickerAdapter } from '../ant-design/time-picker/time-picker.adapter'
import { CheckboxAdapter } from '../ant-design/checkbox/checkbox.adapter'
// import { OptionGroupAdapter } from './../ant-design/option-group/option-group.adapter'
import { DatePickerAdapter } from '../ant-design/date-picker/date-picker.adapter'
import { SelectAdapter } from '../ant-design/select/select.adapter'
import { InputAdapter } from '../ant-design/input/input.adapter'
import { FormItemAdapter } from '../ant-design/form-item/form-item.adapter'
import { FormAdapter } from '../ant-design/form/form.adapter'
import { TableAdapter } from '../ant-design/table/table.adapter'
import { PaginationAdapter } from '../ant-design/pagination/pagination.adapter'
import { COMPONENT_TYPE } from './constants/component'
import { ButtonAdapter } from '../ant-design/button/button.adapter'
import _ from 'lodash'
import { ButtonGroupAdapter } from '../ant-design/button-group/button-group.adapter'
import { AsyncDataAdapter } from './hooks/useAsyncData'
import { CtAdapter } from '../combine/ct/ct.adapter'
// import { CheckboxButtonAdapter } from '../ant-design/checkbox-button/checkbox-button.adapter'
import { CheckboxGroupAdapter } from '../ant-design/checkbox-group/checkbox-group.adapter'
// import { RadioButtonAdapter } from '../ant-design/radio-button/radio-button.adapter'
import { RadioGroupAdapter } from '../ant-design/radio-group/radio-group.adapter'
import { RadioAdapter } from '../ant-design/radio/radio.adapter'
// import { FormGroupAdapter } from '../ant-design/form-group/form-group.adapter'
import { CsAdapter } from '../combine/cs/cs.adapter'
import { InputSearchAdapter } from '../ant-design/input-search/input-search.adapter'
import { SelectOptionAdapter } from '../ant-design/select-option/select-option.adapter'
import { SwitchAdapter } from '../ant-design/switch/switch.adapter'
import { TimeRangePickerAdapter } from '../ant-design/time-range-picker/time-range-picker.adapter'
import { InputNumberRangeAdapter } from '../ant-design/input-number-range/input-number-range.adapter'
import { FormGroupAdapter } from '../ant-design/form-group/form-group.adapter'

export interface CvueOptions {
  /** base */
  [COMPONENT_TYPE.asyncData]?: AsyncDataAdapter
  [COMPONENT_TYPE.button]?: ButtonAdapter
  [COMPONENT_TYPE.modal]?: ModalAdapter
  [COMPONENT_TYPE.buttonGroup]?: ButtonGroupAdapter
  [COMPONENT_TYPE.pagination]?: PaginationAdapter
  [COMPONENT_TYPE.table]?: TableAdapter
  [COMPONENT_TYPE.image]?: ImageAdapter
  [COMPONENT_TYPE.popconfirm]?: PopconfirmAdapter
  [COMPONENT_TYPE.tree]?: TreeAdapter
  [COMPONENT_TYPE.descriptions]?: DescriptionsAdapter
  [COMPONENT_TYPE.descriptionsItem]?: DescriptionsItemAdapter
  /** form */
  [COMPONENT_TYPE.form]?: FormAdapter
  [COMPONENT_TYPE.formItem]?: FormItemAdapter
  [COMPONENT_TYPE.formGroup]?: FormGroupAdapter
  [COMPONENT_TYPE.input]?: InputAdapter
  [COMPONENT_TYPE.inputSearch]?: InputSearchAdapter
  [COMPONENT_TYPE.inputPassword]?: InputPasswordAdapter
  [COMPONENT_TYPE.inputNumber]?: InputNumberAdapter
  [COMPONENT_TYPE.inputNumberRange]?: InputNumberRangeAdapter
  [COMPONENT_TYPE.autoComplete]?: AutoCompleteAdapter
  [COMPONENT_TYPE.textarea]?: TextareaAdapter
  [COMPONENT_TYPE.select]?: SelectAdapter
  [COMPONENT_TYPE.selectOption]?: SelectOptionAdapter
  // [COMPONENT_TYPE.optionGroup]?: OptionGroupAdapter
  [COMPONENT_TYPE.datePicker]?: DatePickerAdapter
  [COMPONENT_TYPE.rangePicker]?: RangePickerAdapter
  [COMPONENT_TYPE.timePicker]?: TimePickerAdapter
  [COMPONENT_TYPE.timeRangePicker]?: TimeRangePickerAdapter
  [COMPONENT_TYPE.checkbox]?: CheckboxAdapter
  [COMPONENT_TYPE.checkboxGroup]?: CheckboxGroupAdapter
  // [COMPONENT_TYPE.checkboxButton]?: CheckboxButtonAdapter
  [COMPONENT_TYPE.radio]?: RadioAdapter
  [COMPONENT_TYPE.radioGroup]?: RadioGroupAdapter
  // [COMPONENT_TYPE.radioButton]?: RadioButtonAdapter
  [COMPONENT_TYPE.upload]?: UploadAdapter
  [COMPONENT_TYPE.cascader]?: CascaderAdapter
  [COMPONENT_TYPE.switch]?: SwitchAdapter
  [COMPONENT_TYPE.treeSelect]?: TreeSelectAdapter
  [COMPONENT_TYPE.arrayForm]?: ArrayFormAdapter
  /** combine */
  [COMPONENT_TYPE.ct]?: Partial<CtAdapter>
  [COMPONENT_TYPE.co]?: Partial<CoAdapter>
  // [COMPONENT_TYPE.ce]?: Partial<CeAdapter>
  [COMPONENT_TYPE.cs]?: Partial<CsAdapter>
  [COMPONENT_TYPE.cmf]?: Partial<CmfAdapter>
}

const $CVUE = {} as CvueOptions

const setConfig = (option: CvueOptions) => {
  _.assign($CVUE, option)
}

const setComponentConfig = <T extends keyof CvueOptions>(key: T, option: CvueOptions[T]): void => {
  $CVUE[key] = option
}

const getConfig = <T extends keyof CvueOptions>(key: T): CvueOptions[T] => {
  return $CVUE[key]
}

export { getConfig, setConfig, setComponentConfig }
