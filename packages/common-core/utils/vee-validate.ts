import {
  MOBILE_REGEXP,
  ID_CARD_REGEXP,
  TELEPHONE_REGEXP,
  POS_INT_REGEXP,
  POS_FLOAT_REGEXP,
  CHINESE_REGEXP,
  PASSPORT_REGEXP,
  IP_REGEXP,
  PASSWORD_REGEXP,
  PLATE_NUMBER_REGEXP,
  IP_PORT_REGEXP,
} from './constants/reg-exp'
import { defineRule, configure } from 'vee-validate'
import { all as rules } from '@vee-validate/rules'
import { localize, setLocale } from '@vee-validate/i18n'

import cn from '@vee-validate/i18n/dist/locale/zh_CN.json'
import us from '@vee-validate/i18n/dist/locale/en.json'
import ru from '@vee-validate/i18n/dist/locale/ru.json'
import { STORAGE_KEY, ELangType } from 'common-base/locales'
// vee.lang.json
const t = (window as any).t || ((key: string) => key)
const lang = localStorage.getItem(STORAGE_KEY) || ELangType.中文
const isEn = lang === ELangType.英文
const isRu = lang === ELangType.俄文

Object.keys(rules).forEach((rule) => {
  defineRule(rule, rules[rule])
})

configure({
  generateMessage: localize(isEn ? { us } : isRu ? { ru } : { cn }),
})
setLocale(isEn ? 'us' : isRu ? 'ru' : 'cn')

// 身份证
defineRule('IDCard', (value: string) => {
  if (isEmpty(value)) return true
  return ID_CARD_REGEXP.test(value) || t('身份证格式不正确')
})
// 手机号验证
defineRule('mobile', (value: string) => {
  if (isEmpty(value)) return true
  return MOBILE_REGEXP.test(value) || t('手机号输入不正确')
})
// 固定电话验证
defineRule('telephone', (value: string) => {
  if (isEmpty(value)) return true
  return TELEPHONE_REGEXP.test(value) || t('固定电话输入不正确')
})
// 正整数
defineRule('pos_int', (value: string) => {
  if (isEmpty(value)) return true
  return POS_INT_REGEXP.test(value) || t('只能是正整数')
})
// 正实数
defineRule('pos_float', (value: string) => {
  if (isEmpty(value)) return true
  return POS_FLOAT_REGEXP.test(value) || t('只能是正实数')
})
// 非负浮点数
defineRule('no_neg_float', (value: string) => {
  if (isEmpty(value)) return true
  return /^\d+(\.\d+)?$/.test(value) || t('只能是非负实数')
})
// 汉字
defineRule('chinese', (value: string) => {
  if (isEmpty(value)) return true
  return CHINESE_REGEXP.test(value) || t('只能是汉字')
})
// 数字或大写字母
defineRule('upper_num', (value: string) => {
  if (isEmpty(value)) return true
  return /^[A-Z0-9]+$/.test(value) || t('只能是数字或者大写字母')
})
// 地址 - 汉字、数字、—。
defineRule('address', (value: string) => {
  if (isEmpty(value)) return true
  return /^[\u4e00-\u9fa5A-Za-z0-9-]+$/.test(value) || t('只能由汉字、数字、大小写字母、—组成')
})
// 不包含数字
defineRule('no_num', (value: string) => {
  return /^[\D]+$/.test(value) || t('不能包含数字')
})
// 不包含特殊字符
defineRule('no_special', (value: string) => {
  if (isEmpty(value)) return true
  return /^[\u4e00-\u9fa5A-Za-z0-9]{0,}$/.test(value) || t('不能包含特殊字符')
})
// 护照
defineRule('hz', (value: string) => {
  if (isEmpty(value)) return true
  return PASSPORT_REGEXP.test(value) || t('请输入正确的护照')
})
// windows文件名合法
defineRule('filename_valid', (value: string) => {
  if (isEmpty(value)) return true
  return /^[^\\/:*?"<>|]+(\.[^\\/:*?"<>|]+)*$/.test(value) || t('文件名不合法')
})
// IP
defineRule('ip', (value: string) => {
  if (isEmpty(value)) return true
  return IP_REGEXP.test(value) || t('请输入正确的IP地址')
})
// IP
defineRule('ip_port', (value: string) => {
  if (isEmpty(value)) return true
  return IP_PORT_REGEXP.test(value) || t('请输入正确的IP地址和端口号')
})
// 确认密码
defineRule('confirmed', (value: string, [target]: any, ctx) => {
  return value === ctx.form[target] || t('确认密码和密码不一致')
})
// 密码至少8位且包含数字字母特殊字符
defineRule('password', (value: string) => {
  if (isEmpty(value)) return true
  return PASSWORD_REGEXP.test(value) || t('密码至少8位且包含数字字母特殊字符')
})
// 车牌
defineRule('plate_number', (value: string) => {
  if (isEmpty(value)) return true
  return PLATE_NUMBER_REGEXP.test(value) || t('请输入正确车牌号')
})
/**
 * 至少存在一个值
 *
 * ```javascript
 * rules: 'at_least_one:@field1,@field2'
 * ```
 */
defineRule('at_least_one', (value: any, targets) => {
  const values = [value, ...targets]
  const isValid = values.some((v) => {
    if (Array.isArray(v)) {
      return !!v.length
    }
    return !!v
  })
  return isValid || t('至少需要有一个值')
})

export function isEmpty(value: any) {
  if (value === null || value === undefined || value === '') {
    return true
  }
  if (Array.isArray(value) && value.length === 0) {
    return true
  }
  return false
}
