import { FormItemAdapter } from '../../ant-design/form-item/form-item.adapter'
import { FormAdapter } from '../../ant-design/form/form.adapter'
import { ImageAdapter } from '../../ant-design/image/image.adapter'
import { PopconfirmAdapter } from '../../ant-design/popconfirm/popconfirm.adapter'
import { ButtonAdapter } from '../../ant-design/button/button.adapter'
import { TableAdapter } from '../../ant-design/table/table.adapter'
import { ElCommonAdapter } from '../../utils/dtos'
import { ColumnGroupType, ColumnType } from 'ant-design-vue/lib/table'
import { AsyncDataAdapter } from '../../utils/hooks/useAsyncData'

export type CtSlots = 'default'
export const ctSlots = ['default']

export interface OperateItem {
  button?: ButtonAdapter
  popconfirm?: PopconfirmAdapter
  isDanger?: boolean
}
type CtColumnBaseType = Partial<ColumnGroupType<any> | ColumnType>
export interface CtColumnExtraType {
  editable?: {
    form?: FormAdapter
    formItem: FormItemAdapter
    readMode?: boolean
    isEditCurrent?: boolean // edit的必要条件
    isEditAlways?: boolean // edit的充分条件
  }
  type?: 'text' | 'operate' | 'image' | 'images' | 'index' | 'convert' | 'slot'
  image?: ImageAdapter
  onlyShowFirstImage?: boolean
  operateRender?: (scope: {
    column: Record<string, any>
    index: number
    text: any
    record: Record<string, any>
  }) => OperateItem[]
  asyncData?: AsyncDataAdapter
  convertHandle?: (
    scope: {
      column: Record<string, any>
      index: number
      text: any
      record: Record<string, any>
    },
    asyncData?: AsyncDataAdapter
  ) => string
  enumTypes?: { label: string; value: string | number }[]
  // 格式化时间
  format?: string
  textHandler?: (scope: {
    column: Record<string, any>
    index: number
    text: any
    record: Record<string, any>
  }) => string
  slotName?: string
  // 存在form配置并且可以设置一整列数值
  columnDataEditable?: boolean
  // 国际化操作按钮名称
  locale?: {
    more?: string
    addData?: string
  }
  // 表头插槽名字
  headerSlotName?: string
}
export type CtColumnType = CtColumnExtraType & CtColumnBaseType

export const CtBindsOmitKeys: (keyof CtAdapter)[] = ['dataSourceAsync', 'columns']
export interface CtAdapter
  extends Partial<TableAdapter & ElCommonAdapter<CtAdapter, CtOutput, CtSlots>> {
  dataSourceAsync?: AsyncDataAdapter<any[]>
  columns?: CtColumnType[]

  sink?: boolean // grid是否沉底
  sinkAdapter?: number // 偏移量，默认值失效时可设置调节

  onAddColumn?(): void //是否通过底部按钮直接新增

  selectedRowCount?: number //选中行的条数

  editableModels?: Record<string, any>
  onCtfEdit?: (dataSource: any[], record: Record<string, any>) => void
  onCtfDelete?: (dataSource: any[], record: Record<string, any>) => void
  onCtfSave?: (record: Record<string, any>) => void
}

export interface CtOutput {
  setData(data: any[]): unknown
  setPageNo(pageNo: number): void
  setPageSize(pageSize: number): void
  setParams(
    params: Record<string, any> | ((params?: Record<string, any>) => Record<string, any>)
  ): unknown
  setExtraParams(
    params: Record<string, any> | ((params?: Record<string, any>) => Record<string, any>),
    name?: string
  ): unknown
  update(): unknown
}

export const CT_DEFAULT: CtAdapter = {
  sinkAdapter: 24
}
export const CT_IMAGE: ImageAdapter = {}
export const CT_BUTTON: ButtonAdapter = {
  visible: true,
  type: 'text',
}
export const CT_POPCONFIRM: PopconfirmAdapter = {}
