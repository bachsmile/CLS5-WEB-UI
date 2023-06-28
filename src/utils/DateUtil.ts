import moment from 'moment'

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
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(serial)) {
      dateInfo = new Date(serial)
    }
    else {
      const utcDays = Math.floor(serial - 25569)
      const utcValue = utcDays * 86400

      dateInfo = new Date(utcValue * 1000)
    }
    if (Object.prototype.toString.call(dateInfo) === '[object Date]') {
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(dateInfo.getTime()))
        return serial

      return `${dateInfo.getDate()}/${dateInfo.getMonth() + 1}/${dateInfo.getFullYear()}`
    }

    return serial
  }

  // format date to DD/MM/YYYY
  static formatDateToDDMM = (value: any) => {
    if (!value)
      return ''
    return moment(String(value)).format('DD/MM/YYYY')
  }

  static formatSecond = (seconds: any) => {
    seconds = Math.round(seconds)
    if (seconds === null || seconds === undefined)
      return '-'
    if (seconds >= 3600) {
      const hour = Math.floor(seconds / 3600)
      const minute = Math.floor((seconds % 3600) / 60)
      const second = seconds - (hour * 3600 + minute * 60)
      return second === 0 ? `${hour}h${minute}m` : `${hour}h${minute}m${second}s`
    }
    if (seconds >= 60 && seconds < 3600) {
      const minute = Math.floor(seconds / 60)
      const second = seconds - (minute * 60)
      return second === 0 ? `${minute}m` : `${minute}m${second}s`
    }
    if (seconds < 60 && seconds >= 0)
      return `${seconds}s`

    return 0
  }
}
