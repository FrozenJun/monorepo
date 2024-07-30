// import Vue from 'vue';
import _ from 'lodash'
import { nextTick } from 'vue'

_.mixin({ defaultsDeepSafe: defaultsDeepPreserveArray })
_.mixin({ assignWithObjectDeep: assignWithObjectDeep })
_.mixin({ assignModelsWithObjectDeep: assignModelsWithObjectDeep })

/**
 * 将源对象完全拷贝层目标对象
 * vue无法发现对象属性的插入和删除，所以需要使用$set,$delete
 * @param object 源对象
 * @param source 源对象要完全拷贝的目标对象
 */
// export function reset(object: Record<string, any>, source?: Record<string, any>): void {
//   if (!source) return;
//   // 删除source中不存在的属性
//   _(object)
//     .omit(_.keys(source))
//     .keys()
//     .forEach((key) => {
//       Vue.delete(object, key);
//     });
//   // 遍历source，覆盖源对象对应属性
//   _(_.cloneDeep(source)).forOwn((value, key) => {
//     Vue.set(object, key, value);
//   });
// }

/**
 * 将目标对象值不为undefined的数据拷贝至源对象
 * @param object 源对象
 * @param sources 源对象要拷贝的目标对象
 */
// export function assignWithoutUndefined(
//   object: Record<string, any>,
//   ...sources: Record<string, any>[]
// ): void {
//   function customizer(obj: any, src: any) {
//     return _.isUndefined(obj) ? src : obj;
//   }
//   const defaults = _.partialRight(_.assignWith, customizer) as any;
//   defaults(object, ...sources);
// }

/**
 * 类似defaultsDeep，但是不会对array进行深度遍历，
 * @param object 目标对象
 * @param sources 来源对象
 */
function defaultsDeepPreserveArray(object: Record<string, any>, ...sources: Record<string, any>[]) {
  /**
   * 类似_.merge,但是对数组不进行遍历
   * 为了防止defaultsDeep时对数组进行多余的遍历赋值导致最后的值偏离预期
   */
  const d = {}
  ;[object, ...sources].reverse().forEach((source) => {
    _.mergeWith(d, source, preserveArrayInterceptor)
  })
  _.defaultsDeep(object, d)
  return object
}

/**
 * 类似assign，但是会对对象进行深度遍历，
 * @param object 目标对象
 * @param source 来源对象
 */
function assignWithObjectDeep(object: Record<string, any>, source: Record<string, any>) {
  return _.assignWith(object, source, assignDeepCustomizer)
}
/**
 * 类似assign，但是会对对象进行深度遍历，
 * @param object 目标对象
 * @param source 来源对象
 */
function assignModelsWithObjectDeep(
  object: Record<string, any>,
  source: Record<string, any>,
  extraKeys: string[] = []
) {
  const customizer = assignModelsDeepCustomizer(extraKeys)
  return _.assignWith(object, source, customizer)
}

/**
 * 如果srcValue是数组，直接返回整个srcValue
 * @param objValue 目标值
 * @param srcValue 来源值
 */
function preserveArrayInterceptor(objValue: any, srcValue: any) {
  if (_.isArray(srcValue)) {
    return srcValue
  }
}
function assignDeepCustomizer(objValue: any, srcValue: any): any {
  if (_.isPlainObject(objValue) && _.isPlainObject(srcValue)) {
    return _.assignWith(objValue, srcValue, assignDeepCustomizer)
  }
  return _.isUndefined(srcValue) ? objValue : srcValue
}
function assignModelsDeepCustomizer(extraKeys: string[]) {
  const fn = function (
    objValue: any,
    srcValue: any,
    key: string,
    object: Record<string, any>
  ): any {
    if (_.isPlainObject(objValue) && _.isPlainObject(srcValue)) {
      return _.assignWith(objValue, srcValue, fn)
    }
    if (_.isUndefined(objValue) && !_.isUndefined(srcValue) && !extraKeys.includes(key)) {
      nextTick(() => {
        Reflect.deleteProperty(object, key)
      })
      return
    }
    return _.isUndefined(srcValue) ? objValue : srcValue
  }
  return fn
}
