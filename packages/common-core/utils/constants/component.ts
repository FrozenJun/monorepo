import { HttpReturnType } from '../../http/src/http.dto'
import { ValidateResult } from '../dtos'

export enum COMPONENT_TYPE {
  asyncData = 'asyncData',
  button = 'button',
  modal = 'modal',
  buttonGroup = 'buttonGroup',
  pagination = 'pagination',
  table = 'table',
  // tableColumn = 'tableColumn',
  image = 'image',
  popconfirm = 'popconfirm',
  tree = 'tree',
  descriptions = 'descriptions',
  descriptionsItem = 'descriptionsItem',

  form = 'form',
  formItem = 'formItem',
  formGroup = 'formGroup',
  nestedForm = 'nestedForm',
  tableForm = 'tableForm',
  formUnit = 'formUnit',
  input = 'input',
  inputSearch = 'inputSearch',
  inputPassword = 'inputPassword',
  inputNumber = 'inputNumber',
  inputNumberRange = 'inputNumberRange',
  autoComplete = 'autoComplete',
  textarea = 'textarea',
  select = 'select',
  selectOption = 'selectOption',
  // optionGroup = 'optionGroup',
  datePicker = 'datePicker',
  rangePicker = 'rangePicker',
  timePicker = 'timePicker',
  timeRangePicker = 'timeRangePicker',
  checkbox = 'checkbox',
  checkboxGroup = 'checkboxGroup',
  // checkboxButton = 'checkboxButton',
  radio = 'radio',
  radioGroup = 'radioGroup',
  // radioButton = 'radioButton',
  upload = 'upload',
  cascader = 'cascader',
  switch = 'switch',
  treeSelect = 'treeSelect',
  arrayForm = 'arrayForm',
  slider = 'slider',

  ct = 'ct',
  co = 'co',
  // ce = 'ce',
  cs = 'cs',
  cmf = 'cmf',
}

export const COMPONENT_NAME: Record<COMPONENT_TYPE, string> = {
  asyncData: 'AsyncData',
  button: 'CButton',
  modal: 'CModal',
  buttonGroup: 'CButtonGroup',
  pagination: 'CPagination',
  table: 'CTable',
  // tableColumn: 'CTableColumn',
  image: 'CImage',
  popconfirm: 'CPopconfirm',
  tree: 'CTree',
  descriptions: 'CDescriptions',
  descriptionsItem: 'CDescriptionsItem',

  form: 'CForm',
  formItem: 'CFormItem',
  formGroup: 'CFormGroup',
  nestedForm: 'CNestedForm',
  tableForm: 'CTableForm',
  formUnit: 'CFormUnit',
  input: 'CInput',
  inputSearch: 'CInputSearch',
  inputPassword: 'CInputPassword',
  inputNumber: 'CInputNumber',
  inputNumberRange: 'CInputNumberRange',
  autoComplete: 'CAutoComplete',
  textarea: 'CTextarea',
  select: 'CSelect',
  selectOption: 'CSelectOption',
  // optionGroup: 'COptionGroup',
  datePicker: 'CDatePicker',
  rangePicker: 'CRangePicker',
  timePicker: 'CTimePicker',
  timeRangePicker: 'CTimeRangePicker',
  checkbox: 'CCheckbox',
  checkboxGroup: 'CCheckboxGroup',
  // checkboxButton: 'CCheckboxButton',
  radio: 'CRadio',
  radioGroup: 'CRadioGroup',
  // radioButton: 'CRadioButton',
  switch: 'CSwitch',
  upload: 'CUpload',
  cascader: 'CCascader',
  treeSelect: 'CTreeSelect',
  arrayForm: 'CArrayForm',
  slider: 'CSlider',

  ct: 'Ct',
  co: 'Co',
  // ce: 'Ce',
  cs: 'Cs',
  cmf: 'Cmf',
}

