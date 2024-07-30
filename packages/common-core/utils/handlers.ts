import { FormAdapter } from '../ant-design/form/form.adapter'
import { DefaultOptionType } from 'ant-design-vue/lib/select'
import { DataNode } from 'ant-design-vue/lib/tree'
import _ from 'lodash'
import { reactive } from 'vue'
import { FormItemAdapter } from '../ant-design/form-item/form-item.adapter'
import { CtColumnType } from '../combine/ct/ct.adapter'
import { SelectAdapter } from '../ant-design/select/select.adapter'
import { defineRule } from 'vee-validate'
import { isEmpty } from './vee-validate'
import { InputNumberAdapter } from '../ant-design/input-number/input-number.adapter'
import { getFormControlByProp } from './components/form'
import { ARFCN_POINTA } from './constants/device.constant'
import { LABLE_PROP } from './constants/moduleBusinesses.constant'

export function selectHandler(list?: any) {
  if (!Array.isArray(list)) return []
  return list.map((item) => {
    return {
      label: item.name,
      value: item.id,
    }
  })
}

export function treeHandler(list?: any, keyMap: Record<string, any> = {}): DataNode[] {
  if (!Array.isArray(list)) return []
  return list.map((item) => {
    const name = item[keyMap['name'] || 'name']
    const id = item[keyMap['id'] || 'id']
    const children = item[keyMap['children'] || 'children']
    const type = item[keyMap['type'] || 'type']
    const base = {
      title: name,
      key: id,
      value: id,
      type: type,
    }
    if (children && children.length) {
      item[keyMap['children'] || 'children'] = treeHandler(children)
    }
    return children && children.length
      ? { ...base, children: item[keyMap['children'] || 'children'] }
      : base
  })
}

export function treeSelectHandler(
  list?: any,
  valueKey = 'id',
  keyMap: Record<string, any> = {},
  options?: Record<string, any>
): DefaultOptionType[] {
  if (!Array.isArray(list)) return []
  return list.map((item) => {
    const name = item[keyMap['name'] || 'name']
    const value = item[keyMap[valueKey] || valueKey] || item[keyMap['id'] || 'id']
    const children = item[keyMap['children'] || 'children']
    const base = {
      title: name,
      value: value,
      disabled: options && options['onlyChooseLast'] && children && children.length,
    }
    if (children && children.length) {
      item[keyMap['children'] || 'children'] = treeSelectHandler(children, valueKey)
    } else {
      Reflect.deleteProperty(item, keyMap['children'] || 'children')
    }
    return children && children.length
      ? { ...base, children: item[keyMap['children'] || 'children'] }
      : base
  })
}

//归属地树 （value为拼接的name）
export function areaTreeSelectHandler(
  list?: any,
  parentName?: '',
  keyMap: Record<string, any> = {},
  options?: Record<string, any>
): DefaultOptionType[] {
  if (!Array.isArray(list)) return []
  return list.map((item) => {
    const name = item[keyMap['name'] || 'name']
    const id = item[keyMap['id'] || 'id']
    const children = item[keyMap['children'] || 'children']
    const base = {
      title: name,
      value: parentName + name,
      disabled: options && options['onlyChooseLast'] && children && children.length,
    }
    if (children && children.length) {
      item[keyMap['children'] || 'children'] = areaTreeSelectHandler(children, name)
    }
    return children && children.length
      ? { ...base, children: item[keyMap['children'] || 'children'] }
      : base
  })
}

//过滤树节点
export function filterTreeNode<T extends { children: T[] }>(
  tree: Array<T>,
  arr: Array<T> = [],
  filter: (item?: T) => boolean
) {
  if (!tree.length) return []
  for (const item of tree) {
    let node
    if (filter(item)) {
      node = { ...item, children: [] }
      arr.push(node)
    }
    if (item.children && item.children.length) {
      filterTreeNode(item.children, node ? node.children : arr, filter)
    }
  }
  return arr
}

export function cascaderHandler(list?: any, keyMap: Record<string, any> = {}): DefaultOptionType[] {
  if (!Array.isArray(list)) return []
  return list.map((item) => {
    const name = item[keyMap['name'] || 'name']
    const id = item[keyMap['id'] || 'id']
    const children = item[keyMap['children'] || 'children']
    const base = {
      label: name,
      value: id,
      isLeaf: !children || !children.length,
    }
    if (children && children.length) {
      item[keyMap['children'] || 'children'] = cascaderHandler(children)
    }
    return children && children.length
      ? { ...base, children: item[keyMap['children'] || 'children'] }
      : base
  })
}

// 改变tree的部分属性值
export function changeKey(data, childrenColumnName = 'children') {
  if (!data) return
  for (let i = 0; i < data.length; i++) {
    data[i].key = data[i].id
    if (data[i][childrenColumnName] && data[i][childrenColumnName].length > 0) {
      data[i].hasChild = true
      changeKey(data[i][childrenColumnName])
    } else {
      Reflect.deleteProperty(data[i], childrenColumnName)
    }
  }
  return data
}

