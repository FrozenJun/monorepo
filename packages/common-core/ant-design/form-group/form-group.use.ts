import { FormGroupAdapter } from './form-group.adapter'
import { computed, ComputedRef, provide } from 'vue'
import { ValidateResult } from '../../utils/dtos'
import _ from 'lodash'

interface UseFormGroupOpt {
  attrs: ComputedRef<FormGroupAdapter>
}
type FromGroupForm = {
  validate: () => Promise<ValidateResult>
  resetValidate: () => void
  reset: () => void
  formName: string
  id: number
}
export const useFormGroup = ({ attrs }: UseFormGroupOpt) => {
  let forms: FromGroupForm[] = []
  const registerForm = (form: FromGroupForm) => {
    if (forms.some((item) => form.id === item.id)) return
    forms.push(form)
  }
  const logoutForm = (id) => {
    forms = forms.filter((form) => form.id !== id)
  }
  provide('formGroupFormRegister', registerForm)
  provide('formGroupFormLogout', logoutForm)

  const reset = () => {
    forms.forEach((form) => {
      form.reset()
    })
  }
  const resetValidate = () => {
    forms.forEach((form) => {
      form.resetValidate()
    })
  }
  async function validate(cb?: (res: ValidateResult) => unknown) {
    let validateResult = { valid: true, errors: {} }
    // console.log(forms)
    await Promise.all(
      forms.map(async (form) => {
        if (!validateResult.valid) return
        const result = await form.validate()
        if (!result.valid) {
          validateResult = result
        }
      })
    )
    _.isFunction(attrs.value.onValidate) && attrs.value.onValidate(validateResult)
    _.isFunction(cb) && cb(validateResult)
    return validateResult
  }

  const output = computed(() => ({
    reset,
    resetValidate,
    validate,
  }))
  return { output }
}
