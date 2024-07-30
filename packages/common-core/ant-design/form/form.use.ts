import { FormAdapter, FormOutput } from './form.adapter'
import {
  computed,
  ComputedRef,
  getCurrentInstance,
  inject,
  onUnmounted,
  provide,
  reactive,
  watch,
} from 'vue'
import { HttpReturnType } from '../../http/src/http.dto'
import { FORM_VALIDATE_FAIL_ERROR, ASYNC_DATA_API_INVALID } from '../../utils/constants/errors'
import { ValidateResult } from '../../utils/dtos'
import { useAsyncData } from '../../utils/hooks/useAsyncData'
import _ from 'lodash'

interface UseFormOpt {
  attrs: ComputedRef<FormAdapter>
  props: Record<string, any>
}

export interface FormState {
  originalModels: Record<string, any>
  prevModels: Record<string, any>
  loading: boolean
  formIndex: ComputedRef<number | undefined>
}

export const useForm = ({ props, attrs }: UseFormOpt) => {
  const instance = getCurrentInstance()!
  provide('formAttrs', attrs)
  const registerForm = inject('formGroupFormRegister', () => ({})) as (form: any) => void
  registerForm({
    id: instance.uid,
    formName: attrs.value.n,
    validate,
    reset,
    resetValidate,
  })
  const logoutForm = inject('formGroupFormLogout', () => ({})) as (id: number) => void
  onUnmounted(() => {
    logoutForm(instance.uid)
  })

  const state = reactive<FormState>({
    loading: false,
    prevModels: {},
    originalModels: _.cloneDeep(attrs.value.models || {}),
    formIndex: computed(() => {
      return _.isNumber(props.formIndex) ? props.formIndex : attrs.value.formIndex
    }),
  })

  /**
   * formIndex注入attrs中
   */
  watch(
    () => props.formIndex,
    (v) => {
      if (_.isNumber(v)) attrs.value.formIndex = v
    },
    { immediate: true }
  )

  watch(
    () => attrs.value.max,
    (v) => {
      if (!_.isNumber(v)) return
      setTimeout(() => {
        attrs.value.formItems.forEach((i, index) => {
          i.hidden = v < index + 1
        })
      }, 0)
    },
    { immediate: true }
  )

  const submitAsync = useAsyncData(attrs.value.submit)
  const modelsAsync = useAsyncData(attrs.value.asyncModels)
  const output = computed<FormOutput>(() => ({
    reset,
    setModels,
    setOriginalModals,
    resetValidate,
    validate,
    submit,
    initModelsAsync,
  }))

  watch(
    () => modelsAsync.data.value,
    (v) => {
      if (attrs.value.asyncModels) {
        if (v) _.assign(attrs.value.models, v)
        state.loading = !!attrs.value.asyncModels.loading
      }
    }
  )

  /**
   * TODO 是否可以通过每个子组件的onModelChange触发
   */
  watch(
    attrs.value.models!,
    async (v) => {
      _.isFunction(attrs.value.onModelsChange) &&
        attrs.value.onModelsChange(v, state.prevModels, {
          attrs: attrs.value,
          output: output.value,
          instance,
        })
      state.prevModels = _.cloneDeep(v)
      attrs.value.modelsOutput = attrs.value.modelsHandler
        ? await attrs.value.modelsHandler(_.cloneDeep(v))
        : _.cloneDeep(v)
    },
    { immediate: true, deep: true }
  )
  return { output, state }

  async function submit(cb: (res: HttpReturnType) => unknown): Promise<HttpReturnType> {
    const { valid } = await validate()
    if (!valid) {
      const res = { e: true, error: new Error(FORM_VALIDATE_FAIL_ERROR) }
      cb(res)
      return res
    }
    if (attrs.value.submit && _.isFunction(attrs.value.submit.api)) {
      submitAsync.setParams(attrs.value.models || {})
      const res = await submitAsync.sendAlways()
      cb(res)
      return res
    } else {
      const res = { e: true, error: new Error(ASYNC_DATA_API_INVALID) }
      cb(res)
      return res
    }
  }

  async function initModelsAsync(cb: (res: HttpReturnType) => unknown): Promise<HttpReturnType> {
    if (attrs.value.asyncModels && _.isFunction(attrs.value.asyncModels.api)) {
      const res = await modelsAsync.sendAlways()
      cb(res)
      return res
    } else {
      const res = { e: true, error: new Error(ASYNC_DATA_API_INVALID) }
      cb(res)
      return res
    }
  }

  function setModels(
    models: Record<string, any> | ((oldModels?: Record<string, any>) => Record<string, any>)
  ) {
    if (_.isFunction(models)) {
      attrs.value.models = reactive(models(attrs.value.models))
    } else {
      attrs.value.models = reactive(models)
    }
  }

  function reset() {
    // 这里深拷贝防止一些初始值为数组等引用类型时，reset每次都是改变同一个引用类型变量
    _.assign(attrs.value.models, _.cloneDeep(state.originalModels))
    Object.keys(_.omit(attrs.value.models, Object.keys(state.originalModels))).forEach(
      (key) => attrs.value.models && Reflect.deleteProperty(attrs.value.models, key)
    )
    // 同步也需要，有些时候业务要求同步执行reset
    resetValidate()
    // 但同样深拷贝会导致reset时，数组等引用类型的model会认为值改变了导致触发验证，这个操作可能是微任务异步的，所以下面用setTimeout而不是nextTick
    setTimeout(resetValidate, 0)
  }

  function resetValidate() {
    const validationRef = instance.refs.validationForm as any
    // 验证的时候可能form已经被销毁
    validationRef && validationRef.resetForm()
  }

  function setOriginalModals(models: Record<string, any>) {
    state.originalModels = _.cloneDeep(models)
  }

  async function validate(cb?: (validateResult: ValidateResult) => unknown) {
    const validationRef = instance.refs.validationForm as any
    if (!validationRef) return
    const validateResult = await validationRef.validate()
    _.isFunction(attrs.value.onValidate) && attrs.value.onValidate(validateResult)
    _.isFunction(cb) && cb(validateResult)
    return validateResult
  }
}
