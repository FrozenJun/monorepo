// import { NonFunctionKeys, SetIntersection } from 'utility-types'
// import { RequiredKeys } from './required-keys.type'
// import { OptionalKeys } from './optionals-keys.type'

// /**
//  * 提取出class中所有非函数的类型
//  */
// export type NonFunction<T> = {
//   [K in SetIntersection<NonFunctionKeys<T>, RequiredKeys<T>>]: T[K]
// } &
//   {
//     [K in SetIntersection<NonFunctionKeys<T>, OptionalKeys<T>>]?: T[K]
//   }
