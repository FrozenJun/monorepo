import { ComputedRef, reactive } from 'vue'
import { CtAdapter } from './ct.adapter'
import _ from 'lodash'
import { message } from 'ant-design-vue'
interface UseCtOpt {
  attrs: ComputedRef<CtAdapter>
}

const initformItem = {
  labelCol: { style: { width: '0px' } },
}
export const EDIT_CURRENT_FLAG = 'isEditCurrent'
export const EDIT_ALWAYS_FLAG = 'isEditAlways'

export function useCtf({ attrs }: UseCtOpt) {
  // attrs.value.columns?.forEach((item) => {
  //   if (item.editable?.formItem) {
  //     item.editable.formItem = _.assign(item.editable.formItem, initformItem)
  //   }
  // })
  const ctfAdd = (dataSource: any[]) => {
    // if(dataSource.find(item=>item.isEdit)){
    // 	message.warning('只能同时编辑一行')
    // 	return;
    // };
    const record = {}
    attrs.value.columns?.forEach((item) => {
      record[item.dataIndex] = ''
    })
    record['isEdit'] = true
    attrs.value?.dataSource?.push(record)
  }
  const ctfEdit = (record: Record<string, any>) => {
    _.isFunction(attrs.value.onCtfEdit) &&
      attrs.value.onCtfEdit(attrs.value.dataSource || [], record)
  }
  const ctfDelete = (record: Record<string, any>) => {
    _.isFunction(attrs.value.onCtfDelete) &&
      attrs.value.onCtfDelete(attrs.value.dataSource || [], record)
  }
  const ctfSave = (record: Record<string, any>) => {
    _.isFunction(attrs.value.onCtfSave) && attrs.value.onCtfSave(record)
  }
  return {
    ctfAdd,
    ctfEdit,
    ctfDelete,
    ctfSave,
    EDIT_CURRENT_FLAG,
    EDIT_ALWAYS_FLAG,
  }
}
