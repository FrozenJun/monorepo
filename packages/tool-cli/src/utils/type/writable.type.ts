// import { SetIntersection } from 'utility-types'
// import { WritableKeys } from './writable-keys.type'
// import { RequiredKeys } from './required-keys.type'
// import { OptionalKeys } from './optionals-keys.type'

// /**
//  * 去除了函数和getter的类型
//  */
// export type Writable<T extends object> = {
//   [K in SetIntersection<WritableKeys<T>, RequiredKeys<T>>]: T[K]
// } &
//   {
//     [K in SetIntersection<WritableKeys<T>, OptionalKeys<T>>]?: T[K]
//   }
