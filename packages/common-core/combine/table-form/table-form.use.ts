import { CtAdapter, CtColumnType } from '../ct/ct.adapter'
import { TableFormAdapter } from './table-form.adapter'
import { computed, ComputedRef, reactive, SetupContext, watch } from 'vue'
import { useModelValue } from '../../utils/hooks/useModelValue'
import _ from 'lodash'

interface UseTableFormOpt {
  attrs: ComputedRef<TableFormAdapter>
  props: Record<string, any>
  ctx: SetupContext<any>
}

export const useTableForm = ({ attrs, ctx, props }: UseTableFormOpt) => {
  const operates: CtColumnType = reactive({
    type: 'operate',
    title: localStorage.language && localStorage.language === 'en-US' ? 'Operate' : '操作',
    width: attrs.value.sort ? '180px' : '90px',
    operateRender({ record, index }) {
      return [
        {
          button: {
            visible: index !== 0 && !!attrs.value.sort,
            text: localStorage.language && localStorage.language === 'en-US' ? 'Up' : '上移',
            onClick() {
              const current = ct.dataSource![index]
              ct.dataSource![index] = ct.dataSource![index - 1]
              ct.dataSource![index - 1] = current
            },
          },
        },
        {
          button: {
            visible: ct.dataSource && index !== ct.dataSource.length - 1 && !!attrs.value.sort,
            text: localStorage.language && localStorage.language === 'en-US' ? 'Down' : '下移',
            onClick() {
              const current = ct.dataSource![index]
              ct.dataSource![index] = ct.dataSource![index + 1]
              ct.dataSource![index + 1] = current
            },
          },
        },
        {
          button: {
            visible: (ct.dataSource?.length || 0) > (attrs.value.min || 0),
            text: localStorage.language && localStorage.language === 'en-US' ? 'Delete' : '删除',
            onClick() {
              ct.dataSource = ct.dataSource!.filter((i, n) => n !== index)
            },
          },
        },
      ]
    },
  })

  const rowKey = attrs.value.rowKey || 'rowId'
  const addColumn = () => {
    if (!ct.dataSource) ct.dataSource = []
    ct.dataSource.push({ [rowKey]: Math.random() })
  }
  const ct: CtAdapter = reactive({
    dataSource: [],
    pagination: false,
    onAddColumn: addColumn,
    rowKey,
    columns: [
      ...(attrs.value.formItems || []).map<CtColumnType>((i) => {
        i.noStyle = true
        return {
          title: i.label,
          dataIndex: i.prop,
          editable: {
            form: { itemWidth: '100%' },
            formItem: i,
            isEditAlways: true,
          },
        }
      }),
      operates,
    ],
  })
  watch(
    () => attrs.value.modelValue,
    (v, oldv) => {
      // 如果只是改了对象，但是对象内容没变，不触发emit
      if (!v || JSON.stringify(v) === JSON.stringify(oldv)) return
      ctx.emit('update:modelValue', v)
      ct.dataSource = _.cloneDeep(v).map((i, index) => {
        // 为了防止死循环，需要将dataSource匹配的__config、rowId保存下来
        const match = ct.dataSource?.find(
          (column, columnIndex) => column[rowKey] === (i[rowKey] || i.id) || index === columnIndex
        )
        if (match) {
          _.forOwn(match, (value, key) => {
            if (key.endsWith('__config') || key.endsWith('__editMode') || key === rowKey)
              // value可能会是引用类型，比如dayjs对象等
              // i[key] = _.cloneDeep(value)
              i[key] = value
          })
        }
        attrs.value.dataSource = ct.dataSource
        // 如果没有rowKey,设置rowKey
        if (!i[rowKey]) i[rowKey] = i.id || Math.random()
        return i
      })
    },
    { immediate: true }
  )
  watch(
    () => ct.dataSource,
    (v) => {
      ct.onAddColumn =
        attrs.value.max && ct.dataSource && ct.dataSource.length >= attrs.value.max
          ? undefined
          : addColumn
      const newValue = omitConfig(v || [])
      if (JSON.stringify(newValue) === JSON.stringify(attrs.value.modelValue)) return
      attrs.value.modelValue = newValue
      function omitConfig(dataSource: Record<string, any>[]) {
        return dataSource.map((i) => {
          const target = {}
          _.forOwn(i, (value, key) => {
            if (!key.endsWith('__config') && !key.endsWith('__editMode') && key !== rowKey)
              target[key] = value
          })
          return target
        })
      }
    },
    { immediate: true, deep: true }
  )

  watch(
    () => props.modelValue,
    (v, oldv) => {
      attrs.value.modelValue = v
      _.isFunction(attrs.value.onModelChange) && attrs.value.onModelChange(v, oldv)
    },
    { immediate: true }
  )
  const output = computed(() => ({}))
  return { output, ct }
}
