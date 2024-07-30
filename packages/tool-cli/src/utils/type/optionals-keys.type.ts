/**
 * 获取类型的所有可选的key
 *
 * @see https://stackoverflow.com/questions/52984808/is-there-a-way-to-get-all-required-properties-of-a-typescript-object
 */
export type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never
}[keyof T]
