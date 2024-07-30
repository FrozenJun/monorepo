import { FormItemAdapter } from '../../ant-design/form-item/form-item.adapter'
import { ButtonAdapter } from '../../ant-design/button/button.adapter'
import { CsAdapter } from './cs.adapter'
import { computed, ComputedRef, reactive } from 'vue'
import { FormOutput } from '../../ant-design/form/form.adapter'
import { emit } from '../../utils/service/provider.service'
import _ from 'lodash'
import { useOutputChange } from '../../utils/hooks/useOutputChange'

interface UseCsOpt {
  attrs: ComputedRef<CsAdapter>
}

const t = (window as any).t || ((key: string) => key)

export interface CsState {
  formOutput: Partial<FormOutput>
  searchButton: ButtonAdapter
  resetButton: ButtonAdapter
  originalModels: Record<string, any>
}
export const useCs = ({ attrs }: UseCsOpt) => {
  const state = reactive<CsState>({
    formOutput: {},
    originalModels: _.cloneDeep((attrs.value.form && attrs.value.form.models) || {}),
    searchButton: {
      text: t('搜索'),
      type: 'primary',
      onClick: search,
    },
    resetButton: {
      text: t('重置'),
      onClick() {
        attrs.value.onResetClick && attrs.value.onResetClick()
        state.resetButton.loading = true
        state.formOutput.reset && state.formOutput.reset()
        searchCt()
        state.resetButton.loading = false
      },
    },
  })
  function reset() {
    state.formOutput.reset && state.formOutput.reset()
  }
  /** 搜索方法 */
  async function searchCt() {
    const baseModels = (attrs.value.form && attrs.value.form.models) || {}
    const models = attrs.value.modelsHandler
      ? await attrs.value.modelsHandler(_.cloneDeep(baseModels))
      : _.cloneDeep(baseModels)
    if (attrs.value.searchHandler) {
      attrs.value.searchHandler(models)
    } else {
      emit({ type: 'ct-setParams', name: attrs.value.n || '' }, (params) => {
        _.assign(params, state.originalModels)
        return _.pickBy(
          _.assign(params, models),
          (v) => !_.isUndefined(v) && !_.isNull(v) && v !== ''
        )
      })
      emit({ type: 'ct-setPageNo', name: attrs.value.n || '' }, 1)
      emit({ type: 'ct-update', name: attrs.value.n || '' })
    }
  }

  if (attrs.value.searchButton) {
    state.searchButton = _.assign(state.searchButton, attrs.value.searchButton)
  }
  if (attrs.value.resetButton) {
    state.resetButton = _.assign(state.resetButton, attrs.value.resetButton)
  }

  /**
   * 为每个form添加点击enter搜索功能
   */
  attrs.value.form!.formItems?.forEach((item) => {
    item.onKeydown = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key === 'Enter') {
        search()
      }
    }
  })
  /** 在formItems末尾添加searchButton */
  const items = attrs.value.form!.formItems
  const width = attrs.value.form?.itemWidth || '25%'
  let no = 0
  const widthNumber = Number(width.split('%').join(''))
  if (width.endsWith('%')) {
    no = Math.floor(100 / widthNumber)
  }
  items?.forEach((item) => {
    item.width = item.width || width
  })
  const len = items?.length || 0
  const addItem: FormItemAdapter = {
    type: 'slot',
    width: attrs.value.operateButtonWidth
      ? attrs.value.operateButtonWidth
      : no
      ? widthNumber * (no - (len % no)) + '%'
      : 'fit-content',
    control: { name: 'csSearchButton' },
  }
  if (
    items &&
    !items.find((i: any) => i.control && i.control.name && i.control.name === 'csSearchButton')
  ) {
    items.push(addItem)
  }

  const { onOutputChange } = useOutputChange(state)

  const output = computed(() => ({
    searchCt,
    reset,
  }))
  return { output, state, onOutputChange }

  function search() {
    attrs.value.onSearchClick && attrs.value.onSearchClick()
    state.searchButton.loading = true
    searchCt()
    state.searchButton.loading = false
  }
}