export function changeTreeState(
  data: any[] | undefined,
  checked: boolean,
  checkedKeys: Array<string | number>
) {
  if (!data) return
  data.forEach((item) => {
    item.disabled = !checked
    if (checkedKeys.includes(item.value)) {
      checkedKeys.splice(checkedKeys.indexOf(item.value), 1)
    }
    if (item.children && item.children.length > 0) {
      changeTreeState(item.children, checked, checkedKeys)
    }
  })
  return data
}
//返现改变子节点状态
export function changeTreeNodeState(data: any, checkedKey: string) {
  if (!data) return
  data.forEach((item) => {
    if (item.value === checkedKey) {
      changeTreeState(item.children, false, [checkedKey])
      return
    } else {
      changeTreeNodeState(item.children, checkedKey)
    }
  })
}
//找到所有非叶子节点
export function getNonLeafNode(data, res) {
  if (data) {
    data.forEach((item) => {
      if (item.children && item.children.length > 0) {
        res.push(item.id)
        getNonLeafNode(item.children, res)
      } else {
        return
      }
    })
  }
  return res
}

export function generateTree(data = [], map?: (item) => Record<string, any>) {
  const out: any[] = []
  flatten(data)
  return out
  function flatten(arr) {
    arr.map((item: any) => {
      if (Array.isArray(item.children)) {
        flatten(item.children)
      }
      delete item.children
      const data = map && _.isFunction(map) ? map(item) : item
      out.push(data)
    })
  }
}

export function transcformEnumToOptions(enums: Array<string> = [], enumNames: Array<string> = []) {
  const options: any[] = []
  for (let i = 1; i < enums.length; i++) {
    options.push({
      label: enumNames[i],
      value: enums[i],
    })
  }
  return options
}

interface CtOptions {
  isReadMode: boolean
}

export function transformSchemaToCt(jsonschema: any, options: CtOptions, dataSource: any[]) {
  const columns: CtColumnType[] = []
  const keys = _.keys(jsonschema.properties)
  const required = jsonschema.required || []
  _.keys(jsonschema.properties).forEach((key, index) => {
    const value = jsonschema.properties[key]
    /**
     * ct里每个单元格单独表单，无法实现at_least_one验证规则
     */
    if (value.rules && value.rules.includes('at_least_one')) {
      value.rules = ''
    }
    columns.push({
      title: value.title,
      dataIndex: keys[index],
      columnDataEditable: true,
      editable: {
        form: { itemWidth: '100%' },
        readMode: options.isReadMode,
        formItem: _genFormItem({
          key,
          value,
          requires: required,
          customItem: {
            width: '100%',
            labelCol: { style: { width: 0 } },
          },
          dataSource,
        }),
        isEditAlways: true,
      },
    })
  })
  return columns
}

