import { FormUnitAdapter } from './form-unit.adapter'
import { computed, ComputedRef, reactive, ref, SetupContext, watch } from 'vue'

interface UseFormUnitOpt {
  attrs: ComputedRef<FormUnitAdapter>
  ctx: SetupContext<('output-change' | 'update:modelValue')[]>
}

export const useFormUnit = ({ attrs, ctx }: UseFormUnitOpt) => {
  const { modelValue } = useModelValue(attrs, ctx)

  const output = computed(() => ({}))
  return { output, modelValue }
}

function useModelValue(
  attrs: ComputedRef<FormUnitAdapter>,
  ctx: SetupContext<('output-change' | 'update:modelValue')[]>
) {
  const modelValue = ref<any>(undefined)

  watch(
    () => attrs.value.modelValue,
    (v) => {
      modelValue.value = v
    },
    { immediate: true }
  )

  watch(modelValue, (v) => {
    ctx.emit('update:modelValue', v)
  })

  return {
    modelValue,
  }
}
