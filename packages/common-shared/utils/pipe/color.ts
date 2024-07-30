export const hex2rgb = (hex = ''): string => {
  const rgb = hex2rgbValue(hex)
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
}
export const hex2rgbValue = (hex = ''): number[] => {
  // 针对于传入错误的hex,即长度不等于7或者不等于4的
  if (![4, 7].includes(hex.length)) {
    throw new Error('格式错误')
  }

  let result = hex.slice(1)

  // 如果是颜色叠值, 统一转换成6位颜色值
  if (result.length === 3) {
    result = result
      .split('')
      .map((a) => `${a}${a}`)
      .join('')
  }

  const rgb: number[] = []

  // 计算hex值
  for (let i = 0, len = result.length; i < len; i += 2) {
    rgb[i / 2] = getHexVal(result[i]) * 16 + getHexVal(result[i + 1])
  }

  function getHexVal(letter: string): number {
    let num = -1
    switch (letter.toUpperCase()) {
      case 'A':
        num = 10
        break
      case 'B':
        num = 11
        break
      case 'C':
        num = 12
        break
      case 'D':
        num = 13
        break
      case 'E':
        num = 14
        break
      case 'F':
        num = 15
        break
    }

    if (num < 0) {
      num = Number(letter)
    }

    return num
  }
  return [rgb[0], rgb[1], rgb[2]]
}

export const rgb2hex = (rgb: string): string => {
  const str = rgb.replace(/rgb\((.*)\)/g, '$1')
  const strArr = str.split(',').map((t) => t.trim())

  const result: string[] = []

  for (let i = 0, len: number = strArr.length; i < len; i++) {
    const curVal = Number(strArr[i])
    const left = getHexStr(String(Math.floor(curVal / 16)))
    const right = getHexStr(String(Math.floor(curVal % 16)))
    result[i] = left + right
  }

  function getHexStr(v: string): string {
    let str = ''
    switch (v) {
      case '10':
        str = 'A'
        break
      case '11':
        str = 'B'
        break
      case '12':
        str = 'C'
        break
      case '13':
        str = 'D'
        break
      case '14':
        str = 'E'
        break
      case '15':
        str = 'F'
        break
    }

    if (!str) {
      str = v
    }

    return str
  }

  return `#${result.join('')}`
}
