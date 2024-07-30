import { CtAdapter } from '../ct/ct.adapter'
import { ModalAdapter } from '../../ant-design/modal/modal.adapter'
import { NestedFormAdapter } from './nested-form.adapter'
import { computed, ComputedRef, reactive, SetupContext, watch } from 'vue'
import { useModelValue } from '../../utils/hooks/useModelValue'
import { emit } from '../../utils/service/provider.service'
import _ from 'lodash'

interface UseNestedFormOpt {
  attrs: ComputedRef<NestedFormAdapter>
  props: Record<string, any>
  ctx: SetupContext<any>
}
interface NestedFormStatus {
  modal: ModalAdapter
  ct: CtAdapter
  onEdit: () => void
}

export const useNestedForm = ({ attrs, ctx, props }: UseNestedFormOpt) => {
  useModelValue({ props, attrs, ctx })

  const name = 'nested-form' + Math.random()
  const status = reactive<NestedFormStatus>({
    modal: {
      n: name,
      title: '编辑',
      width: '65%',
      footer: null,
      zIndex: 1030,
    },
    ct: {},
    onEdit() {
      emit({ type: 'modal-open', name })
    },
  })

  watch(
    () => attrs.value.modelValue,
    (v, oldv) => {
      v !== oldv &&
        JSON.stringify(v) !== JSON.stringify(oldv) &&
        _.isFunction(attrs.value.onChange) &&
        attrs.value.onChange(v)
    }
  )

  const modelValueFormat = computed(() => {
    return JSON.stringify(attrs.value.modelValue)
  })

  const output = computed(() => ({}))
  return { output, status, modelValueFormat }
}
