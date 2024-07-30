import { InputAdapter } from './input.adapter'
import { computed, ComputedRef, getCurrentInstance, SetupContext, watch } from 'vue'
import { COMPONENT_NAME } from '../../utils/constants/component'
import { useModelValue } from '../../utils/hooks/useModelValue'

interface UseInputOpt {
  attrs: ComputedRef<InputAdapter>
  props: Record<string, any>
  ctx: SetupContext<any>
}

export const useInput = ({ attrs, ctx, props }: UseInputOpt) => {
  const instance = getCurrentInstance()

  useModelValue({ props, attrs, ctx })

  function focus() {
    const input = instance!.refs[COMPONENT_NAME.input] as any
    input && input.focus()
  }
  function blur() {
    const input = instance!.refs[COMPONENT_NAME.input] as any
    input && input.blur()
  }
  function select() {
    const input = instance!.refs[COMPONENT_NAME.input] as any
    input && input.select()
  }

  const output = computed(() => ({
    focus,
    blur,
    select,
  }))
  return { output }
}
