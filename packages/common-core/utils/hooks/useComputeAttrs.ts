import { NATIVE_ATTRS } from '../constants/omitKeys'
import { ElCommonAdapter } from '../dtos'
import { COMPONENT_TYPE } from '../constants/component'
import { computed, getCurrentInstance, reactive, watch } from 'vue'
import _ from 'lodash'
import { getConfig } from '../config'
import { DEFAULT_OMIT_KEYS } from '../constants/omitKeys'

interface ComputeAttrsOpt {
  props: Readonly<Record<string, any>>
  defaultOption: Record<string, any>
  type: COMPONENT_TYPE
  omitKeys: string[]
}

export const useComputeAttrs = <T extends ElCommonAdapter<any, any, string>>({
  props,
  defaultOption,
  type,
  omitKeys,
}: ComputeAttrsOpt) => {
  const instance = getCurrentInstance()

  const $$listener = _(instance!.attrs)
    .pickBy((v, key) => key.startsWith('on') && _.isFunction(v))
    .value()

  const $$native = _(instance!.attrs)
    .pickBy((v, key) => NATIVE_ATTRS.includes(key))
    .value()

  const $$props = computed(() => {
    return _(props).pick('modelValue').omitBy(_.isUndefined).value()
    // return _(props).omitBy(_.isUndefined).omit('c').value()
  })

  const $$state = computed(() => {
    if (props.c.states) {
      const { state, states } = props.c.states
      const currentState = states.find((item: any) => item.name === state)
      // 防止状态被污染，使用cloneDeep
      return currentState ? _.cloneDeep(currentState.c) : {}
    }
    return {}
  })

  // 不要在computed中设置响应式，可能会导致死循环
  let baseAttrs = reactive(props.c)
  watch(
    () => props.c,
    (v) => {
      baseAttrs = reactive(v)
    }
  )
  const attrs = computed<T>(() => {
    /**
     * TODO $listener与props.c中的回调重复时合并而非覆盖
     */
    const res = _(baseAttrs)
      .defaultsDeepSafe($$listener) // props.c的回调会覆盖写在html中的回调
      .defaultsDeepSafe($$native)
      // TODO: 可能会导致死循环，暂时只添加modelValue
      // TODO: defaultsDeepSafe会导致modelValue修改不会影响attrs
      .defaultsDeepSafe($$props.value)
      .defaultsDeepSafe(getConfig(type) || {})
      .defaultsDeepSafe(defaultOption)
      .assignWithObjectDeep($$state.value)
      .value()
    return res
  })

  const binds = computed(() => {
    return _.omit(attrs.value, ...omitKeys, ...DEFAULT_OMIT_KEYS)
  })

  return {
    attrs,
    binds,
  }
}
