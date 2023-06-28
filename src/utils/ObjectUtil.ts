import { _ } from './LodashUtil'

export default class ObjectUtil {
  /**
   * @param value
   * @return {boolean|boolean}
   */
  static isEmpty(value: any) {
    return (
      value === undefined
          || value === null
          || (typeof value === 'object' && _.isEmpty(value))
          || (typeof value === 'string' && value.trim().length === 0)
    )
  }

  /**
       * @param value
       * @return {boolean}
       */
  static isNotEmpty(value: any) {
    return !this.isEmpty(value)
  }

  /**
       * @param value
       * @param defaultValue
       * @return {string}
       */
  static nvl(value: any, defaultValue: any) {
    if (this.isEmpty(value))
      return defaultValue

    return value
  }

  /**
       * @param value
       * @return {boolean}
       */
  static isArray(value: any) {
    return !!value && value.constructor === Array
  }

  /** xóa null object
   * @param objs
   * @return {boolean}
   */
  static omitByDeep: any = (objs: any) => {
    return _.transform(objs, (result: any, value, key) => {
      if (_.isObject(value)) {
        const newVal = ObjectUtil.omitByDeep(value)
        if (!_.isEmpty(newVal))
          result[key] = newVal
      }
      else if (_.isNumber(value) || 0 || (!_.isNil(value) && !_.isEmpty(value))) {
        result[key] = value
      }
    })
  }
}
