interface TextStylesDto {
  reset: number[]
  bold: number[]
  dim: number[]
  italic: number[]
  underline: number[]
  inverse: number[]
  hidden: number[]
  strikethrough: number[]

  black: number[]
  red: number[]
  green: number[]
  yellow: number[]
  blue: number[]
  magenta: number[]
  cyan: number[]
  white: number[]
  gray: number[]

  bgBlack: number[]
  bgRed: number[]
  bgGreen: number[]
  bgYellow: number[]
  bgBlue: number[]
  bgMagenta: number[]
  bgCyan: number[]
  bgWhite: number[]

  [k: string]: number[]
}

const TEXT_STYLES: TextStylesDto = {
  reset: [0, 0],
  bold: [1, 22],
  dim: [2, 22],
  italic: [3, 23],
  underline: [4, 24],
  inverse: [7, 27],
  hidden: [8, 28],
  strikethrough: [9, 29],

  black: [30, 39],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
  magenta: [35, 39],
  cyan: [36, 39],
  white: [37, 39],
  gray: [90, 39],

  bgBlack: [40, 49],
  bgRed: [41, 49],
  bgGreen: [42, 49],
  bgYellow: [43, 49],
  bgBlue: [44, 49],
  bgMagenta: [45, 49],
  bgCyan: [46, 49],
  bgWhite: [47, 49],
}

const colors: Record<keyof TextStylesDto, Function> = {} as Record<keyof TextStylesDto, Function>
Object.keys(TEXT_STYLES).forEach((key) => {
  const vv = TEXT_STYLES[key]
  colors[key] = (x: string) => `\u001b[${vv[0]}m${x}\u001b[${vv[1]}m`
})

export { colors }
