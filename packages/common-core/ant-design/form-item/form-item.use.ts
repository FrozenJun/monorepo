import { ArrayFormAdapter } from '../array-form/array-form.adapter'
import { FormItemAdapter, FormItemAlign, FormItemSlotConfig } from './form-item.adapter'
import {
  computed,
  ComputedRef,
  getCurrentInstance,
  inject,
  reactive,
  ref,
  SetupContext,
  watch,
} from 'vue'
import { FormAdapter } from '../form/form.adapter'
import _ from 'lodash'

interface UseFormItemOpt {
  attrs: ComputedRef<FormItemAdapter>
  props: Record<string, any>
  ctx: SetupContext<('output-change' | 'update:modelValue')[]>
}

export interface FormItemState {
  align: ComputedRef<FormItemAlign | undefined>
  isRequired: ComputedRef<boolean>
  slotConfig: ComputedRef<FormItemSlotConfig>
  models: Record<string, any>
  fieldName: ComputedRef<string>
  rules: ComputedRef<string | Record<string, any> | undefined>
}

export const useFormItem = ({ attrs, props, ctx }: UseFormItemOpt) => {
  const formAttrs = inject<ComputedRef<FormAdapter>>(
    'formAttrs',
    computed(() => ({}))
  )
  const arrayFormAttrs = inject<ComputedRef<ArrayFormAdapter>>(
    'arrayFormAttrs',
    computed(() => ({}))
  )

  const state = reactive<FormItemState>({
    align: computed(() => attrs.value.align || formAttrs.value.itemAlign),
    isRequired: computed(() => {
      const rules = attrs.value.rules
      return rules && (_.isString(rules) ? rules.includes('required') : rules.required)
    }),
    slotConfig: computed(() => {
      if (attrs.value.type === 'slot') {
        const slot = attrs.value.control || {}
        return {
          name: slot.name,
          scope:
            typeof props.formIndex === 'number'
              ? { formIndex: props.formIndex, ...slot.scope }
              : slot.scope,
        }
      }
      return {}
    }),
    models: computed(() => {
      /**
       * 因为array-form使用了formItem而非form，这里需要单独设置models
       */
      const res =
        arrayFormAttrs.value &&
        arrayFormAttrs.value.modelValue &&
        typeof props.formIndex === 'number'
          ? arrayFormAttrs.value.modelValue![props.formIndex]
          : formAttrs.value.models
      return attrs.value.models || res || {}
    }),
    fieldName: computed(() => {
      // 为每个表单验证字段name独一无二，在arrayForm中name = fieldName + formIndex
      const fieldName = attrs.value.validateFieldName || attrs.value.label || attrs.value.prop || ''
      if (typeof props.formIndex === 'number') {
        return fieldName + props.formIndex
      } else {
        return fieldName
      }
    }),
    rules: computed(() => {
      // 当formIndex存在时，替换rules中 :(@) | 和 :(@) , 之间的fieldName添加formIndex
      if (typeof props.formIndex === 'number' && typeof attrs.value.rules === 'string') {
        return attrs.value.rules.replaceAll(/([,:]@?)(.+)([|,]?)/g, `$1$2${props.formIndex}$3`)
      } else {
        return attrs.value.rules
      }
    }),
  })
  const modelValue = ref()
  watch(
    () => props.modelValue,
    (v) => {
      if (modelValue.value !== v) modelValue.value = v
    },
    {
      immediate: true,
    }
  )
  watch(
    () => state.models,
    () => {
      if (!props.modelValue && props.modelValue !== 0) deepAddProp()
    },
    {
      flush: 'post',
      immediate: true,
      deep: true,
    }
  )
  watch(
    modelValue,
    (v) => {
      if (!props.modelValue) setAttr(v)
      ctx.emit('update:modelValue', v)
    },
    { deep: true }
  )

  function deepAddProp() {
    if (!attrs.value.prop) return
    const props = attrs.value.prop?.split('.') || []
    modelValue.value = props.reduce((prev, cur) => {
      return prev[cur]
    }, state.models)
  }
  function setAttr(value) {
    const props = attrs.value.prop?.split('.') || []
    props.reduce((prev, cur, index) => {
      if (index === props.length - 1) {
        prev[cur] = value
      }
      return prev[cur]
    }, state.models)
  }

  const output = computed(() => ({}))
  return { output, formAttrs, state, modelValue }
}
