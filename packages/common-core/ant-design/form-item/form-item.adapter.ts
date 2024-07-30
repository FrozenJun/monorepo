import { NestedFormAdapter } from '../../combine/nested-form/nested-form.adapter'
import { TableFormAdapter } from '../../combine/table-form/table-form.adapter'
import { ArrayFormAdapter } from '../array-form/array-form.adapter'
import { AutoCompleteAdapter } from '../auto-complete/auto-complete.adapter'
import { InputPasswordAdapter } from '../input-password/input-password.adapter'
import { FormItemProps } from 'ant-design-vue'
import { ElCommonAdapter } from '../../utils/dtos'
import { CascaderAdapter } from '../cascader/cascader.adapter'
import { CheckboxGroupAdapter } from '../checkbox-group/checkbox-group.adapter'
import { CheckboxAdapter } from '../checkbox/checkbox.adapter'
import { DatePickerAdapter } from '../date-picker/date-picker.adapter'
import { InputNumberAdapter } from '../input-number/input-number.adapter'
import { InputSearchAdapter } from '../input-search/input-search.adapter'
import { InputAdapter } from '../input/input.adapter'
import { RadioGroupAdapter } from '../radio-group/radio-group.adapter'
import { RadioAdapter } from '../radio/radio.adapter'
import { RangePickerAdapter } from '../range-picker/range-picker.adapter'
import { SelectAdapter } from '../select/select.adapter'
import { SwitchAdapter } from '../switch/switch.adapter'
import { TextareaAdapter } from '../textarea/textarea.adapter'
import { TimePickerAdapter } from '../time-picker/time-picker.adapter'
import { TimeRangePickerAdapter } from '../time-range-picker/time-range-picker.adapter'
import { TreeSelectAdapter } from '../tree-select/tree-select.adapter'
import { UploadAdapter } from '../upload/upload.adapter'
import { InputNumberRangeAdapter } from '../input-number-range/input-number-range.adapter'
import { SliderAdapter } from '../slider/slider.adapter'

export type FormItemSlots = 'default' | 'extra' | 'help' | 'label'
export const formItemSlots = ['default', 'extra', 'help', 'label']

export type FormItemAlign = 'left' | 'center' | 'right'
export const FormItemBindsOmitKeys: (string | keyof FormItemAdapter)[] = [
  'rules',
  'prop',
  'visible',
  'hidden',
  'align',
  'width',
  'tip',
  'validateFieldName',
  'className',
  'formControlClassName',
]
export interface FormItemAdapterBase
  extends Partial<
    Omit<FormItemProps, 'rules'> & ElCommonAdapter<FormItemAdapter, FormItemOutput, FormItemSlots>
  > {
  /** 是否渲染 */
  visible?: boolean
  hidden?: boolean

  models?: Record<string, any>

  align?: FormItemAlign

  /** form-item的宽度 */
  width?: string

  rules?: string | Record<string, any>

  /** 表单控件对应的models中的key的名称 */
  prop?: string

  tip?: string

  validateFieldName?: string

  className?: string

  formControlClassName?: string
}
export type FormItemAdapter = FormItemAdapterBase & FormItemOptions

export interface FormItemOutput {}

export const FORM_ITEM_DEFAULT: FormItemAdapter = {
  type: 'input',
  visible: true,
  // 这里需要初始化一下，用户可能不写control导致传入的是undefined
  control: {},
}

export interface FormItemSlotConfig extends ElCommonAdapter<object, object, ''> {
  name?: string
  scope?: Record<string, any>
}
export type FormItemOptions =
  | {
      type?: 'input'
      control?: InputAdapter
    }
  | {
      type?: 'input-number'
      control?: InputNumberAdapter
    }
  | {
      type?: 'input-number-range'
      control?: InputNumberRangeAdapter
    }
  | {
      type?: 'input-search'
      control?: InputSearchAdapter
    }
  | {
      type?: 'input-password'
      control?: InputPasswordAdapter
    }
  | {
      type?: 'auto-complete'
      control?: AutoCompleteAdapter
    }
  | {
      type?: 'select'
      control?: SelectAdapter
    }
  | {
      type?: 'tree-select'
      control?: TreeSelectAdapter
    }
  | {
      type?: 'cascader'
      control?: CascaderAdapter
    }
  | {
      type?: 'checkbox'
      control?: CheckboxAdapter
    }
  | {
      type?: 'checkbox-group'
      control?: CheckboxGroupAdapter
    }
  | {
      type?: 'date-picker'
      control?: DatePickerAdapter
    }
  | {
      type?: 'range-picker'
      control?: RangePickerAdapter
    }
  | {
      type?: 'time-picker'
      control?: TimePickerAdapter
    }
  | {
      type?: 'time-range-picker'
      control?: TimeRangePickerAdapter
    }
  | {
      type?: 'switch'
      control?: SwitchAdapter
    }
  | {
      type?: 'textarea'
      control?: TextareaAdapter
    }
  | {
      type?: 'upload'
      control?: UploadAdapter
    }
  | {
      type?: 'radio'
      control?: RadioAdapter
    }
  | {
      type?: 'radio-group'
      control?: RadioGroupAdapter
    }
  | {
      type?: 'slot'
      control?: FormItemSlotConfig
    }
  | {
      type?: 'empty'
      control?: Record<string, any>
    }
  | {
      type?: 'array-form'
      control?: ArrayFormAdapter
    }
  | {
      type?: 'table-form'
      control?: TableFormAdapter
    }
  | {
      type?: 'nested-form'
      control?: NestedFormAdapter
    }
  | {
      type?: 'slider'
      control?: SliderAdapter
    }
