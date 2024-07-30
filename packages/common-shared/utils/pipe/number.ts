/**
 * 返回小数位数为digit的数字
 * @param value 需要处理的数据
 * @param digit 返回数据的小数位数
 */
export function numberDigitPipe(
  value: number | string,
  digit = 2,
  returnType: 'number' | 'string' = 'number'
) {
  if (digit < 0 || !value) return value
  const res = Math.round(Number(value) * Math.pow(10, digit)) / Math.pow(10, digit)
  return returnType === 'number' ? res : String(res)
}
