import { InputNumberRangeAdapter } from './input-number-range.adapter'
import { computed, ComputedRef, ref, SetupContext, watch } from 'vue'
import _ from 'lodash'

interface UseInputNumberRangeOpt {
  attrs: ComputedRef<InputNumberRangeAdapter>
  props: Record<string, any>
  ctx: SetupContext<any>
}

export const useInputNumberRange = ({ attrs, ctx, props }: UseInputNumberRangeOpt) => {
  attrs.value.startInputNumber = attrs.value.startInputNumber || {}
  attrs.value.endInputNumber = attrs.value.endInputNumber || {}
  const sInputNumber = attrs.value.startInputNumber
  const eInputNumber = attrs.value.endInputNumber
  const sModelValue = ref<number>()
  const eModelValue = ref<number>()

  const sfn = sInputNumber.onModelChange
  sInputNumber.onModelChange = (v, oldv) => {
    sfn && sfn(v, oldv)
    if (v && _.isNumber(eModelValue.value) && v > eModelValue.value) {
      sModelValue.value = eModelValue.value
    }
    // 这里不能使用 attrs.value.modelValue[0] = v
    // 因为attrs.value.modelValue没有深度监听
    attrs.value.modelValue = [v as number, eModelValue.value!]
    ctx.emit('update:modelValue', attrs.value.modelValue)
  }
  sInputNumber.onBlur = () => {
    if (
      _.isNumber(sModelValue.value) &&
      _.isNumber(eModelValue.value) &&
      sModelValue.value > eModelValue.value
    ) {
      sModelValue.value = eModelValue.value
      attrs.value.modelValue = [sModelValue.value as number, eModelValue.value!]
      ctx.emit('update:modelValue', attrs.value.modelValue)
    }
  }

  const efn = eInputNumber.onModelChange
  eInputNumber.onModelChange = (v, oldv) => {
    efn && efn(v, oldv)
    attrs.value.modelValue = [sModelValue.value!, v as number]
    ctx.emit('update:modelValue', attrs.value.modelValue)
  }
  eInputNumber.onBlur = () => {
    if (
      _.isNumber(sModelValue.value) &&
      _.isNumber(eModelValue.value) &&
      sModelValue.value > eModelValue.value
    ) {
      eModelValue.value = sModelValue.value
      attrs.value.modelValue = [sModelValue.value!, eModelValue.value as number]
      ctx.emit('update:modelValue', attrs.value.modelValue)
    }
  }

  watch(
    () => attrs.value.modelValue,
    (v, oldv) => {
      if (!v || !v.length || (!v[0] && !v[1])) {
        // 重置了
        sModelValue.value = undefined
        eModelValue.value = undefined
      }
    }
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
  return { output, sModelValue, eModelValue }
}