export type COMPONENT_METHODS =
  | 'button-loading'
  | 'table-update'
  | 'table-setData'
  | 'table-setParams'
  | 'pagination-setPageNo'
  | 'pagination-setPageSize'
  /** Form */
  | 'form-validate'
  | 'form-reset'
  | 'form-submit'
  | 'form-setModels'
  | 'form-setOriginalModals'
  | 'form-initModelsAsync'
  | 'form-resetValidate'
  | 'formGroup-validate'
  | 'formGroup-reset'
  | 'formGroup-resetValidate'
  // | 'timePicker-focus'
  | 'input-blur'
  | 'input-focus'
  | 'input-select'
  | 'select-blur'
  | 'select-focus'
  | 'datePicker-focus'
  | 'upload-clearFiles'
  | 'upload-abort'
  | 'upload-submit'
  /** Search */
  // | 'search-search'
  // | 'search-reset'
  /** Tabs */
  // | 'tabs-setTab'
  /** Dialog */
  | 'modal-open'
  | 'modal-close'
  /** FormDialog */
  // | 'formDialog-open'
  // | 'formDialog-close'
  // | 'formDialog-reset'
  // | 'formDialog-validate'
  /** AddEditDialog */
  // | 'addEditDialog-open'
  // | 'addEditDialog-close'
  // | 'addEditDialog-reset'
  // | 'addEditDialog-validate'
  /** Tree */
  // | 'tree-getData'
  // | 'tree-getCheckedKeys'
  /** MD */
  // | 'md-open'
  // | 'md-close'
  // | 'md-submit'
  // | 'md-reset'
  // | 'md-validate'
  /** AsyncData */
  | 'asyncData-setParams'
  | 'asyncData-setExtraParams'
  | 'asyncData-send'
  | 'ct-update'
  | 'ct-setData'
  | 'ct-setParams'
  | 'ct-setExtraParams'
  | 'ct-setPageNo'
  | 'ct-setPageSize'
  | 'cmf-open'
  | 'cmf-close'
  | 'cmf-validate'
  | 'cmf-reset'
  | 'cmf-submit'
  | 'cmf-setModels'
  | 'cmf-setOriginalModals'
  | 'cmf-initModelsAsync'
  | 'cs-reset'
  | 'cs-searchCt'

export interface ComponentMethods {
  'button-loading': boolean
  'table-update': unknown
  'table-setParams': Record<string, any> | ((params?: Record<string, any>) => Record<string, any>)
  'table-setData': any[]
  'pagination-setPageNo': number
  'pagination-setPageSize': number
  'ct-update': unknown
  'ct-setData': any[]
  'ct-setParams': Record<string, any> | ((params?: Record<string, any>) => Record<string, any>)
  'ct-setExtraParams': Record<string, any> | ((params?: Record<string, any>) => Record<string, any>)
  'ct-setPageNo': number
  'ct-setPageSize': number
  'cmf-open': unknown
  'cmf-close': unknown
  'cmf-validate': ((validateResult: ValidateResult) => unknown) | undefined
  'cmf-reset': unknown
  'cmf-submit': ((httpReturn: HttpReturnType) => unknown) | undefined
  'cmf-setModels': Record<string, any> | ((models?: Record<string, any>) => Record<string, any>)
  'cmf-setOriginalModals': (models: Record<string, any>) => void
  'cmf-initModelsAsync': ((httpReturn: HttpReturnType) => unknown) | undefined
  'cs-reset': unknown
  'cs-searchCt': unknown
  'modal-open': any
  'modal-close': any
  'asyncData-setParams':
    | Record<string, any>
    | ((params?: Record<string, any>) => Record<string, any>)
  'asyncData-setExtraParams':
    | Record<string, any>
    | ((params?: Record<string, any>) => Record<string, any>)
  'asyncData-send': unknown
  'form-validate': (validateResult: ValidateResult) => unknown
  'form-setModels': Record<string, any> | ((models?: Record<string, any>) => Record<string, any>)
  'form-setOriginalModals': (models: Record<string, any>) => void
  'form-reset': unknown
  'form-resetValidate': unknown
  'form-submit': ((httpReturn: HttpReturnType) => unknown) | undefined
  'form-initModelsAsync': ((httpReturn: HttpReturnType) => unknown) | undefined
  'formGroup-validate': (validateResult: ValidateResult) => unknown
  'formGroup-reset': unknown
  'formGroup-resetValidate': unknown
  // 'timePicker-focus': unknown
  'input-blur': unknown
  'input-focus': unknown
  'input-select': unknown
  'select-blur': unknown
  'select-focus': unknown
  'datePicker-focus': unknown
  'upload-clearFiles': unknown
  'upload-abort': unknown
  'upload-submit': unknown
}

export type COMPONENT_DATAS = 'button' | 'cmf' | 'treeSelect' | 'modal'
