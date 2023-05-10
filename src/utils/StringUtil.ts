import { _ } from './LodashUtil'
import RegExps from '@/constant/RegExps'

export default class StringUtil {
  /**
   * @name: bỏ dấu tiếng việt (ex: tiếng việt => tieng viet)
   * @param str
   * @return {string}
   */
  static removeAccents = (str: string) => {
    const AccentsMap = RegExps['lang-vi']

    for (let i = 0; i < AccentsMap.length; i += 1) {
      const re = new RegExp(`[${AccentsMap[i].substr(1)}]`, 'g')
      const char = AccentsMap[i][0]

      str = str?.replace(re, char)
    }

    return str
  }

  /**
   * @name: Format làm tròn số
   * @param number: số cần làm tròn
   * @param numFixed: làm tròn đến bao nhiêu số thập phân
   * @return {string}
   */
  static decimalToFixed = (numberFix = 0, numFixed: number) => {
    const num = numberFix.toFixed(numFixed)
    const arrNum = num.split('.')
    if (Number(arrNum[1]) === 0)
      return Number(arrNum[0])

    return Number(Number(num).toString())
  }

  static formatFullName = (firstName: string, lastName: string) => {
    const lang = localStorage.getItem('lang') === null ? 'vi' : localStorage.getItem('lang')
    switch (lang) {
      case 'vi':
        return `${lastName || '-'} ${firstName || '-'}`
      case 'en':
        return `${firstName || '-'} ${lastName || '-'}`
      default:
        return `${lastName || '-'} ${firstName || '-'}`
    }
  }

  static generateRandomKey = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }
}
