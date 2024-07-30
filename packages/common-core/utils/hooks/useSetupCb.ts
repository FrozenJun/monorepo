import { ElCommonAdapter } from '../dtos'
import { ComputedRef, getCurrentInstance } from 'vue'

interface SetupCbOpt {
  attrs: ComputedRef<Partial<ElCommonAdapter<any, any, string>>>
  output: ComputedRef<Record<string, any>>
}
export const useSetupCb = ({ attrs, output }: SetupCbOpt) => {
  const instance = getCurrentInstance()

  attrs.value.onSetup && attrs.value.onSetup({ attrs: attrs.value, output: output.value, instance })
}
