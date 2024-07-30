export type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>

/**
 * 移除指定嵌套的类型
 * ```typescript
 * interface Source { name: string; other: { n: number; b: string; }; }
 * type name = OmitNested<source, 'other', 'n'> // { name: string; other: { b: string } }
 * ```
 */
export type OmitNested<T, K extends keyof T, P extends string> = {
  [Q in keyof T]: Q extends K ? Omit<T[Q], P> : T[Q]
}
