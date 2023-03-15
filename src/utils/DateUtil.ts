export default class DateUtil {
  /**
   * @name: get message error
   * @param str
   * @return {string}
   */
  static getDate = (serial: any) => {
    if (serial === null)
      return null
    if (serial.toString().includes('/'))
      return serial
    let dateInfo = null

    // const date = new Date(Date.parse(serial))
    // const isoDateStr = date.toISOString()

    if (isNaN(serial)) {
      dateInfo = new Date(serial)
    }
    else {
      const utcDays = Math.floor(serial - 25569)
      const utcValue = utcDays * 86400

      dateInfo = new Date(utcValue * 1000)
    }
    if (Object.prototype.toString.call(dateInfo) === '[object Date]') {
      if (isNaN(dateInfo.getTime()))
        return serial

      return `${dateInfo.getDate()}/${dateInfo.getMonth() + 1}/${dateInfo.getFullYear()}`
    }

    return serial
  }
}