export function transformSchemaToForm(jsonschema: any, form: FormAdapter): FormAdapter {
  if (!jsonschema || !_.isObject(jsonschema)) return form
  const models = reactive<Record<string, any>>({})
  const { properties, required } = jsonschema as any
  const keys = _.keys(properties)
  form.formItems = keys.map((key) =>
    _genFormItem({
      key,
      value: properties[key],
      requires: required,
      models,
      customItem: {
        width: '100%',
      },
      form,
    })
  )
  form.models = models
  return form
}
function _genFormItem({
  key,
  value,
  requires = [],
  models = {},
  modelKey,
  customItem,
  form,
  dataSource,
}: {
  key: string
  value: Record<string, any>
  requires: string[]
  models?: Record<string, any>
  modelKey?: string
  customItem?: FormItemAdapter
  form?: FormItemAdapter
  dataSource?: any[]
}): FormItemAdapter {
  const target = reactive<FormItemAdapter>(
    _.defaultsDeepSafe(
      {
        label: value.title,
        validateFieldName: value.title,
        prop: `${modelKey ? modelKey + '.' : ''}${key}`,
        rules: `${requires.includes(key) ? 'required' : ''}${value.rules ? `|${value.rules}` : ''}`,
        tip: value.description,
        control: {
          disabled: value.disabled,
          addonAfter: value.unit || undefined,
        },
      },
      customItem || {}
    )
  )
  if (value.pattern) {
    const validateName = `${value.title}${Math.random()}`
    defineRule(validateName, (input: string) => {
      if (isEmpty(input)) return true
      return new RegExp(value.pattern).test(input) || `${value.title}格式不正确`
    })
    target.rules = `${target.rules}|${validateName}`
  }
  models[key] = value.default || undefined
  const arrayItemModels = {}
  const controlItem = target.control
  switch (value.type && value.type.toLowerCase()) {
    case 'string':
      models[key] = ''
      // 还有其它的format，如date等，后面有了再加
      if (value.format === 'time') {
        target.type = 'time-picker'
        target.control = {
          ...target.control,
          format: 'HH:mm:ss',
        } as any
      }
      break
    case 'switch':
      models[key] = ''
      target.type = 'switch'
      target.control = {
        ...target.control,
        checkedValue: 1,
        unCheckedValue: 0,
      } as any
      break
    case 'number':
    case 'integer':
      models[key] = null
      target.type = 'input-number'
      target.control = {
        min: value.min,
        max: value.max,
        ...controlItem,
        onChange(v) {
          if (key === 'arfcn') {
            if (form) {
              const pointAarfcnItem = getFormControlByProp<InputNumberAdapter>('pointAarfcn', form)!
              const item = ARFCN_POINTA.find((item) => item.arfcn.includes(v))
              if (item && pointAarfcnItem) {
                pointAarfcnItem.modelValue = item.pointA
              }
            } else if (dataSource) {
              const item = ARFCN_POINTA.find((item) => item.arfcn.includes(v))
              if (item) {
                // dataSource[columnIndex]['pointAarfcn'] = item.pointA
              }
            }
          }
        },
      }
      break
    case 'json':
      target.type = 'nested-form'
      target.width = '100%'
      models[key] = []
      target.control = {
        modelValue: [arrayItemModels],
        max: value.max,
        min: value.min,
        formItems: LABLE_PROP[key]?.map((item) =>
          _genFormItem({
            key: item.prop,
            value: item,
            requires: value.required || [],
            models: arrayItemModels,
            customItem: {
              labelCol: { style: { width: 0 } },
            },
          })
        ),
      }
      break
    case 'object':
      target.type = 'array-form'
      target.width = '100%'
      models[key] = []
      target.control = {
        modelValue: [arrayItemModels],
        min: 1,
        max: 1,
        formItems: _.keys(value.properties).map((key) =>
          _genFormItem({
            key,
            value: value.properties[key],
            requires: value.required || [],
            models: arrayItemModels,
          })
        ),
      }
      break
    case 'array':
      target.type = 'table-form'
      target.width = '100%'
      models[key] = []
      target.control = {
        formItems: value.items.properties
          ? _.keys(value.items.properties).map((key) =>
              _genFormItem({
                key,
                value: value.items.properties[key],
                requires: value.required || [],
                models: arrayItemModels,
                customItem,
              })
            )
          : [
              {
                label: '',
                labelCol: { style: { width: '0px' } },
                validateFieldName: value.title,
                prop: `${modelKey ? modelKey + '.' : ''}${key}`,
                rules: requires.includes(key) ? 'required' : '',
                type: value.items.type === 'string' ? 'input' : 'input-number',
                control: {
                  // placeholder: '请输入',
                },
              },
            ],
      }
  }
  /**
   * 存在枚举时解析成下拉框
   */
  if (_.isArray(value.enum)) {
    target.type = 'select'
    const select = target.control! as SelectAdapter
    select.options = value.enum
    select.showSearch = true
    select.useCustomValue = true
    select.customValueType = value.type
    if (value.multiple) {
      select.mode ='multiple' 
      models[key] = []
    }
  }
  return target
}

export function editModeTextHandler(formItem: FormItemAdapter, value: any) {
  if (formItem.type === 'select') {
    const options = formItem.control?.options
    const item = options?.find((item) => item.value === value)
    return (item && item.label) || value
  }
  return value
}

//过滤树节点
export function filterTree(tree: any, arr: any[] = [], menuIds: any[]) {
  if (!tree.length) return []
  for (const item of tree) {
    if (!menuIds.includes(item.key)) continue
    const node = { ...item, children: [] }
    arr.push(node)
    if (item.children && item.children.length) {
      filterTree(item.children, node.children, menuIds)
    }
  }
  return arr
}

// 找到key下面的所有子节点
export function findChildrenByKey(key: string, treeArr: any) {
  const result = new Set<{ label: string; value: any }>()
  function dfs(node) {
    if (node.value === key) {
      collectChildren(node)
    }
    if (!node.children) return
    for (const child of node.children) {
      dfs(child)
    }
  }
  // 递归处理子节点的子节点
  function collectChildren(node) {
    if (!node.children) return
    for (const child of node.children) {
      result.add({ label: child.title, value: child.value })
      collectChildren(child)
    }
  }
  treeArr.forEach((tree) => {
    dfs(tree)
  })
  return result
}

// 改变tree的部分属性值
export function changeTreeKey(data, childrenColumnName = 'children') {
  if (!data) return
  for (let i = 0; i < data.length; i++) {
    data[i].key = data[i].id
    if (data[i][childrenColumnName] && data[i][childrenColumnName].length > 0) {
      changeTreeKey(data[i][childrenColumnName])
    } else {
      Reflect.deleteProperty(data[i], childrenColumnName)
    }
  }
  return data
}

export function treeDataSimpleModeHandler(data: any[]) {
  if (!Array.isArray(data)) return []
  return data.map((item) => ({
    title: item.name,
    id: item.id,
    value: item.id || item.sn,
    pId: item.parentId,
    level: item.level,
    lat: item.lat,
    lng: item.lng,
  }))
}
