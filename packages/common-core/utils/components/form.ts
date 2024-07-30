import { FormItemAdapter } from '../../ant-design/form-item/form-item.adapter'
import { FormAdapter } from '../../ant-design/form/form.adapter'

export function getFormItemByProp(
  itemProp: string,
  form: FormAdapter
): FormItemAdapter | undefined {
  const items = form.formItems || []
  return items.find((item) => item.prop === itemProp)
}

export function getFormItemByLabel(
  itemLabel: string,
  form: FormAdapter
): FormItemAdapter | undefined {
  const items = form.formItems || []
  return items.find((item) => item.label === itemLabel)
}

export function getFormControlByProp<T>(itemProp: string, form: FormAdapter): T | undefined {
  const items = form?.formItems || []
  const item = items.find((item) => item.prop === itemProp)
  return item && (item.control as T)
}
