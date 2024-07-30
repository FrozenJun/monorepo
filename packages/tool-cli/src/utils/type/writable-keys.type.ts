// import { IfEquals } from './if-equals.type'
// import { SetIntersection, NonFunctionKeys } from 'utility-types'

// export type WritableKeys<T extends object> = SetIntersection<
//   {
//     [P in keyof T]-?: IfEquals<
//       {
//         [Q in P]: T[P]
//       },
//       {
//         -readonly [Q in P]: T[P]
//       },
//       P
//     >
//   }[keyof T],
//   NonFunctionKeys<T>
// >
