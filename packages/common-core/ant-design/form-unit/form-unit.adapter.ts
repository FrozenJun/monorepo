import { ElCommonAdapter } from '../../utils/dtos'
import { AutoCompleteAdapter } from '../auto-complete/auto-complete.adapter'
import { CascaderAdapter } from '../cascader/cascader.adapter'
import { CheckboxGroupAdapter } from '../checkbox-group/checkbox-group.adapter'
import { CheckboxAdapter } from '../checkbox/checkbox.adapter'
import { DatePickerAdapter } from '../date-picker/date-picker.adapter'
import { InputNumberRangeAdapter } from '../input-number-range/input-number-range.adapter'
import { InputNumberAdapter } from '../input-number/input-number.adapter'
import { InputPasswordAdapter } from '../input-password/input-password.adapter'
import { InputSearchAdapter } from '../input-search/input-search.adapter'
import { InputAdapter } from '../input/input.adapter'
import { RadioGroupAdapter } from '../radio-group/radio-group.adapter'
import { RadioAdapter } from '../radio/radio.adapter'
import { RangePickerAdapter } from '../range-picker/range-picker.adapter'
import { SelectAdapter } from '../select/select.adapter'
import { SliderAdapter } from '../slider/slider.adapter'
import { SwitchAdapter } from '../switch/switch.adapter'
import { TextareaAdapter } from '../textarea/textarea.adapter'
import { TimePickerAdapter } from '../time-picker/time-picker.adapter'
import { TimeRangePickerAdapter } from '../time-range-picker/time-range-picker.adapter'
import { TreeSelectAdapter } from '../tree-select/tree-select.adapter'
import { UploadAdapter } from '../upload/upload.adapter'

export type FormUnitSlots = 'default'
export const formUnitSlots = ['default']

export const FormUnitBindsOmitKeys: (keyof FormUnitAdapter)[] = []
export interface FormUnitAdapterBase
  extends Partial<ElCommonAdapter<FormUnitAdapter, FormUnitOutput, FormUnitSlots>> {
  modelValue?: any
}
export type FormUnitAdapter = FormUnitAdapterBase & FormUnitOptions

export interface FormUnitOutput {}

export const FORM_UNIT_DEFAULT: FormUnitAdapter = {}

export type FormUnitOptions =
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
  // | {
  //     type?: 'array-form'
  //     control?: ArrayFormAdapter
  //   }
  | {
      type?: 'slider'
      control?: SliderAdapter
    }
